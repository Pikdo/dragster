#ifndef CAR_CONTROL_H
  #define CAR_CONTROL_H

#include <Arduino.h>

void carControlInit();
void processCommand(uint8_t * commantStr, size_t length);
void processEvent(int gpio1, int gpio2, char direction, char event);


#endif