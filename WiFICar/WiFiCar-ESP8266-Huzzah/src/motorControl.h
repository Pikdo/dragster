#ifndef CAR_CONTROL_H
  #define CAR_CONTROL_H

#include <Arduino.h>

void motorControlInit();
void processCommand(uint8_t * commantStr, size_t length);
//void processMotorEvent(char tire, char direction, char event);
//void processGeneralEvent(char command, char event);
//void processTurbo(char event);
//void processStop(char event);
void motorControlLoop();


#endif