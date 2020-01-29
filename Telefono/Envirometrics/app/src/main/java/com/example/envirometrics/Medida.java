package com.example.envirometrics;

import android.util.Log;

import com.orhanobut.hawk.Hawk;

import java.util.Calendar;
import java.util.Date;

/*
Clase POJO para almacenar toda la infromacion relevante de una medida.
Esta clase solo consta de dos constructores y los metodos getters and setters.
 */

public class Medida {


    private long tiempo;
    private double medidaCO;
    private double latitud;
    private double longitud;
    private int idTipoMedida;

    private static double factorCalibracion;


    public Medida(){
        if(Hawk.contains("calibracion")){
            Medida.setFactorCalibracion(Double.parseDouble(Hawk.get("calibracion").toString()));
        }else{
            Medida.setFactorCalibracion(1.0);
        }
    }
    //-----------------------------------
    // Z, Texto, Texto --> Medida()
    //-----------------------------------
    public Medida(double _medidaCO, double latitud, double longitud){

        Date date = new Date();

        this.medidaCO = _medidaCO;
        this.tiempo = date.getTime();
        this.latitud = latitud;
        this.longitud = longitud;
        this.idTipoMedida = 1;

        if(Hawk.contains("calibracion")){
            Medida.setFactorCalibracion(Double.parseDouble(Hawk.get("calibracion").toString()));
        }else{
            Medida.setFactorCalibracion(1.0);
        }
    }

    //-----------------------------------
    // setFecha() --> Z
    //-----------------------------------
    public double getMedidaCO() {
        return medidaCO;
    }

    //-----------------------------------
    // averiguarFecha() --> Texto
    //-----------------------------------
    public static String averiguarFecha(){

        Calendar calendario = Calendar.getInstance();
        int dia = calendario.get(Calendar.DATE);
        int mes = calendario.get(Calendar.MONTH);
        int any = calendario.get(Calendar.YEAR);
        String lafecha = dia + ":" + mes + ":" + any;
        return lafecha;

    }

    //-----------------------------------
    // averiguarHora() --> Texto
    //-----------------------------------
    public static String averiguarHora(){

        Calendar calendario = Calendar.getInstance();
        int hora = calendario.get(Calendar.HOUR_OF_DAY);
        int minutos = calendario.get(Calendar.MINUTE);
        String tiempo = hora + ":" + minutos;
        return tiempo;

    }

    public static void calcularFactorCalibracion(double medida, double medidaEstacion){
        double res = (medidaEstacion/medida);
        Log.d("Calibracion", "Valor nuevo de calibracion: " + res);
        Medida.setFactorCalibracion(res);
    }

    public static double convertirPpmToMg(double medida){

        return medida;
    }

    //-----------------------------------
    // getLatitud() --> Real
    //-----------------------------------
    public double getLatitud() {
        return latitud;
    }

    //-----------------------------------
    // Real --> setLatitud()
    //-----------------------------------
    public void setLatitud(double latitud) {
        this.latitud = latitud;
    }

    //-----------------------------------
    // getLongitud() --> Real
    //-----------------------------------
    public double getLongitud() {
        return longitud;
    }

    //-----------------------------------
    // Real --> setLongitud()
    //-----------------------------------
    public void setLongitud(double longitud) {
        this.longitud = longitud;
    }

    public long getTiempo() {
        return tiempo;
    }

    public void setTiempo(long tiempo) {
        this.tiempo = tiempo;
    }

    public int getIdTipoMedida() {
        return idTipoMedida;
    }

    public void setIdTipoMedida(int idTipoMedida) {
        this.idTipoMedida = idTipoMedida;
    }

    public static double getFactorCalibracion() {
        return factorCalibracion;
    }

    public static void setFactorCalibracion(double factorCalibracion) {
        Log.d("Calibracion", "Guardamos factor calibracion");
        Medida.factorCalibracion = factorCalibracion;
        Log.d("Calibracion", "El factor de calibracion es: " + factorCalibracion);
        Hawk.put("calibracion", factorCalibracion);
    }



    //-----------------------------------
    // getHora() --> Texto
    //-----------------------------------
    /*public String getHora() {
        return hora;
    }

     */

    //-----------------------------------
    // getFecha() --> Texto
    //-----------------------------------
    /*public String getFecha() {
        return fecha;
    }

     */

    //-----------------------------------
    // Texto --> setFecha()
    //-----------------------------------
    /*public void setHora(String hora) {
        this.hora = hora;
    }

     */

    //-----------------------------------
    // Z --> setMedidaCO()
    //-----------------------------------
    public void setMedidaCO(int medidaCO) {
        Log.d("Calibracion", "El factor de calibracion de esta medida es: " + factorCalibracion);
        this.medidaCO = medidaCO;
    }

    //-----------------------------------
    // Texto --> setFecha()
    //-----------------------------------
    /*public void setFecha(String fecha) {
        this.fecha = fecha;
    }

     */
}
