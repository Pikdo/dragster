#include "carControl.h"
#include "definitions.h"

enum Mode_Status {
  NORMAL,
  TIMER_FOREWARD
} currentSatatus;

unsigned long finishTime;

//{RFD} Right Foreward Down Inicia el avance en la rueda derecha
//{RFU} Right Foreward Up Finaliza el avance en la rueda derecha
//{RBD} Right Backward Down Inicia el retroceso en la rueda derecha
//{RBU} Right Backward Up Finaliza el retroceso en la rueda derecha
//{LFD} Left Foreward Down Inicia el avance en la rueda izquierda
//{LFU} Left Foreward Up Finaliza el avance en la rueda izquierda
//{LBD} Left Backward Down Inicia el retroceso en la rueda izquierda
//{LBU} Left Backward Up Finaliza el retroceso en la rueda izquierda
//{GPD} General Stop Down Finaliza el avance o retroceso de ambas llantas
//{GTF:3000} General Timer Foreward Avance durante un determinado tiempo en milisegundos
//{GTB:3000} General Timer Backward Retroceso durante un determinado tiempo en milisegundos
	

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
  setCurrentSatatus(NORMAL);
  digitalWrite(GPIO_RIGHT_SPEED, LOW);
  digitalWrite(GPIO_LEFT_SPEED, LOW);
  digitalWrite(GPIO_RIGHT_1, LOW);
  digitalWrite(GPIO_RIGHT_2, LOW);
  digitalWrite(GPIO_LEFT_1, LOW);
  digitalWrite(GPIO_LEFT_2, LOW);  
}

// void processTurbo(char event){
//   switch (event) {
//     case 'D':
//         digitalWrite(GPIO_RIGHT_SPEED, LOW);
//         digitalWrite(GPIO_LEFT_SPEED, LOW);
//         digitalWrite(GPIO_RIGHT_1, HIGH);
//         digitalWrite(GPIO_RIGHT_2, LOW);
//         digitalWrite(GPIO_LEFT_1, HIGH);
//         digitalWrite(GPIO_LEFT_2, LOW);
//         // analogWrite(GPIO_RIGHT_SPEED, TURBO_SPEED);
//         // analogWrite(GPIO_LEFT_SPEED, TURBO_SPEED);
//         digitalWrite(GPIO_RIGHT_SPEED, HIGH);
//         digitalWrite(GPIO_LEFT_SPEED, HIGH);
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
        digitalWrite(GPIO_RIGHT_SPEED, LOW);
        digitalWrite(GPIO_LEFT_SPEED, LOW);
        digitalWrite(GPIO_RIGHT_1, HIGH);
        digitalWrite(GPIO_RIGHT_2, LOW);
        digitalWrite(GPIO_LEFT_1, HIGH);
        digitalWrite(GPIO_LEFT_2, LOW);
        // analogWrite(GPIO_RIGHT_SPEED, TURBO_SPEED);
        // analogWrite(GPIO_LEFT_SPEED, TURBO_SPEED);
        digitalWrite(GPIO_RIGHT_SPEED, HIGH);
        digitalWrite(GPIO_LEFT_SPEED, HIGH);
        setCurrentSatatus(TIMER_FOREWARD, timer);
        break;
    case 'B':
        digitalWrite(GPIO_RIGHT_SPEED, LOW);
        digitalWrite(GPIO_LEFT_SPEED, LOW);
        digitalWrite(GPIO_RIGHT_1, LOW);
        digitalWrite(GPIO_RIGHT_2, HIGH);
        digitalWrite(GPIO_LEFT_1, LOW);
        digitalWrite(GPIO_LEFT_2, HIGH);
        // analogWrite(GPIO_RIGHT_SPEED, TURBO_SPEED);
        // analogWrite(GPIO_LEFT_SPEED, TURBO_SPEED);
        digitalWrite(GPIO_RIGHT_SPEED, HIGH);
        digitalWrite(GPIO_LEFT_SPEED, HIGH);
        setCurrentSatatus(TIMER_FOREWARD, timer);
        break;
    }  
}

void processTireEvent(char tire, char direction, char event){
  if (currentSatatus != NORMAL){
    return; // Si está en algún commando por tiempo no ejecuta los comandos individuales
  }

  uint8_t gpio_speed, gpio1, gpio2;

  switch (tire) {
    case 'R':
      gpio_speed=GPIO_RIGHT_SPEED;
      gpio1=GPIO_RIGHT_1;
      gpio2=GPIO_RIGHT_2;
      break;
    case 'L':      
      gpio_speed=GPIO_LEFT_SPEED;
      gpio1=GPIO_LEFT_1;
      gpio2=GPIO_LEFT_2;
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
  switch (command) {
    // case 'U': //Turbo
    //     processTurbo(event);
    //   break;   
    case 'P': //Stop
        processStop(event);
      break;   
    case 'T': //Timer foreward and backward
        processTimer(event, timer);
      break;
  }
}

void carControlLoop(){
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

void carControlInit() {
  setCurrentSatatus(NORMAL);

  pinMode(GPIO_LEFT_1, OUTPUT);
  pinMode(GPIO_LEFT_2, OUTPUT);
  pinMode(GPIO_LEFT_SPEED, OUTPUT);
  pinMode(GPIO_RIGHT_1, OUTPUT);
  pinMode(GPIO_RIGHT_2, OUTPUT);
  pinMode(GPIO_RIGHT_SPEED, OUTPUT);
	digitalWrite(GPIO_LEFT_1, LOW);
	digitalWrite(GPIO_LEFT_2, LOW);
	digitalWrite(GPIO_LEFT_SPEED, LOW);
	digitalWrite(GPIO_RIGHT_1, LOW);
	digitalWrite(GPIO_RIGHT_2, LOW);
	digitalWrite(GPIO_RIGHT_SPEED, LOW);

  // #if defined(ESP8266)
  //    analogWriteRange(255);
  // #endif
}

void processCommand(uint8_t * commantStr, size_t length){
  #ifdef DEBUG
		Serial.println("processCommand");
  #endif
	
  if (length<5){ // menos de 5 caracteres no es un commando válido
    return;
  }

  unsigned int timer = 0;
  if (length>6){ // ejemplo: {GBT:3000}
    //uint8_t i = 1
    for(uint8_t i = 5; length-2; i++){
      timer *= 10; 
      timer += (commantStr[i] - '0');
    }
    #ifdef DEBUG
		  Serial.print("timer: ");
		  Serial.println(timer);
    #endif
  }
	
  switch (commantStr[1]) {
    case 'R':
    case 'L':
      processTireEvent(commantStr[1], commantStr[2], commantStr[3]);
      break;
    case 'G':
      processGeneralEvent(commantStr[2], commantStr[3], timer);
      break;
  }
}