#include <Arduino.h>

#include "config.h"
#include "definitions.h"
#include "wifiUtils.hpp"
#include "wsUtils.hpp"
#include "carControl.h"

void setup() {
	carControlInit();
	
#ifdef DEBUG
	USE_SERIAL.begin(115200);

	// USE_SERIAL.setDebugOutput(true);

	USE_SERIAL.println();
	USE_SERIAL.println();
	USE_SERIAL.println();
#endif

	for(uint8_t t = 4; t > 0; t--) {
#ifdef DEBUG
		USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
		USE_SERIAL.flush();
#endif
		delay(1000);
	}

  ConnectWiFi_STA();
	webSocketInit();

}

void loop() {
	webSocket.loop();
}
