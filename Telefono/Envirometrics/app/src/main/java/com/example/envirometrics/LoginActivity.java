package com.example.envirometrics;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.github.rahatarmanahmed.cpv.CircularProgressView;
import com.orhanobut.hawk.Hawk;

import org.json.JSONException;
import org.json.JSONObject;

public class LoginActivity extends AppCompatActivity {

    private String email;
    private String telefono;
    private String password;
    private Button btnIniciarSesion;
    private TextView textoError;
    public LogicaFake laLogica;
    private Boolean firstTime = null;
    private CircularProgressView progressView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login);

        laLogica = new LogicaFake(this);
        btnIniciarSesion = findViewById(R.id.btnLog);
        textoError = findViewById(R.id.textoError);
        progressView = (CircularProgressView) findViewById(R.id.progress_view);


        Hawk.init(this).build();

        //Si ya está guardado el usuario, inicio sesión automáticamente
        if(Hawk.count() >0){
            Intent i = new Intent(LoginActivity.this, MainActivity.class);
            startActivity(i);
            this.finish();
        }

        if(primareVez()) {
            Intent i = new Intent(this, IntroActivity.class);
            startActivity(i);
        }

        iniciarSesion();
    }

    //---------------------------------------------------------
    //                  iniciarSesion()
    //---------------------------------------------------------
    public void iniciarSesion (){
        btnIniciarSesion.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                btnIniciarSesion.setText("");

                //Empieza la animación de cargar
                progressView.setVisibility(View.VISIBLE);
                progressView.startAnimation();

                //Guardo los valores de los editText en Strings
                EditText emailEditText = findViewById(R.id.email);
                email = emailEditText.getText().toString();

                EditText passwordEditText = findViewById(R.id.password);
                password = passwordEditText.getText().toString();

                textoError.setText("");

                //Iniciar sesión de la logicaFake
                laLogica.iniciarSesion(email,password,
                        new PeticionarioREST.Callback () {
                            @Override
                            public void respuestaRecibida( int codigo, String cuerpo ) {

                                Log.e("RESPUESTA RECIBIDA", "Logica.iniciarSesion() respuestaRecibida: codigo = "
                                        + codigo + " cuerpo=" + cuerpo);

                                //No se puede conectar al servidor
                                if(codigo == 0){
                                    Toast.makeText(getBaseContext(),"Error de conexión", Toast.LENGTH_SHORT).show();

                                    progressView.stopAnimation();
                                    progressView.setVisibility(View.INVISIBLE);

                                    btnIniciarSesion.setText("Iniciar sesión");
                                }

                                //Login correcto
                                if(cuerpo.contains("true")){

                                    try {
                                        JSONObject jsonObject = new JSONObject(cuerpo);
                                        Hawk.put("id", jsonObject.get("idUsuario"));
                                        Hawk.put("telefono", jsonObject.get("telefono"));

                                    }catch (JSONException err){
                                        Log.d("Error", err.toString());
                                    }


                                    //Almacenamos los datos del usuario en la app
                                    Hawk.put("email", email);

                                    Hawk.put("password", password);

                                    if(email.contains("taxista")){
                                        Hawk.put("esTaxista", true);
                                    }else{
                                        Hawk.put("esTaxista", false);
                                    }
                                    Intent i = new Intent(LoginActivity.this, MainActivity.class);
                                    startActivity(i);
                                    finishActivity();

                                    progressView.stopAnimation();
                                    progressView.setVisibility(View.INVISIBLE);

                                    btnIniciarSesion.setText("Iniciar sesión");


                                }else {
                                    textoError.setText("Email o contraseña incorrecta");
                                    progressView.stopAnimation();
                                    progressView.setVisibility(View.INVISIBLE);

                                    btnIniciarSesion.setText("Iniciar sesión");

                                } //if-else
                            }
                        }
                );

            }
        });
    }

    //---------------------------------------------------------
    //                  linkRegistrarse()
    //---------------------------------------------------------
    public void linkRegistrarse (View view){
        Intent i = new Intent(LoginActivity.this, RegistroActivity.class);
        startActivity(i);
    }

    //---------------------------------------------------------
    //                  finishActivity()
    //---------------------------------------------------------
    public void finishActivity(){
        this.finish();
    }

    //---------------------------------------------------------
    //                  primeraVez()
    //---------------------------------------------------------
    private boolean primareVez() {
        if (firstTime == null) {
            SharedPreferences mPreferences = this.getSharedPreferences("first_time", Context.MODE_PRIVATE);
            firstTime = mPreferences.getBoolean("firstTime", true);
            if (firstTime) {
                SharedPreferences.Editor editor = mPreferences.edit();
                editor.putBoolean("firstTime", false);
                editor.commit();
            }
        }
        return firstTime;
    }



}