// #include "config.h"
#include "carControl.h"
#include <WebSocketsClient.h>

WebSocketsClient webSocket;

void ledIndicator(uint8_t beepCount){
	for (int i = 0; i<beepCount;i++){
    digitalWrite(LED_BUILTIN_AUX, LOW);
	  delay(250);
    digitalWrite(LED_BUILTIN_AUX, HIGH);
	  delay(250);
	}
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {

	switch(type) {
		case WStype_DISCONNECTED:
		  ledIndicator(3);
#ifdef DEBUG
			Serial.printf("[WSc] Disconnected!\n");
#endif
			break;
		case WStype_CONNECTED: 
		  ledIndicator(2);
#ifdef DEBUG
			Serial.printf("[WSc] Connected to url: %s\n", payload);
#endif
			// send message to server when Connected
			webSocket.sendTXT("Connected");
		
			break;
		case WStype_TEXT:
#ifdef DEBUG
			Serial.printf("[WSc] get text: %s\n", payload);
#endif
	    processCommand(payload, length);
			// send message to server
			// webSocket.sendTXT("message here");
			break;
		case WStype_BIN:
			//Serial.printf("[WSc] get binary length: %u\n", length);
			//hexdump(payload, length);

			// send data to server
			// webSocket.sendBIN(payload, length);
			break;
		case WStype_PING:
				// pong will be send automatically
				//Serial.printf("[WSc] get ping\n");
				break;
		case WStype_PONG:
				// answer to a ping we send
				//Serial.printf("[WSc] get pong\n");
				break;

		case WStype_FRAGMENT_TEXT_START:
		case WStype_FRAGMENT_BIN_START:
		case WStype_FRAGMENT:
		case WStype_FRAGMENT_FIN:
		case WStype_ERROR:
				break;
    }
}

void webSocketInit() {
  // server address, port and URL
	webSocket.begin(wsServerName, wsServerPort, (String(wsServerPath)+"/"+String(carNumber)).c_str());

	// event handler
	webSocket.onEvent(webSocketEvent);

	// use HTTP Basic Authorization this is optional remove if not needed
	//webSocket.setAuthorization("PasswordDiego");
	//webSocket.setAuthorization("userDiego", "PasswordDiego");

	// try ever 5000 again if connection has failed
	webSocket.setReconnectInterval(5000);
  
  // start heartbeat (optional)
  // ping server every 15000 ms
  // expect pong from server within 3000 ms
  // consider connection disconnected if pong is not received 2 times
  webSocket.enableHeartbeat(15000, 3000, 2);
}