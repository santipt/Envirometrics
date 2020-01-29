// .....................................................................
// Autor: Santiago Pérez Torres
// Fecha inicio: 24/10/2019
// Última actualización: 29/12/2019
// LogicaFake.js
// .....................................................................

package com.example.envirometrics;


import android.content.Context;
import android.graphics.Bitmap;
import android.media.Image;
import android.util.Log;

import com.orhanobut.hawk.Hawk;

import org.json.JSONObject;

import java.text.NumberFormat;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

import static java.lang.System.out;

public class LogicaFake {

    private final String TAG = "---LogicaDebug---";
    private Medidas medidas;

    // -------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------
    interface RespuestaAPreguntarAlgo {
        public void respuesta( String respuesta );

    } // interface


    private String urlServidor = "http://192.168.0.115:8080/";

    public LogicaFake(Context context){
            Hawk.init(context).build();
            medidas = new Medidas();
        }


    // -------------------------------------------------------------------------------
    //                        medicion: Medida --> anunciarCO()
    // -------------------------------------------------------------------------------
    public void anunciarCO(Medida medicion) {

        Medida medidaAux = new Medida(medicion.getMedidaCO(), medicion.getLatitud(), medicion.getLongitud());

        medidas.anadirMedida(medidaAux);

        Log.d("Calibracion", "Iniciamos el anuncio");
        Log.d("Calibracion", "Cantidad de medidas actualmente: " + medidas.obtenerCantidadMedidas());
        Log.d("Calibracion", "tiempo medida actual: " + medicion.getTiempo() + " Tiempo de la primera medida: " + medidas.obtenerPrimeraMedida().getTiempo());
        //Al pasar 8 horas hacemos la media de las medidas y con la media calculamos la calibracion 28800000
        if(medicion.getTiempo() > medidas.obtenerPrimeraMedida().getTiempo() + 180000){
            Log.d("Calibracion", "Han pasado 8 horas desde la primera medida");
            Log.d("Calibracion", "Añadimos la media de las medidas a la clase medidas");
            medidas.setMediaMedidas(medidas.calcularMediaMedidas());
            Log.d("Calibracion", "obtenerFactorDeCalibracion Llamado");
            //Pedimos al servidor que nos de la medida de la estacion oficial
            obtenerFactorCalibracion(medidas.getMediaMedidas());
            Log.d("Calibracion", "Eliminamos todas las medidas");
            medidas.eliminarTodasMedidas();
        }

        PeticionarioREST elPeticionario = new PeticionarioREST();

        Map<String, String> params = new HashMap<String, String>();
        params.put("idUsuario", String.valueOf(Hawk.get("id")));
        params.put("idTipoMedida", String.valueOf(1));
        params.put("valorMedida", String.valueOf(medicion.getMedidaCO()));
        params.put("tiempo", String.valueOf(medicion.getTiempo()));
        params.put("latitud", String.valueOf(medicion.getLatitud()));
        params.put("longitud", String.valueOf(medicion.getLongitud()));

        JSONObject eljson = new JSONObject(params);

        elPeticionario.hacerPeticionREST("POST", this.urlServidor + "insertarMedida", eljson.toString(),
                new PeticionarioREST.Callback() {
                    @Override
                    public void respuestaRecibida(int codigo, String cuerpo) {
                        Log.d("RESPUESTA RECIBIDA", "Logica.anunciarCO() respuestaRecibida: codigo = "
                                + codigo + " cuerpo=" + cuerpo);
                    }
                },
                "application/json; charset=utf-8"
        );

        Log.d("Calibracion", "Comprobamos si estamos cerca de la estacion oficial");
        //Comprobamos si la ubicacion esta dentro del rango de calibracion
        if(medicion.getLatitud() <= LocalizadorGPS.latNorte && medicion.getLongitud() >= LocalizadorGPS.longOeste){
            if(medicion.getLatitud() >= LocalizadorGPS.latSur && medicion.getLongitud() <= LocalizadorGPS.longEste){
                Log.d("Calibracion", "Ubicacion dentro del rango, Pedimos la medida de calibracion al servidor");
                //Hacemos la peticion del factor de calibracion
                    obtenerFactorCalibracion(medicion.getMedidaCO());
            }
        }
    }

    // ----------------------------------------------------------------------------------------
    // obtenerFactorCalibracion
    // ----------------------------------------------------------------------------------------
    public void obtenerFactorCalibracion(final double medida){

        PeticionarioREST elPeticionario = new PeticionarioREST();

        elPeticionario.hacerPeticionREST("GET", this.urlServidor + "obtenerFactorCalibracion", "" ,
                new PeticionarioREST.Callback() {
                    @Override
                    public void respuestaRecibida(int codigo, String cuerpo){
                        Log.d("RESPUESTA RECIBIDA", "Logica.anunciarCO() respuestaRecibida: codigo = "
                                + codigo + " cuerpo=" + cuerpo);
                        Log.d("Calibracion", "Calculamos factor calibracion");
                        // calculamos el factor de calibracion con la medida o media de las medidas y la medida proporcionada por la estacion oficial
                        double value = Double.parseDouble(cuerpo.substring(1,4));
                        Medida.calcularFactorCalibracion(medida, value);
                        Log.d("Calibracion", "La medida de la estacion es: " + cuerpo);
                    }
                },
                "application/json; charset=utf-8"
        );
    }
    // ----------------------------------------------------------------------------------------
    //                  usuario: Usuario --> darAltaUsuario() --> elCallback: Callback
    // ----------------------------------------------------------------------------------------
    public void darAltaUsuario(Usuario usuario, PeticionarioREST.Callback elCallback) {

        PeticionarioREST elPeticionario = new PeticionarioREST();

        Map<String, String> params = new HashMap<String, String>();
        params.put("email", usuario.getEmail());
        params.put("telefono", usuario.getTelefono());
        params.put("password", usuario.getPassword());

        JSONObject eljson = new JSONObject(params);

        elPeticionario.hacerPeticionREST("POST", this.urlServidor + "darAltaUsuario", eljson.toString(),elCallback,
                "application/json; charset=utf-8");
    }


    // ------------------------------------------------------------------------------------------
    //        email: String, password:String --> iniciarSesion() --> elCallback: Callback
    // ------------------------------------------------------------------------------------------
    public void iniciarSesion(String email, String password, PeticionarioREST.Callback elCallback) {

        PeticionarioREST elPeticionario = new PeticionarioREST();


        Map<String, String> params = new HashMap<String, String>();
        params.put("email", email);
        params.put("password", password);


        JSONObject eljson = new JSONObject(params);

        elPeticionario.hacerPeticionREST("POST", this.urlServidor + "iniciarSesion", eljson.toString(), elCallback,
                "application/json; charset=utf-8"
        );
    }

    // -------------------------------------------------------------------------------
    //                    --> getTodasLasMedidas() --> elCallback: Callback
    // -------------------------------------------------------------------------------
    public void getTodasLasMedidas(String idTipoMedida,PeticionarioREST.Callback elCallback) {

        PeticionarioREST elPeticionario = new PeticionarioREST();

        Map<String, String> params = new HashMap<String, String>();
        params.put("idTipoMedida",idTipoMedida.toString());

        JSONObject eljson = new JSONObject(params);

        elPeticionario.hacerPeticionREST("GET", this.urlServidor + "buscarUnTipoDeMedidas/" + idTipoMedida, eljson.toString(), elCallback,
                "application/json; charset=utf-8"
        );
    }

    // ----------------------------------------------------------------------------------------------
    //       email: String, emailNuevo: String --> cambiarEmail() --> elCallback: Callback
    // ----------------------------------------------------------------------------------------------
    public void cambiarEmail(String email,String emailNuevo,PeticionarioREST.Callback elCallback) {

        PeticionarioREST elPeticionario = new PeticionarioREST();

        Map<String, String> params = new HashMap<String, String>();
        params.put("email",email);
        params.put("emailNuevo",emailNuevo);

        JSONObject eljson = new JSONObject(params);

        elPeticionario.hacerPeticionREST("POST", this.urlServidor + "cambiarEmail", eljson.toString(), elCallback,
                "application/json; charset=utf-8"
        );
    }

    // ----------------------------------------------------------------------------------------------
    //       email: String, passwordNueva: String --> cambiarPassword() --> elCallback: Callback
    // ----------------------------------------------------------------------------------------------
    public void cambiarPassword(String email,String passwordNueva,PeticionarioREST.Callback elCallback) {

        PeticionarioREST elPeticionario = new PeticionarioREST();

        Map<String, String> params = new HashMap<String, String>();
        params.put("email",email);
        params.put("password",passwordNueva);

        JSONObject eljson = new JSONObject(params);

        elPeticionario.hacerPeticionREST("POST", this.urlServidor + "cambiarPassword", eljson.toString(), elCallback,
                "application/json; charset=utf-8"
        );
    }


    // -------------------------------------------------------------------------------------------------------
    //            idUsuario: N  --> distanciaRecorridaEnUnDia() --> elCallback: Callback
    // -------------------------------------------------------------------------------------------------------
    public void distanciaRecorridaEnUnDia(int idUsuario, PeticionarioREST.Callback elCallback) {

        PeticionarioREST elPeticionario = new PeticionarioREST();

        Map<String, String> params = new HashMap<String, String>();
        params.put("idUsuario", String.valueOf(idUsuario));

        JSONObject eljson = new JSONObject(params);

        elPeticionario.hacerPeticionREST("GET", this.urlServidor + "distanciaRecorridaEnUnDia/" + idUsuario, eljson.toString(), elCallback,
                "application/json; charset=utf-8"
        );
    }

    // -------------------------------------------------------------------------------------------------------
    //       idUsuario: N, idSensor: N --> asociarSensorUsuario() --> elCallback: Callback
    // -------------------------------------------------------------------------------------------------------
    public void asociarSensorUsuario(int idUsuario, int idSensor, PeticionarioREST.Callback elCallback) {

        PeticionarioREST elPeticionario = new PeticionarioREST();

        Map<String, String> params = new HashMap<String, String>();
        params.put("idUsuario", String.valueOf(idUsuario));
        params.put("idSensor", String.valueOf(idSensor));

        JSONObject eljson = new JSONObject(params);

        //Envio los datos al servidor
        elPeticionario.hacerPeticionREST("POST", this.urlServidor + "asociarSensorUsuario", eljson.toString(), elCallback,
                "application/json; charset=utf-8"
        );
    }

    // -------------------------------------------------------------------------------------------------------
    //       idUsuario: N --> buscarMedidasDelUltimoDiaDeUnUsuario() --> elCallback: Callback
    // -------------------------------------------------------------------------------------------------------
    public void buscarMedidasDelUltimoDiaDeUnUsuario(int idUsuario, PeticionarioREST.Callback elCallback) {

        PeticionarioREST elPeticionario = new PeticionarioREST();

        Map<String, String> params = new HashMap<String, String>();
        params.put("idUsuario", String.valueOf(idUsuario));

        JSONObject eljson = new JSONObject(params);

        elPeticionario.hacerPeticionREST("GET", this.urlServidor + "buscarMedidasDelUltimoDiaDeUnUsuario/" + idUsuario, eljson.toString(), elCallback,
                "application/json; charset=utf-8"
        );
    }

    // -------------------------------------------------------------------------------------------------------
    //                      --> obtenerDatosEstacionGandia() --> elCallback: Callback
    // -------------------------------------------------------------------------------------------------------
    public void obtenerDatosEstacionGandia(PeticionarioREST.Callback elCallback) {

        PeticionarioREST elPeticionario = new PeticionarioREST();

        Map<String, String> params = new HashMap<String, String>();
        JSONObject eljson = new JSONObject(params);

        elPeticionario.hacerPeticionREST("GET", this.urlServidor + "obtenerDatosEstacionGandia", eljson.toString(), elCallback,
                "application/json; charset=utf-8"
        );
    }

    // -------------------------------------------------------------------------------------------------------
    //                    idUsuario: N --> calidadDelAireRespiradoEnElUltimoDia() --> elCallback: Callback
    // -------------------------------------------------------------------------------------------------------
    public void calidadDelAireRespiradoEnElUltimoDia(int idUsuario,PeticionarioREST.Callback elCallback) {

        PeticionarioREST elPeticionario = new PeticionarioREST();

        Map<String, String> params = new HashMap<String, String>();
        params.put("idUsuario", String.valueOf(idUsuario));

        JSONObject eljson = new JSONObject(params);

        elPeticionario.hacerPeticionREST("GET", this.urlServidor + "calidadDelAireRespiradoEnElUltimoDia/" + idUsuario, eljson.toString(), elCallback,
                "application/json; charset=utf-8"
        );
    }

    // -------------------------------------------------------------------------------------------------------
    //                    String:imagen --> subirImagen() --> elCallback: Callback
    // -------------------------------------------------------------------------------------------------------
    public void subirImagen(String imagen, PeticionarioREST.Callback elCallback) {

        PeticionarioREST elPeticionario = new PeticionarioREST();

        Map<String, String> params = new HashMap<String, String>();
        params.put("file",imagen);
        JSONObject eljson = new JSONObject(params);

        elPeticionario.hacerPeticionREST("POST", this.urlServidor + "subirImagen" , eljson.toString(), elCallback,
                "application/json; charset=utf-8"
        );
    }


} // class

