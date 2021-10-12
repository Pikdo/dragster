#include <ESP8266WiFi.h>

bool wifiConnect(const char* ssid , const char* password)
{
	int tries = 0;
	WiFi.begin(ssid, password);
	///if(useStaticIP) WiFi.config(ip, gateway, subnet);
	while (WiFi.status() != WL_CONNECTED && tries < MAX_CONNECTION_TRIES) 
	{ 
#ifdef DEBUG
		USE_SERIAL.print(" . ");
#endif
		tries++;
		delay(100);
	}

	return (WiFi.status() == WL_CONNECTED)?true:false;

}

void ConnectWiFi_STA(/*bool useStaticIP = false*/)
{	
	WiFi.hostname((String(hostname)+"_"+String(carNumber)).c_str());
	WiFi.mode(WIFI_STA);
	// WiFi.begin(ssid, password);
	// ///if(useStaticIP) WiFi.config(ip, gateway, subnet);
	// while (WiFi.status() != WL_CONNECTED) 
	// { 
	// 	delay(100);  
	// }

	if(!wifiConnect(ssid, password)){		
		if(!wifiConnect(ssid_alternative, password_alternative)){
		   ESP.restart();
 	  }
	}

	// WiFiMulti.addAP(ssid, password);

	// //WiFi.disconnect();
	// while(WiFiMulti.run() != WL_CONNECTED) {
	// 	delay(100);
	// }

	// Serial.println("");
	//  Serial.print("Iniciado STA:\t");
	//  Serial.println(ssid);
	// Serial.print("IP address:\t");
	// Serial.println(WiFi.localIP());
}