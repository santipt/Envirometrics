package com.example.envirometrics;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Switch;

import com.example.envirometrics.ui.home.HomeFragment;
import com.orhanobut.hawk.Hawk;

import java.security.Permission;
import java.util.List;
import java.util.Objects;

public class Ajustes extends AppCompatActivity {

    String TAG = "---Debug Ajustes ---";

    SharedPreferences preferences;
    SharedPreferences.Editor editor;

    ReceptorBLE receptor;

    RadioGroup rg;
    RadioButton rbSelected;

    Switch btnServ;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ajustes);

        receptor = new ReceptorBLE(this, 1);

        rg = findViewById(R.id.rg);
        btnServ = findViewById(R.id.btnServicio);


        Hawk.init(this).build();

        //Declaramos unas preferencias para los ajustes en modo privado y su editor
        preferences = getSharedPreferences("Ajustes", MODE_PRIVATE);
        editor = preferences.edit();
/*
        //Comprobamos que el permiso del servicio existe en las preferencias
        if(preferences.contains("permisoServicio")){
            if(preferences.getBoolean("permisoServicio", false))
            btnServ.setChecked(true);
            else
                Log.e(TAG, "primero");
                btnServ.setChecked(false);
        }else{
            Log.e(TAG, "segundo");
            btnServ.setChecked(false);
        }

 */

        btnServ.setChecked(false);
        editor.putBoolean("permisoServicio", false).commit();

        //Hacemos las comprobaciones para saber si el boto debe estar activado o no
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION ) == PackageManager.PERMISSION_GRANTED){
            Log.e(TAG, "primero");
            if(receptor.checkBtOn()){
                Log.e(TAG, "segundo");
                if(Hawk.get("esTaxista", false)){
                    Log.e(TAG, "tercero");
                    btnServ.setChecked(true);
                    editor.putBoolean("permisoServicio", true).commit();
                }else{

                }
            }
        }

        //Comprobamos que el campo tipoMedida existe, en caso negativo mostraremos por defecto la primera opcion elegida
        if(!preferences.contains("tipoMedida")){
            Log.d(TAG, "tipoMedida no existe");
            rg.check(R.id.rb1);
            editor.putString("tipoMedida", "1").commit();
            Log.d(TAG, preferences.getString("tipoMedida", "error: nulo"));
        }else{//En caso afirmativo se obtiene la opcion elegida para mostrar en las opciones la actual
            Log.d(TAG, "Tipo medida existe");
            Log.d(TAG, preferences.getString("tipoMedida", "error: nulo"));
                switch (preferences.getString("tipoMedida", "0")){
                    case "0":
                        rbSelected = findViewById(R.id.rb2);
                        rbSelected.setChecked(true);
                        break;
                    case "1":
                        rbSelected = findViewById(R.id.rb1);
                        rbSelected.setChecked(true);
                        break;
                    case "2":
                        rbSelected = findViewById(R.id.rb2);
                        rbSelected.setChecked(true);
                        break;
                    case "3":
                        rbSelected = findViewById(R.id.rb3);
                        rbSelected.setChecked(true);
                        break;
                    case "4":
                        rbSelected = findViewById(R.id.rb4);
                        rbSelected.setChecked(true);
                        break;
                    case "5":
                        rbSelected = findViewById(R.id.rb5);
                        rbSelected.setChecked(true);
                        break;
                    case "6":
                        rbSelected = findViewById(R.id.rb6);
                        rbSelected.setChecked(true);
                        break;
                }
        }
    }

    //Funcion para obtener la opcion del tipo de medida que elige ver el usuario
    public void obtenerOpcionElegida(View v){

        boolean marcado = ((RadioButton) v).isChecked();

        switch (v.getId()) {
            case R.id.rb1:
                if (marcado) {
                    editor.putString("tipoMedida", "1").commit();
                }
                break;

            case R.id.rb2:
                if (marcado) {
                    editor.putString("tipoMedida", "2").commit();
                }
                break;

            case R.id.rb3:
                if (marcado) {
                    editor.putString("tipoMedida", "3").commit();
                }
                break;
            case R.id.rb4:
                if (marcado) {
                    editor.putString("tipoMedida", "4").commit();
                }
                break;
            case R.id.rb5:
                if (marcado) {
                    editor.putString("tipoMedida", "5").commit();
                }
                break;
            case R.id.rb6:
                if (marcado) {
                    editor.putString("tipoMedida", "6").commit();
                }
                break;
        }
        Log.d("Debug-Preferences", preferences.getString("tipoMedida","error"));
        startActivity(new Intent(this, MainActivity.class));
        finish();
    }

    //Funcion para permitir o no el funcionamiento del servicio en segundo plano
    public void permitirServicio(View v){
        if(btnServ.isChecked()){
            editor.putBoolean("permisoServicio", true).commit();
        }else{
            editor.putBoolean("permisoServicio", false).commit();
            Intent i = new Intent(this, Servicio.class);
            stopService(i);
        }
        startActivity(new Intent(this, MainActivity.class));
        finish();
    }
}
