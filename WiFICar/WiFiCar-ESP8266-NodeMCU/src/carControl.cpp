#include "carControl.h"
#include "definitions.h"

enum Mode_Status {
  NORMAL,
  TURBO
} currentSatatus;

//"{RFU}", "{RFD}", "{RBU}", "{RBD}", "{LFU}", "{LFD}", "{LBU}", "{LBD}"
//"{GTU}", "{GTD}"
	
void carControlInit() {
  currentSatatus = NORMAL;

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
	//Serial.println("processCommand");
  if (length<5) return;
	 switch (commantStr[1]) {
    case 'R':
    case 'L':
      processTireEvent(commantStr[1], commantStr[2], commantStr[3]);
      break;
    case 'G':
      processGeneralEvent(commantStr[2], commantStr[3]);
      break;
  }
}

void processTireEvent(char tire, char direction, char event){
  if (currentSatatus != NORMAL){
    return; // Si está en tubo no ejecuta los comandos individuales
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

void processGeneralEvent(char command, char event){
  switch (command) {
    case 'T': //Turbo
        processTurbo(event);
      break;   
    case 'P': //Stop
        processStop(event);
      break;        
  }
}

void processTurbo(char event){
  switch (event) {
    case 'D':
        currentSatatus = TURBO;
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
      break;
    default:
        currentSatatus = NORMAL;
        digitalWrite(GPIO_RIGHT_SPEED, LOW);
        digitalWrite(GPIO_LEFT_SPEED, LOW);
        digitalWrite(GPIO_RIGHT_1, LOW);
        digitalWrite(GPIO_RIGHT_2, LOW);
        digitalWrite(GPIO_LEFT_1, LOW);
        digitalWrite(GPIO_LEFT_2, LOW);
      break;
  }  
}

void processStop(char event){       
  digitalWrite(GPIO_RIGHT_SPEED, LOW);
  digitalWrite(GPIO_LEFT_SPEED, LOW);
  digitalWrite(GPIO_RIGHT_1, LOW);
  digitalWrite(GPIO_RIGHT_2, LOW);
  digitalWrite(GPIO_LEFT_1, LOW);
  digitalWrite(GPIO_LEFT_2, LOW);
  
}