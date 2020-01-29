package com.example.envirometrics;

import android.annotation.TargetApi;
import android.app.ActivityManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import java.util.Calendar;

import static com.example.envirometrics.R.mipmap.ic_envirometrics;

public class Servicio extends Service {

    private final String TAG = "---ServicioDebug---";

    private NotificationManager notificationManager;
    static final String CANAL_ID = "mi_canal";
    static final int NOTIFICACION_ID = 1;
    private Notification.Builder notificacion;

    private Handler mServiceHandler;

    private ReceptorBLE receptor;


    @Override
    public void onCreate(){

        Log.e(TAG, "Se ha creado el servicio");

        HandlerThread handlerThread = new HandlerThread("MyHandlerThread");
        handlerThread.start();
        Looper loop = handlerThread.getLooper();
        mServiceHandler =  new Handler(loop);

        //receptor = new ReceptorBLE(this);
        notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel notificationChannel = new NotificationChannel( CANAL_ID, "Mis Notificaciones", NotificationManager.IMPORTANCE_DEFAULT);
            notificationChannel.setDescription("Descripcion del canal"); notificationManager.createNotificationChannel(notificationChannel);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        Bitmap bm = BitmapFactory.decodeResource(getResources(), ic_envirometrics);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
            notificacion = new
                    Notification.Builder(this, CANAL_ID)
                    .setLargeIcon(bm)
                    .setSmallIcon(ic_envirometrics)
                    .setContentTitle("Analizando")
                    .setContentText("Proceso de analisis del la calidad del aire en marcha");
        }else{
            notificacion = new
                    Notification.Builder(this)
                    .setLargeIcon(bm)
                    .setSmallIcon(ic_envirometrics)
                    .setContentTitle("Anañizando")
                    .setContentText("Proceso de analisis del la calidad del aire en marcha");
        }


        PendingIntent intencionPendiente = PendingIntent.getActivity( this , 0, new Intent( this , MainActivity.class ),PendingIntent.FLAG_CANCEL_CURRENT);
        notificacion.setContentIntent(intencionPendiente);

        //notificationManager.notify(NOTIFICACION_ID, notificacion.build()); Crea la notificacion
        startForeground(NOTIFICACION_ID, notificacion.build()); // Asocia la vida de la notificacion a la del servicio
        //Cuando este es destruido, la notificacion tambien.
        receptor = new ReceptorBLE(this);
        //receptor.obtenerCO();

        return Service.START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }


    @Override
    public void onDestroy() {
        Log.d("Service-------", "Servicio destruido");

        // The service is no longer used and is being destroyed
    }

}
