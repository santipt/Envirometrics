package com.example.envirometrics;

/*
    Autor: Joan Calabuig artes
    Fecha: 29/12/2019
    Ultima modificacion: 29/12/2019
    Descripcion: Clase para almacenar medidas realizadas en un array y poder hacer pequeños calculos.
 */


import android.util.Log;

import java.util.ArrayList;

public class Medidas {

    // Variables privadas
    private double mediaMedidas;
    private ArrayList<Medida> medidas;

    //----------------------------------------------------------------------------------------------
    //Constructor
    //----------------------------------------------------------------------------------------------
    public Medidas(){
        medidas = new ArrayList<Medida>();
    }

    //----------------------------------------------------------------------------------------------
    // Métodos
    //----------------------------------------------------------------------------------------------
    public void anadirMedida(Medida medida){
        medidas.add(medida);
            for(int i = 0; i<=medidas.size()-1;i++) {
                Log.d("Calibracion", "Tiempo: " + medidas.get(i).getTiempo());
            }

    }

    public void eliminarMedida(int posicion){
        medidas.remove(posicion);
    }

    public void eliminarTodasMedidas(){
        medidas.clear();
    }

    public int obtenerCantidadMedidas (){
        return medidas.size();
    }

    public Medida obtenerPrimeraMedida(){
        return medidas.get(0);
    }

    public double calcularMediaMedidas(){
        double suma = 0.0;

        for(Medida medida : medidas){
            suma = suma + medida.getMedidaCO();
        }

        return suma/medidas.size();
    }

    //----------------------------------------------------------------------------------------------
    // Getters and Setters
    //----------------------------------------------------------------------------------------------
    public double getMediaMedidas() {
        return mediaMedidas;
    }

    public void setMediaMedidas(double mediaMedidas) {
        this.mediaMedidas = mediaMedidas;
    }
}
