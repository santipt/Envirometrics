package com.example.envirometrics;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

public class MainActivity extends AppCompatActivity {

    public static int REQUEST_BLUETOOTH = 1;

    public LogicaFake laLogicaFake;
    public ReceptorBLE receptorBle;
    private BluetoothAdapter bluetoothAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //Se piden los permisoso de localizacion o se comprueban que la app disponga de ellos
        pedirPermisoGPS();

        //Se crea un objeto localizador y se obtiene la posicion al inicio
        LocalizadorGPS localizador = new LocalizadorGPS(this);
        localizador.ObtenerMiPosicionGPS();

        Log.e("--- DEBUG BT ---", "Inicio del programa");

        //Inicializamos el receptor bluetooth y la logica que comunicara al servidor
        receptorBle = new ReceptorBLE(this);
        laLogicaFake = new LogicaFake( this );

        Log.e("--- DEBUG BT ---", "Inicializamos receptorBle");

        // Comprobamos que el dispositivo tenga el BT On.
        if(receptorBle.checkBleOn() != null) {
            startActivityForResult(receptorBle.checkBleOn(), REQUEST_BLUETOOTH);
        }

        //Cuando se pulsa el boton epieza a escanear llamando a la funcion obtenerCO()
        Button scanBoton = findViewById(R.id.scan);
        scanBoton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.e("--- DEBUG BT ---", "Boton escanear pulsado");
                receptorBle.obtenerCO();
                Log.e("--- DEBUG BT ---", "Despues de la llamada a obtenerCO()");
                //new EscanerSegundoPlano().execute(receptorBle);//Ejecutamos la tarea asincrona para buscar dispositivos
                Log.e("--- DEBUG BT ---", "A ver cuando se ejecuta esto");
            }
        });

        //Cuando se pulsa el boton para de escanear llamando a la funcion stopScan()
        Button stopBoton = findViewById(R.id.stop);
        stopBoton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.d("---BT---", "Boton de stop pulsado");
                receptorBle.stopScan();
            }
        });
/*
        Button anunciarCo = findViewById(R.id.anunciarCO);
        anunciarCo.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                anunciarCO();
            }
        });
*/
    }

    public void pedirPermisoGPS(){
        if (ContextCompat.checkSelfPermission(this,
                Manifest.permission.READ_CONTACTS)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    3);
        }
    }

    @Override
    public void onRequestPermissionsResult(int respuesta, String[] permissions, int[]grantResult){
        if(respuesta==3){
            if(grantResult.length > 0 && grantResult[0] == PackageManager.PERMISSION_GRANTED){

            }else{
                finish();
            }
        }
    }

}
