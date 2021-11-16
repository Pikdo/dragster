#include "motorControl.h"
#include "definitions.h"

enum Mode_Status {
  NORMAL,
  TIMER_FOREWARD
} currentSatatus;

unsigned long finishTime;

//{1FD} M1 Foreward Down Inicia el avance en motor 1
//{1FU} M1 Foreward Up Finaliza el avance en motor 1
//{1BD} M1 Backward Down Inicia el retroceso en motor 1
//{1BU} M1 Backward Up Finaliza el retroceso en motor 1
//{2FD} M2 Foreward Down Inicia el avance en motor 2
//{2FU} M2 Foreward Up Finaliza el avance en motor 2
//{2BD} M2 Backward Down Inicia el retroceso en motor 2
//{2BU} M2 Backward Up Finaliza el retroceso en motor 2
//{GPD} General Stop Down Finaliza el avance o retroceso de ambos motores
//{GTF:3000} General Timer Foreward Avance durante un determinado tiempo en milisegundos ambos motores
//{GTB:3000} General Timer Backward Retroceso durante un determinado tiempo en milisegundos ambos motores
//{1TF:3000} M1 Timer Foreward Avance durante un determinado tiempo en milisegundos motor 1
//{1TB:3000} M1 Timer Backward Retroceso durante un determinado tiempo en milisegundos motor 1
//{2TF:3000} M2 Timer Foreward Avance durante un determinado tiempo en milisegundos motor 2
//{2TB:3000} M2 Timer Backward Retroceso durante un determinado tiempo en milisegundos motor 2

//Deprecated:
//{GUD} General Turbo Down Inicia el avance en ambas llantas
//{GUU} General Turbo Up Finaliza el avance en ambas llantas
void setCurrentSatatus(Mode_Status newStatus, unsigned int timerMillis){
  currentSatatus = newStatus;  
  switch (currentSatatus) {
    case TIMER_FOREWARD:
      finishTime = millis()+(timerMillis == 0 || timerMillis > MAX_TIME_COMMAND ? MAX_TIME_COMMAND : timerMillis);
      break;
    default:
      finishTime = 0;
      break;
  }
}

void setCurrentSatatus(Mode_Status newStatus){
  setCurrentSatatus(newStatus, 0);
}

void processStop(char event){
  #ifdef DEBUG
		Serial.println("processStop");
  #endif
  setCurrentSatatus(NORMAL);
  digitalWrite(GPIO_M1_SPEED, LOW);
  digitalWrite(GPIO_M2_SPEED, LOW);
  digitalWrite(GPIO_M1_1, LOW);
  digitalWrite(GPIO_M1_2, LOW);
  digitalWrite(GPIO_M2_1, LOW);
  digitalWrite(GPIO_M2_2, LOW);  
}

// void processTurbo(char event){
//   switch (event) {
//     case 'D':
//         digitalWrite(GPIO_M1_SPEED, LOW);
//         digitalWrite(GPIO_M2_SPEED, LOW);
//         digitalWrite(GPIO_M1_1, HIGH);
//         digitalWrite(GPIO_M1_2, LOW);
//         digitalWrite(GPIO_M2_1, HIGH);
//         digitalWrite(GPIO_M2_2, LOW);
//         // analogWrite(GPIO_M1_SPEED, TURBO_SPEED);
//         // analogWrite(GPIO_M2_SPEED, TURBO_SPEED);
//         digitalWrite(GPIO_M1_SPEED, HIGH);
//         digitalWrite(GPIO_M2_SPEED, HIGH);
//         setCurrentSatatus(TIMER_FOREWARD);
//       break;
//     default:
//         processStop('D');
//       break;
//   }  
// }

void processTimer(char direction, unsigned int timer){
  if(timer<=0){
    return; // Si tiempo definido no se puede ejecutar
  }
  switch (direction) {
    case 'F':	        
        digitalWrite(GPIO_M1_SPEED, LOW);
        digitalWrite(GPIO_M2_SPEED, LOW);
        digitalWrite(GPIO_M1_1, HIGH);
        digitalWrite(GPIO_M1_2, LOW);
        digitalWrite(GPIO_M2_1, HIGH);
        digitalWrite(GPIO_M2_2, LOW);
        // analogWrite(GPIO_M1_SPEED, TURBO_SPEED);
        // analogWrite(GPIO_M2_SPEED, TURBO_SPEED);
        digitalWrite(GPIO_M1_SPEED, HIGH);
        digitalWrite(GPIO_M2_SPEED, HIGH);
        setCurrentSatatus(TIMER_FOREWARD, timer);
        break;
    case 'B':
        digitalWrite(GPIO_M1_SPEED, LOW);
        digitalWrite(GPIO_M2_SPEED, LOW);
        digitalWrite(GPIO_M1_1, LOW);
        digitalWrite(GPIO_M1_2, HIGH);
        digitalWrite(GPIO_M2_1, LOW);
        digitalWrite(GPIO_M2_2, HIGH);
        // analogWrite(GPIO_M1_SPEED, TURBO_SPEED);
        // analogWrite(GPIO_M2_SPEED, TURBO_SPEED);
        digitalWrite(GPIO_M1_SPEED, HIGH);
        digitalWrite(GPIO_M2_SPEED, HIGH);
        setCurrentSatatus(TIMER_FOREWARD, timer);
        break;
    }  
}

void processMotorEvent(char motor, char direction, char event){
  #ifdef DEBUG
		Serial.println("processMotorEvent");
  #endif

  if (currentSatatus != NORMAL){
    return; // Si está en algún commando por tiempo no ejecuta los comandos individuales
  }

  uint8_t gpio_speed, gpio1, gpio2;

  switch (motor) {
    case '1':
      #ifdef DEBUG
        Serial.println("motor 1");
      #endif
      gpio_speed=GPIO_M1_SPEED;
      gpio1=GPIO_M1_1;
      gpio2=GPIO_M1_2;
      break;
    case '2':      
      #ifdef DEBUG
        Serial.println("motor 2");
      #endif
      gpio_speed=GPIO_M2_SPEED;
      gpio1=GPIO_M2_1;
      gpio2=GPIO_M2_2;
      break;
    default:
      return;
      break;
  }

  if(event== 'U'){
	  digitalWrite(gpio1, LOW);
	  digitalWrite(gpio2, LOW);
    digitalWrite(gpio_speed, LOW);
  }else{
    switch (direction) {
      case 'F':      
	        digitalWrite(gpio1, HIGH);
	        digitalWrite(gpio2, LOW);
          // analogWrite(gpio_speed, NORMAL_SPEED);
          digitalWrite(gpio_speed, HIGH);
        break;
      case 'B':
	        digitalWrite(gpio1, LOW);
	        digitalWrite(gpio2, HIGH);
          // analogWrite(gpio_speed, NORMAL_SPEED);
          digitalWrite(gpio_speed, HIGH);
        break;
    }
  }
}

void processGeneralEvent(char command, char event, unsigned int timer){
  #ifdef DEBUG
    Serial.println("processGeneralEvent");
  #endif
  switch (command) {
    // case 'U': //Turbo
    //     processTurbo(event);
    //   break;   
    case 'P': //Stop
        #ifdef DEBUG
          Serial.println("Stop");
        #endif
        processStop(event);
      break;   
    case 'T': //Timer foreward and backward
        #ifdef DEBUG
          Serial.println("Timer");
        #endif
        processTimer(event, timer);
      break;
  }
}

void motorControlLoop(){
  switch (currentSatatus) {
    case TIMER_FOREWARD:
      if (millis() >= finishTime){
        processStop('D');
      }
      break;
    default:
      break;
  }
}

void motorControlInit() {
  setCurrentSatatus(NORMAL);

  pinMode(GPIO_M2_1, OUTPUT);
  pinMode(GPIO_M2_2, OUTPUT);
  pinMode(GPIO_M2_SPEED, OUTPUT);
  pinMode(GPIO_M1_1, OUTPUT);
  pinMode(GPIO_M1_2, OUTPUT);
  pinMode(GPIO_M1_SPEED, OUTPUT);
	digitalWrite(GPIO_M2_1, LOW);
	digitalWrite(GPIO_M2_2, LOW);
	digitalWrite(GPIO_M2_SPEED, LOW);
	digitalWrite(GPIO_M1_1, LOW);
	digitalWrite(GPIO_M1_2, LOW);
	digitalWrite(GPIO_M1_SPEED, LOW);

  // #if defined(ESP8266)
  //    analogWriteRange(255);
  // #endif
}

void processCommand(uint8_t * commantStr, size_t length){
  // #ifdef DEBUG
	// 	Serial.println("processCommand");
  // #endif
	
  if (length<5){ // menos de 5 caracteres no es un commando válido
    return;
  }

  unsigned int timer = 0;
  if (length>6){ // ejemplo: {GTF:3000}
    for(uint8_t i = 5; i <= length-2; i++){ 
      timer *= 10; 
      timer += (commantStr[i] - '0');
    }
  }
	
  switch (commantStr[1]) {
    case '1':
    case '2':
      processMotorEvent(commantStr[1], commantStr[2], commantStr[3]);
      break;
    case 'G':
      processGeneralEvent(commantStr[2], commantStr[3], timer);
      break;
  }
}