//-----------------------------------
//   Autor: Adrián Heras Reche
//   Fecha: 08/10/2019
//   Última Actualización: 25/10/2019
//   EmisoraBLE.h
//-----------------------------------

#include <bluefruit.h>

class EmisoraBLE
{
  private:

  public:

    EmisoraBLE()
    {

    }

    //-------------------------
    //    inicializar()
    //-------------------------
    void inicializar()
    {

      // Inicio bluefruit
      Bluefruit.begin();

      // Agregar nombre al beacon
      Bluefruit.setName("Beacon EQUIPO 2");
      Bluefruit.ScanResponse.addName();


      // para inicializar el advertising del beacon
      //Primero lo paramos
      Bluefruit.Advertising.stop();

      // Paquete Advertising
      Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
      Bluefruit.Advertising.addTxPower();

      //Incluimos el nombre
      Bluefruit.Advertising.addName();

      //Creamos el BLEBeacon y le damos parametros por defecto
      (*this).cambiarBeacon(5, 15);

      Bluefruit.Advertising.restartOnDisconnect(true);
      Bluefruit.Advertising.setInterval(32, 244);    // en unidades de 0.625 ms
      Bluefruit.Advertising.setFastTimeout(30);      // número de segundos en modo rápido
      Bluefruit.Advertising.start(0);                // 0 = No pares tras n segundos
    }

    //-------------------------
    //   ->Z
    //    anunciarCalidadAire()
    //-------------------------
    void anunciarCalidadAire(int indiceCalidadAire)
    {
      //Serial.println(indiceCalidadAire);
      // Se hace una comprobacion del valor obtenido para saber si esta dentro de un rango normal
      if(indiceCalidadAire > 500 || indiceCalidadAire < 3){
        cambiarBeacon(indiceCalidadAire, 0);
        //En el caso que la medida no sea normal, enviaremos un 0 en el minor para desde android detectar el problema y no leer el sensor mas veces.
      }
      cambiarBeacon(indiceCalidadAire, 1);
    }

    //-------------------------
    //   ->Z, Z
    //    cambiarBeacon()
    //-------------------------
    void cambiarBeacon( int major, int minor)
    {

      //Establecemos el UUID del beacon
      uint8_t beaconUUID[16] = {
        'E', 'P', 'S', 'G', '-', 'G', 'T', 'I',
        '-', 'P', 'R', 'O', 'Y', '-', 'E', '2'
      };
      //Inicializamos el Beacon
      BLEBeacon elBeacon( beaconUUID, major, minor, 73 ); // beaconUUID / major / minor / 73
      elBeacon.setManufacturer( 0x004c ); // ID manufactor
      Bluefruit.Advertising.setBeacon( elBeacon );
    }

};
