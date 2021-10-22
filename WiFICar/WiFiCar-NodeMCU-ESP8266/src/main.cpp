#include <Arduino.h>

#include "config.h"
#include "definitions.h"
#include "wifiUtils.hpp"
#include "wsUtils.hpp"
#include "carControl.h"

void setup() {
	//pinMode(2, OUTPUT);     //Initialize GPIO2 pin as an output
	//digitalWrite(2, HIGH);  // Turn the LED off by making the voltage HIGH 

	carControlInit();
	
#ifdef DEBUG
	Serial.begin(9600);

	// Serial.setDebugOutput(true);

	Serial.println();
	Serial.println();
	Serial.println();
#endif

	for(uint8_t t = 4; t > 0; t--) {
#ifdef DEBUG
		Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
		Serial.flush();
#endif
		delay(1000);
	}

  ConnectWiFi_STA();
	webSocketInit();
}

void loop() {
  //  digitalWrite(2, LOW);   // Turn the LED on by making the voltage LOW   
  //  delay(1000);            // Wait for a second
  //  digitalWrite(2, HIGH);  // Turn the LED off by making the voltage HIGH 
  //  delay(2000);            // Wait for two seconds
	webSocket.loop();
}
