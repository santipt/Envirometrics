//-----------------------------------
//   Autor: Adrián Heras Reche
//   Fecha: 07/10/2019
//   Última Actualización: 25/10/2019
//   SensorCalidadAire.h
//-----------------------------------

class SensorCalidadAire
{
    //-------------------------------------
    //-------------------------------------
  private:

    //variables privadas de la clase:
    //guardadas por el sensor
    long medida;
    int sensorData [11];

    //Debido a que se recoge la fecha y hora en el movil he decidido comentarlas aquí
    //   incluyendo sus funciones dimeHora y dimeFecha
    //String hora;
    //String fecha;

    //Constructor de la clase

    // Sospecho que el factorCalibracion acabará siendo obsoleto si la calibración se acaba por hacer en el servidor o en el móvil
    double factorCalibracion;

    //Funciones privada del la clase
    //-------------------------
    //    cacharroDimeloTodo()
    //              ->Z
    //-------------------------
    void cacharroDimeloTodo()
    {
      Serial.println(" ");
      Serial.println(" ");
      Serial.println("medida ");


      int i = 0;
      for (int i = 0; i < 11; i++) {
        //Se le envia al sensor \r para que envie una tanda de datos
        Serial1.print('\r');
        sensorData[i] = Serial1.parseInt();
        //Serial.println(sensorData[i]);
      }

      //Por alguna razón al comentar el codigo de abajo que solo muestra la informacion que le llega
      //  el array cambia de ser [1] a ser [2] para que pase el PPB. No estoy seguro de porqué, pero
      //   funciona así
      medida = sensorData[1]/1000;
      Serial.println(medida);

      //Descomentar si se quiere mostrar toda la información por el monitor serie
      /*for (int j = 0; j < 11; j++) {
        Serial.print(sensorData[j]);
        Serial.print(" ");
        }*/

      //Se le envia al sensor 's' para que vuelva al estado de bajo consumo
      Serial1.print('s');
    }

    //-------------------------------------
    //-------------------------------------

  public:

    //--------------------------
    //    constructor()
    //--------------------------
    SensorCalidadAire (double factor)
    {
      setFactorCalibracion(factor);
    }

    //--------------------------
    //    medirCalidadAire()
    //          ->R
    //--------------------------
    int medirCalidadAire()
    {
      cacharroDimeloTodo();
      return (*this).medida;
    }

    //--------------------------
    // ->R
    //    setFactorCalibracion()
    //--------------------------
    void setFactorCalibracion(double factor)
    {
      (*this).factorCalibracion = factor;
    }

    /*//--------------------------
      //    dimeHora()
      //          ->Texto
      //--------------------------
      String dimeHora()
      {
      cacharroDimeloTodo();
      return (*this).hora;
      }

      //--------------------------
      //    dimeFecha()
      //          ->Texto
      //--------------------------
      String dimeFecha()
      {
      cacharroDimeloTodo();
      return (*this).fecha;
      }*/
};
