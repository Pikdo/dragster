#ifndef DEFINITIONS_H
  #define DEFINITIONS_H

  #define NODEMCU
  //#define HUZZAH

  // #define DEBUG
  
  #define TURBO_SPEED 200
  #define NORMAL_SPEED 150

  #define MAX_CONNECTION_TRIES 200
  #define USE_SERIAL Serial
  
  #ifdef HUZZAH
    #define GPIO_LEFT_1 4
    #define GPIO_LEFT_2 15
    #define GPIO_LEFT_SPEED 5
    
    #define GPIO_RIGHT_1 12
    #define GPIO_RIGHT_2 13
    #define GPIO_RIGHT_SPEED 16
  #endif
  
   #ifdef NODEMCU
    #define GPIO_LEFT_1 16
    #define GPIO_LEFT_2 3
    #define GPIO_LEFT_SPEED 15
    
    #define GPIO_RIGHT_1 10
    #define GPIO_RIGHT_2 6
    #define GPIO_RIGHT_SPEED 4
  #endif

#endif