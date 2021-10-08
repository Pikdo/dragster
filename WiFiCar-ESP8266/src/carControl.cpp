#include "carControl.h"
#include "definitions.h"
//"{RFU}", "{RFD}", "{RBU}", "{RBD}", "{LFU}", "{LFD}", "{LBU}", "{LBD}"
	
void carControlInit() {
  pinMode(GPIO_LEFT_1, OUTPUT);
  pinMode(GPIO_LEFT_2, OUTPUT);
  pinMode(GPIO_RIGHT_1, OUTPUT);
  pinMode(GPIO_RIGHT_2, OUTPUT);
	digitalWrite(GPIO_LEFT_1, LOW);
	digitalWrite(GPIO_LEFT_2, LOW);
	digitalWrite(GPIO_RIGHT_1, LOW);
	digitalWrite(GPIO_RIGHT_2, LOW);
}

void processCommand(uint8_t * commantStr, size_t length){
	//USE_SERIAL.println("processCommand");
  if (length<5) return;
	 switch (commantStr[1]) {
    case 'R':
      processEvent(GPIO_RIGHT_1, GPIO_RIGHT_2, commantStr[2], commantStr[3]);
      break;
    case 'L':
      processEvent(GPIO_LEFT_1, GPIO_LEFT_2, commantStr[2], commantStr[3]);
      break;
  }
}

void processEvent(int gpio1, int gpio2, char direction, char event){
   if(event== 'U'){
	  digitalWrite(gpio1, LOW);
	  digitalWrite(gpio2, LOW);
   }else{
    switch (direction) {
      case 'F':      
	        digitalWrite(gpio1, HIGH);
	        digitalWrite(gpio2, LOW);
        break;
      case 'B':
	        digitalWrite(gpio1, LOW);
	        digitalWrite(gpio2, HIGH);
        break;
      }
  }
}
