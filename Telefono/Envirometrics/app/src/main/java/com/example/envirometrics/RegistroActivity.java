package com.example.envirometrics;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.github.rahatarmanahmed.cpv.CircularProgressView;
import com.orhanobut.hawk.Hawk;

import org.json.JSONException;
import org.json.JSONObject;

public class RegistroActivity extends Activity {

    private String email;
    private String telefono;
    private String password;
    private String confirmarPassword;
    private Button btnRegistrarme;
    private TextView textoError;

    public LogicaFake laLogica;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.registro);

        btnRegistrarme = findViewById(R.id.btnRegistrarse);
        textoError = findViewById(R.id.textoError2);
        laLogica = new LogicaFake(this);
        Hawk.init(this).build();
        registrarse();

    }

    //---------------------------------------------------------
    //                  registrarse()
    //---------------------------------------------------------
    public void registrarse (){

        btnRegistrarme.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                //Guardo los valores de los editText en Strings
                EditText emailEditText = findViewById(R.id.editTextEmail);
                email = emailEditText.getText().toString();

                EditText telefonoEditText = findViewById(R.id.editTextTelefono);
                telefono = telefonoEditText.getText().toString();

                EditText passwordEditText1 = findViewById(R.id.editTextPassword1);
                password = passwordEditText1.getText().toString();

                EditText passwordEditText2 = findViewById(R.id.editTextPassword2);
                confirmarPassword = passwordEditText2.getText().toString();

                //Compruebo que todos los campos estan completos
                if(email.equals("")||telefono.equals("")||password.equals("")||confirmarPassword.equals("")){
                    textoError.setText("Complete todos los campos");
                }
                else {
                    //Compruebo si es un email
                    if(!email.contains("@")){
                        textoError.setText("Email incorrecto");
                    }
                    //Compruebo que las contraseñas coinciden
                    else if (!password.equals(confirmarPassword)) {
                        textoError.setText("Las contraseñas no coinciden");
                    }
                    //Todo correcto
                    else {

                        textoError.setText("");
                        btnRegistrarme.setText("");

                        //Empieza la animación de cargar
                        final CircularProgressView progressView = (CircularProgressView) findViewById(R.id.progress_view2);
                        progressView.setVisibility(View.VISIBLE);
                        progressView.startAnimation();

                        //Creo un usuario y se lo envio al servidor para que lo guarde en la bd
                        Usuario nuevoUsuario = new Usuario(email, telefono, password);

                        //Dar alta usuario de la logicaFake
                        laLogica.darAltaUsuario( nuevoUsuario,
                                new PeticionarioREST.Callback () {
                                    @Override
                                    public void respuestaRecibida( int codigo, String cuerpo ) {

                                        //Si hay error con el Hawk del if del "OK", descomentar la linea de abajo
                                        //Hawk.init(this).build;
                                        Log.e("RESPUESTA RECIBIDA", "Logica.darAltaUsuario() respuestaRecibida: codigo = "
                                                + codigo + " cuerpo=" + cuerpo);

                                        //No se puede conectar al servidor
                                        if(codigo==0){
                                            Toast.makeText(getBaseContext(),"Error de conexión", Toast.LENGTH_SHORT).show();
                                            progressView.stopAnimation();
                                            progressView.setVisibility(View.INVISIBLE);

                                            btnRegistrarme.setText("Registrarse");
                                        }

                                        //Todo correcto con el servidor
                                        if(cuerpo.contains("true")){

                                            //Almacenamos los datos del usuario en la app
                                            Hawk.put("email", email);
                                            Hawk.put("telefono", telefono);
                                            Hawk.put("password", password);
                                            if(email.contains("taxista")){
                                                Hawk.put("esTaxista", true);
                                            }else{
                                                Hawk.put("esTaxista", false);
                                            }

                                            try {
                                                JSONObject jsonObject = new JSONObject(cuerpo);
                                                Hawk.put("id", jsonObject.get("idUsuario"));
                                            }catch (JSONException err){
                                                Log.d("Error", err.toString());
                                            }

                                            Intent i = new Intent(RegistroActivity.this, MainActivity.class);
                                            startActivity(i);

                                            progressView.stopAnimation();
                                            progressView.setVisibility(View.INVISIBLE);
                                            btnRegistrarme.setText("Registrarse");

                                        } else {
                                            progressView.stopAnimation();
                                            progressView.setVisibility(View.INVISIBLE);
                                            btnRegistrarme.setText("Registrarse");

                                            textoError.setText("Esta cuenta ya existe");
                                        }//if-else
                                    }
                                }
                        );
                    }
                }//else

            }
        });
    }

    //---------------------------------------------------------
    //                  linkIniciarSesion()
    //---------------------------------------------------------
    public void linkIniciarSesion (View view){
        Intent MainIntent = new Intent(RegistroActivity.this, LoginActivity.class);
        startActivity(MainIntent);
    }
}
