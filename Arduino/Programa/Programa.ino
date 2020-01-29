//-----------------------------------
//   Autor: Adrián Heras Reche
//   Fecha: 08/10/2019
//   Última Actualización: 25/10/2019
//   Programa.ino
//-----------------------------------

#include "SensorCalidadAire.h"
#include "EmisoraBLE.h"

#define RX_PIN 15
#define TX_PIN 17

SensorCalidadAire sensorCalidadAire = SensorCalidadAire(4);
EmisoraBLE emisora = EmisoraBLE();


void setup() {
  // Inicio puerto serie y UART con el sensor ( 8bit sin paridad, 1 bit de stop, a 3.3 V)
  Serial.begin(9600);
  Serial1.begin(9600);
  emisora.inicializar();
}

//-------------------------------------
//Loop()
//-------------------------------------

void loop() {
  medirYPublicar();
  delay(1000);
}

//------------------------------------
//    medirYPublicar()
//------------------------------------
void medirYPublicar()
{
  int medida = sensorCalidadAire.medirCalidadAire();
  emisora.anunciarCalidadAire(medida);
}
