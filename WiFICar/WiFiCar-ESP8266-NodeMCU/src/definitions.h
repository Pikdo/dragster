#ifndef DEFINITIONS_H
  #define DEFINITIONS_H

  #define DEBUG
  
  //#define TURBO_SPEED 1000
  //#define NORMAL_SPEED 700
  #define MAX_TIME_COMMAND 3000 // milisegundos

  #define MAX_CONNECTION_TRIES 200

  // El GPIO 2 está vinculado al LED_BUILTIN 
  // El GPIO 16 está vinculado al LED_BUILTIN_AUX 
    
  #define GPIO_LEFT_1 D1 //5
  #define GPIO_LEFT_2 D3 //0
  #define GPIO_LEFT_SPEED D2 //14
  
  #define GPIO_RIGHT_1 D5 //14
  #define GPIO_RIGHT_2 D7 //13
  #define GPIO_RIGHT_SPEED D6 //12

#endif