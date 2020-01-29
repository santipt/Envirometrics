package com.example.envirometrics;

import android.Manifest;
import android.app.ActivityManager;
import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;


import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.google.android.material.navigation.NavigationView;
import com.orhanobut.hawk.Hawk;

import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.preference.PreferenceManager;

import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    private final String TAG = "---MainActivityDebug---";
    private final String pServicio = "permisoServicio";

    public static int REQUEST_BLUETOOTH = 1;

    NavController navController;

    public LogicaFake laLogicaFake;
    public ReceptorBLE receptorBle;
    private BluetoothAdapter bluetoothAdapter;
    private String value;
    private boolean esTaxista;

    private boolean activarServicio;

    private AppBarConfiguration mAppBarConfiguration;

    private Intent intencionServicio;

    SharedPreferences preferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //Donde se guardan los datos del usuario de la aplicacion
        Hawk.init(this).build();

        //Donde se guardan los ajustes de la aplicacion
        preferences = getSharedPreferences("Ajustes", MODE_PRIVATE);

        //Devuelve si es taxista, en caso de no tener valor devuelve falso;
        esTaxista = Hawk.get("esTaxista", false);

        //Inicializamos los objetos siguientes.
        receptorBle = new ReceptorBLE(this, 1);
        laLogicaFake = new LogicaFake(this);


        //----------------------------------------------------
        //                  Beacon
        //----------------------------------------------------

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION ) == PackageManager.PERMISSION_GRANTED ){
            Log.d(TAG, "Permisos localizacion concedidos");
            if(esTaxista) {
                Log.d(TAG, "Es taxista");
                Log.d(TAG, "permisoServicio concedido");
                //Si contiene los permisos, es taxista y permite que funcione el servicio, el servicio se inicia
                preferences.edit().putBoolean(pServicio, true).commit();
            }else{
                Log.d(TAG, "No Es taxista");
                preferences.edit().putBoolean(pServicio, false).commit();
            }
        }else{
            Log.d(TAG, "No permisos localizacion");
            preferences.edit().putBoolean(pServicio, false).commit();
        }

        Log.d(TAG,preferences.getAll() + "");

        // creamos la intencionServicio que nos ejecutara el servicio y la notificacion en primer plano
        intencionServicio = new Intent(getApplicationContext(), Servicio.class);
        intencionServicio.setAction("com.example.envirometrics");

        //----------------------------------------------------
        //              NAVIGATION DRAWER
        //----------------------------------------------------
        Toolbar toolbar;
        DrawerLayout drawer;
        NavigationView navigationView;

        if(esTaxista){
            setContentView(R.layout.activity_main_taxista);
            toolbar = findViewById(R.id.toolbar_taxista);
            setSupportActionBar(toolbar);
            drawer = findViewById(R.id.drawer_layout_taxista);
            navigationView = findViewById(R.id.nav_view_taxista);

            mAppBarConfiguration = new AppBarConfiguration.Builder(
                    R.id.nav_map, R.id.nav_perfil, R.id.nav_resumen_dia, R.id.nav_info, R.id.nav_ajustes, R.id.nav_QR, R.id.nav_cerrar_sesion)
                    .setDrawerLayout(drawer)
                    .build();

            navController = Navigation.findNavController(this, R.id.nav_host_fragment_taxista);

        }
        else{
            setContentView(R.layout.activity_main);
            toolbar = findViewById(R.id.toolbar);
            setSupportActionBar(toolbar);
            drawer = findViewById(R.id.drawer_layout);
            navigationView = findViewById(R.id.nav_view);

            mAppBarConfiguration = new AppBarConfiguration.Builder(
                    R.id.nav_map, R.id.nav_perfil, R.id.nav_info, R.id.nav_ajustes, R.id.nav_cerrar_sesion)
                    .setDrawerLayout(drawer)
                    .build();

            navController = Navigation.findNavController(this, R.id.nav_host_fragment);
        }

        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);
    }

    //----------------------------------------------------------------------------------------------
    // onStart ()
    //----------------------------------------------------------------------------------------------
    @Override
    protected void onStart (){
        super.onStart();
        if(esTaxista) {
            Log.d(TAG, "Es taxista para iniciar");
            //Coprueba si los permisos de localizacion estan concedidos
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "PErmisos localizacion para iniciar");
                //Comprueba si el BT esta activado siempre que sea taxista
                if (receptorBle.checkBtOn()) {
                    Log.d(TAG, "BT on para iniciar");
                    if(!comprobarEstadoServicio()){
                        Log.d(TAG, "Servicio apagado OK para iniciar");
                        Log.d(TAG, preferences.contains(pServicio) + " " + preferences.getBoolean(pServicio, true));
                        if(preferences.contains(pServicio) && preferences.getBoolean(pServicio, false)) {
                            Log.d(TAG,"permisoServicio ok para iniciar");
                            startService(intencionServicio);
                        }
                    }

                }else{
                    startActivityForResult(receptorBle.btActived(), REQUEST_BLUETOOTH);
                }
            }
        }

    }
//Funcion para comprobar y pedir los permisos de GPS y en caso de tenerlos, pedir los del BT
    public void pedirPermisoGPS(){
/*
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA ) != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, 5);
        }

 */
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION ) != PackageManager.PERMISSION_GRANTED //&&
                /*ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED*/) {
            ActivityCompat.requestPermissions(this, new  String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 3);
        }else{
            if(receptorBle == null){
                receptorBle = new ReceptorBLE(this);
            }
            if(receptorBle.btActived() != null) {
                startActivityForResult(receptorBle.btActived(), REQUEST_BLUETOOTH);
            }
        }
    }

    //Respuesta de la peticion de permisos del GPS
    @Override
    public void onRequestPermissionsResult(int respuesta, String[] permissions, int[]grantResult){
        super.onRequestPermissionsResult(respuesta, permissions, grantResult);

        if(respuesta==3){
            if(grantResult.length > 0 && grantResult[0] == PackageManager.PERMISSION_GRANTED){
                activarServicio = true;
                if(receptorBle.btActived() != null) {
                    startActivityForResult(receptorBle.btActived(), REQUEST_BLUETOOTH);
                }
            }
            if(grantResult.length > 0 && PackageManager.PERMISSION_DENIED == grantResult[0]){
                avisarPermisos();
            }
        }

        if(respuesta==5){
            if(grantResult.length > 0 && grantResult[0] == PackageManager.PERMISSION_GRANTED){
                Intent i = new Intent(this, FotoActivity.class);
                startActivity(i);
            }
            if(grantResult.length > 0 && PackageManager.PERMISSION_DENIED == grantResult[0]){

            }
        }

    }

    // REsultado de la peticion de activacion de bluetooth, si es activado activaremos los botones
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode==REQUEST_BLUETOOTH) // Filtramos el resultado por el codigo de la actividad
        {
            //resultcode puede ser 0 si no se ha activado BT o -1 si este ha sido activado
            if(resultCode == -1){
                if(receptorBle.checkBtOn()){
                    if(!comprobarEstadoServicio()){
                        startService(intencionServicio);
                    }
                }
                return;
            }
            avisarPermisos();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onSupportNavigateUp() {

        //Obtener datos del usuario registrado
        String emailUsuario = Hawk.get("email");

        TextView nombreUsuarioNav = findViewById(R.id.nombreUsuarioNav);

        nombreUsuarioNav.setText(emailUsuario);

        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }

    // Funcion que mostrara un dialogo de aviso para recordar que sin el GPS o el Bluetooth
    // la aplicacion no dinpondra de todas sus funcionalidades
    public void avisarPermisos(){
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
        // set title
        alertDialogBuilder.setTitle("Aviso!");
        // set dialog message
        alertDialogBuilder
                .setMessage("La aplicación no funcionara correctamente sin los permisos." + "\n" +
                        "Desea aceptar los permisos?")
                .setCancelable(false)
                .setPositiveButton("SI",new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog,int id) {
                        // if this button is clicked, close
                        // current activity
                        pedirPermisoGPS();

                    }
                })
                .setNegativeButton("NO",new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog,int id) {
                        // if this button is clicked, just close
                        // the dialog box and do nothing
                        dialog.cancel();
                    }
                });

        // create alert dialog
        AlertDialog alertDialog = alertDialogBuilder.create();

        // show it
        alertDialog.show();
    }

    //Iniciar actividad de la cámara
    public void onClickFab (View view){

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA ) == PackageManager.PERMISSION_GRANTED){
            Intent i = new Intent(this, FotoActivity.class);
            startActivity(i);
        }
        else{
            pedirPermisoCamara();
        }


    }

    //Funcion para comprobar y pedir los permisos de la camara
    public void pedirPermisoCamara(){
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA ) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new  String[]{Manifest.permission.CAMERA}, 5);
        }
    }

    public boolean comprobarEstadoServicio(){
        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            Log.d(TAG, service.service.getClassName());
            if (service.service.getClassName().equals("com.example.envirometrics.Servicio")) {
                return true;
            }
        }
        return false;
    }
}
