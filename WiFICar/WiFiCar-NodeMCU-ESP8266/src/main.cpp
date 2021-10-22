#include <Arduino.h>

#include "config.h"
#include "definitions.h"
#include "wifiUtils.hpp"
#include "wsUtils.hpp"
#include "carControl.h"

void setup() {
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
	webSocket.loop();
}
