package com.example.envirometrics;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.Image;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;

import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.github.rahatarmanahmed.cpv.CircularProgressView;

import java.io.ByteArrayOutputStream;
import java.io.File;

import static java.lang.System.out;

public class FotoActivity extends Activity {

    static final int REQUEST_IMAGE_CAPTURE = 1;
    private ImageView foto;
    private ImageView salir;
    private LogicaFake laLogica;
    private CircularProgressView progressView;


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_foto);

        laLogica = new LogicaFake(this);

        foto = findViewById(R.id.fotoTomada);
        salir = findViewById(R.id.arrowLeftFoto);

        Intent i = new Intent("android.media.action.IMAGE_CAPTURE");
        startActivityForResult(i, REQUEST_IMAGE_CAPTURE);

        salir.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == RESULT_OK) {

            //Empieza la animación de cargar
            progressView = (CircularProgressView) findViewById(R.id.progress_viewFoto);
            progressView.setVisibility(View.VISIBLE);
            progressView.startAnimation();

            Bitmap imageBitmap = (Bitmap)data.getExtras().get("data");
            foto.setImageBitmap(imageBitmap);

            String image = getStringImagen(imageBitmap);


            //Subir imagen al servidor
            laLogica.subirImagen(image ,new PeticionarioREST.Callback () {
                        @Override
                        public void respuestaRecibida(int codigo, String cuerpo) {
                            progressView.stopAnimation();
                            progressView.setVisibility(View.INVISIBLE);
                            Bitmap imagenProcesada = StringToBitMap(cuerpo);
                            foto.setImageBitmap(imagenProcesada);
                        }
            });


        }
    }

    public String getStringImagen(Bitmap bmp) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.JPEG, 100, baos);
        byte[] imageBytes = baos.toByteArray();
        String encodedImage = Base64.encodeToString(imageBytes, Base64.DEFAULT);
        return encodedImage;
    }

    public Bitmap StringToBitMap(String encodedString){
        try{
            byte [] encodeByte = Base64.decode(encodedString,Base64.DEFAULT);
            Bitmap bitmap = BitmapFactory.decodeByteArray(encodeByte, 0, encodeByte.length);
            return bitmap;
        }
        catch(Exception e){
            e.getMessage();
            return null;
        }
    }


    @Override
    public void onRequestPermissionsResult(int respuesta, String[] permissions, int[]grantResult){
        super.onRequestPermissionsResult(respuesta, permissions, grantResult);
        Log.d("---PERMISOS---", "--- ID Permiso: " + respuesta);

        if(respuesta==5){
            if(grantResult.length > 0 && grantResult[0] == PackageManager.PERMISSION_GRANTED){
                Log.d("---PERMISOS---", "---Permiso concedido---");

            }
            if(grantResult.length > 0 && PackageManager.PERMISSION_DENIED == grantResult[0]){

            }
        }

    }
}
