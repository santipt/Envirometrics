package com.example.envirometrics;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Looper;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import static android.content.Context.LOCATION_SERVICE;

/*
Esta clase es para obtener la posicion del usuario para adjuntarla a la medida que se reciba del
sensor y poder ubicar esa medida en un mapa.
 */
public class LocalizadorGPS {

    private Context mContext;

    private static final String TAG = "LocalizadorGPS";

    private LocationManager mLocMgr;
    private Location ultimaPosicionMedida;

    //Minimo tiempo para updates en Milisegundos
    private static final long MIN_CAMBIO_DISTANCIA_PARA_UPDATES = 100; // 10 metros
    //Minimo tiempo para updates en Milisegundos
    private static final long MIN_TIEMPO_ENTRE_UPDATES = 1000 * 60 * 1; // 1 minuto

    /*
    Constructor del objeto localzadorGPS donde se inicializa el LocationManager
     */
    public LocalizadorGPS(Context mContext){
        this.mContext = mContext;
        mLocMgr = (LocationManager) this.mContext.getSystemService(LOCATION_SERVICE);
        /*
        if(!mLocMgr.isProviderEnabled(android.location.LocationManager.GPS_PROVIDER )) {
            Intent myIntent = new Intent(  );
            mContext.startActivity(myIntent);
        }*/
    }

    /*
    Metodo que sera llamado al iniciar la aplicacion y posteriormente se actualizara la medicion
    cada 100m o 10 min
     */
    public void ObtenerMiPosicionGPS (){

        if (ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            //Requiere permisos para Android 6.0
            Log.e(TAG, "No se tienen permisos necesarios!, se requieren.");
            ActivityCompat.requestPermissions((Activity) mContext, new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, 225);
            return;
        }else{
            Log.i(TAG, "Permisos necesarios OK!.");
            //Los datos de tiempo y distancia son para saber cuando el dispositivo se ha movido para actualizar la posicion, pero para ello se debe de mover y haber pasap cierto tiempo, sino no se actualiza
            mLocMgr.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, MIN_TIEMPO_ENTRE_UPDATES, MIN_CAMBIO_DISTANCIA_PARA_UPDATES, mLocListener, Looper.getMainLooper());
            mLocMgr.requestLocationUpdates(LocationManager.GPS_PROVIDER, MIN_TIEMPO_ENTRE_UPDATES, MIN_CAMBIO_DISTANCIA_PARA_UPDATES, mLocListener, Looper.getMainLooper());
        }
    }

    public boolean meHeMovido(){
        return false;
    }

    //----------------------------------------------------------------------------------------------
    //Getters and setters
    //----------------------------------------------------------------------------------------------

    public double getLatitud(){

        if(ultimaPosicionMedida != null)
        return ultimaPosicionMedida.getLatitude();
        else
            return 0.0;
    }

    public double getLongitud(){

        if(ultimaPosicionMedida != null)
        return ultimaPosicionMedida.getLongitude();
        else
            return 0.0;
    }


    //----------------------------------------------------------------------------------------------
    //Callback escuchador
    //----------------------------------------------------------------------------------------------
    private LocationListener mLocListener = new LocationListener() {
        public void onLocationChanged(Location location) {
            Log.i(TAG, "Lat " + location.getLatitude() + " Long " + location.getLongitude());
            ultimaPosicionMedida = location;
            Log.e(TAG, "Latitud: " + ultimaPosicionMedida.getLatitude() + " " + "Longitud: " + ultimaPosicionMedida.getLongitude());
        }

        public void onProviderDisabled(String provider) {
            Log.i(TAG, "onProviderDisabled()");
        }

        public void onProviderEnabled(String provider) {
            Log.i(TAG, "onProviderEnabled()");
        }

        public void onStatusChanged(String provider, int status, Bundle extras) {
            Log.i(TAG, "onStatusChanged()");
        }
    };
}
