package com.example.envirometrics;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import java.util.Date;

import static android.content.Context.BLUETOOTH_SERVICE;

public class ReceptorBLE {

    private final String TAG = "---ReceptorDebug---";

    private final BluetoothManager bluetoothManager;
    private BluetoothAdapter mBluetoothAdapter;
    private Context mContext;

    private TramaIBeacon laTrama;
    LogicaFake myLogic ;
    private Medida medicion;
    private LocalizadorGPS localizador;

    private long time;

    // Stops scanning after 10 seconds.
    private static final long SCAN_PERIOD = 1000 * 30;
    private final String MI_UUID = "EPSG-GTI-PROY-E2";
//    private final String MI_UUID = "EPSG-GTI-PROY-E2";

    //----------------------------------------------------------------------------------------------
    // Constructor
    //----------------------------------------------------------------------------------------------

    public ReceptorBLE(Context context_) {

        Log.e(TAG, "Dentro del constructor inicial de Receptor");

        this.mContext = context_;
        //mHandler = new Handler();
        myLogic = new LogicaFake(context_);

        medicion = new Medida();

        localizador = new LocalizadorGPS(mContext, this);
        localizador.ObtenerMiPosicionGPS();

        bluetoothManager = (BluetoothManager) mContext.getSystemService(BLUETOOTH_SERVICE);
        mBluetoothAdapter = bluetoothManager.getAdapter();
    }

    public ReceptorBLE(Context context_, int code){
        this.mContext = context_;
        bluetoothManager = (BluetoothManager) mContext.getSystemService(BLUETOOTH_SERVICE);
        mBluetoothAdapter = bluetoothManager.getAdapter();
    }

    //----------------------------------------------------------------------------------------------
    // Metodos Getters and Setters
    //----------------------------------------------------------------------------------------------

    public TramaIBeacon getTrama (){
        return laTrama;
    }

    //----------------------------------------------------------------------------------------------
    // Funciones y metodos para la busqueda y filtrado de dispositivos BTLE
    //----------------------------------------------------------------------------------------------

    // Metodo que comprueba si el BT esta encendido y en el caso que no lo este devuelve un intent
    // para mostrar un activity para pedirle al usuario que lo encienda.
    //En el caso que este encendido devolvera null.
    public Intent btActived() {

        if (!mBluetoothAdapter.isEnabled()) {
            Intent enableBT = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            return enableBT;
        }
        return null;
    }

    public boolean checkBtOn() {

        if (mBluetoothAdapter.isEnabled()) {
            return true;
        }
        return false;
    }

    //Da comienzo el escaneo donde se llama al callback implementado al final de la clase para
    // obtener la medida mediante bluetooth
    public void obtenerCO(){
        time = System.currentTimeMillis();
        //Log.e(TAG, "Dentro de obtenerCO()");
            mBluetoothAdapter.startLeScan(mLeScanCallback);
        //Log.e(TAG, "DEspues de llamar al callback");
    }

    //Metodo que se llama en el callback y se ejecuta cada vez que se encuentra una trama
    //almacenando en un objeto medidion todos los datos
    //por ultimo llama a un metodo para que envie la informacion al servidor
    public void actualizarMediciones( TramaIBeacon trama){

        Date date = new Date();

        stopScan();

        medicion.setMedidaCO(Utilidades.bytesToInt(trama.getMajor()));
        medicion.setLatitud(localizador.getLatitud());
        medicion.setLongitud(localizador.getLongitud());
        medicion.setTiempo(date.getTime());


        myLogic.anunciarCO(medicion);
    }

    //Para el escaneo
    public void stopScan(){
        mBluetoothAdapter.stopLeScan(mLeScanCallback);
    }

    //Filtro para obtener el dispositivo deseado de entre todos los encontrados
    //UUID>>
    //ListaDIspositivosBT>> filtrarPorUUID >> DispositivoBT
    public TramaIBeacon filtrarPorUUID(String uuid, byte[] datos){
        TramaIBeacon laTrama = new TramaIBeacon(datos);
        if(uuid.equals(Utilidades.bytesToString(laTrama.getUUID()))){

            return laTrama;
        }
        return null;
    }

    //----------------------------------------------------------------------------------------------
    // Funciones callback
    //----------------------------------------------------------------------------------------------

    // Device scan callback. Se ejecuta cada vez que encuentra un dispositivo por bluetooth
    private BluetoothAdapter.LeScanCallback mLeScanCallback =
            new BluetoothAdapter.LeScanCallback() {

                @Override //cada vez que descubre un dispositivo ejecuta la fucnion onLeScan
                public void onLeScan(final BluetoothDevice device, int rssi, byte[] scanRecord) {

                    Log.e(TAG, "Dentro de onLeScan");
                    Log.e(TAG, time + "");
                    Log.e(TAG, System.currentTimeMillis() + "");

                    long timer = time + SCAN_PERIOD;

                    Log.e(TAG, timer + "");

                    if(System.currentTimeMillis() > time+SCAN_PERIOD){
                        stopScan();
                    }

                    Log.d(TAG,device.toString());

                    TramaIBeacon tramaAux = filtrarPorUUID(MI_UUID, scanRecord);

                    if(tramaAux!= null) {
                        Log.e("--- Major Bluetooth ---", "Major: " + Utilidades.bytesToInt(tramaAux.getMajor()));
                        Log.e("--- Minor Bluetooth ---", "Minor: " + Utilidades.bytesToInt(tramaAux.getMinor()));

                        if(Utilidades.bytesToInt(tramaAux.getMinor())==1){
                            Log.d(TAG, "La medida es correcta");
                            laTrama = tramaAux;
                            actualizarMediciones(tramaAux);
                        }else{
                            Log.d(TAG, "La medida no es correcta, dejamos de escanear");
                            stopScan();
                        }
                    }
                }
            };
}




