#include <Arduino.h>

#include "config.h"
#include "definitions.h"
#include "wifiUtils.hpp"
#include "wsUtils.hpp"
#include "carControl.h"

void setup() {
	pinMode(LED_BUILTIN_AUX, OUTPUT);
	carControlInit();
	
#ifdef DEBUG
	Serial.begin(9600);

	// Serial.setDebugOutput(true);

	Serial.println();
	Serial.println();
	Serial.println();
#endif

  bool ledStatus = false;	
	for(uint8_t t = 4; t > 0; t--) {
		digitalWrite(LED_BUILTIN_AUX, ledStatus);
		ledStatus= !ledStatus;
#ifdef DEBUG
		Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
		Serial.flush();
#endif
		delay(1000);
	}

  ConnectWiFi_STA();
	webSocketInit();

  digitalWrite(LED_BUILTIN_AUX, HIGH); // Turn OFF led
}

void loop() {
	webSocket.loop();
	carControlLoop();
}
