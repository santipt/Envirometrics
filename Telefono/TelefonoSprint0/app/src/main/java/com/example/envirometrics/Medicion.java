package com.example.envirometrics;

import java.util.Calendar;

/*
Clase POJO para almacenar toda la infromacion relevante de una medida.
Esta clase solo consta de dos constructores y los metodos getters and setters.
 */

public class Medicion {

    private String hora;
    private String fecha;
    private int medidaCO;
    private double latitud;
    private double longitud;


    public Medicion(){

    }
    //-----------------------------------
    // Z, Texto, Texto --> Medicion()
    //-----------------------------------
    public Medicion(int _medidaCO, String _hora, String _fecha, double latitud, double longitud){

        this.medidaCO = _medidaCO;
        this.hora = _hora;
        this.fecha = _fecha;

        this.latitud = latitud;
        this.longitud = longitud;
    }

    //-----------------------------------
    // setFecha() --> Z
    //-----------------------------------
    public int getMedidaCO() {
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

    //-----------------------------------
    // getHora() --> Texto
    //-----------------------------------
    public String getHora() {
        return hora;
    }

    //-----------------------------------
    // getFecha() --> Texto
    //-----------------------------------
    public String getFecha() {
        return fecha;
    }

    //-----------------------------------
    // Texto --> setFecha()
    //-----------------------------------
    public void setHora(String hora) {
        this.hora = hora;
    }

    //-----------------------------------
    // Z --> setMedidaCO()
    //-----------------------------------
    public void setMedidaCO(int medidaCO) {
        this.medidaCO = medidaCO;
    }

    //-----------------------------------
    // Texto --> setFecha()
    //-----------------------------------
    public void setFecha(String fecha) {
        this.fecha = fecha;
    }
}
