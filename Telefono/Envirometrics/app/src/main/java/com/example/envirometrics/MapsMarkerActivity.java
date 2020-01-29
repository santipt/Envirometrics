package com.example.envirometrics;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.util.Log;
import android.widget.Toast;

import androidx.core.content.ContextCompat;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.android.gms.maps.model.TileOverlayOptions;
import com.google.gson.JsonObject;
import com.google.maps.android.heatmaps.Gradient;
import com.google.maps.android.heatmaps.HeatmapTileProvider;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.google.maps.android.heatmaps.WeightedLatLng;
import com.orhanobut.hawk.Hawk;

public class MapsMarkerActivity extends Activity implements OnMapReadyCallback {

    //DECLARACION DE VARIABLES GLOBALES
    Context context;
    private HeatmapTileProvider mProvider;
    TileOverlay mOverlay;
    GoogleMap map;
    Criteria criteria;
    private LogicaFake laLogica;
    private LocationManager locationManager;
    SharedPreferences preferences;


    public MapsMarkerActivity(Context context_, LocationManager locationManager_){
        this.context=context_;
        this.laLogica = new LogicaFake(context_);
        this.locationManager = locationManager_;
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {

        map = googleMap;

        preferences = context.getSharedPreferences("Ajustes", MODE_PRIVATE);

        //Log.d("tipo de medida",preferences.getString("tipoMedida","1"));

        String tipoMedida = preferences.getString("tipoMedida","1");

        laLogica.getTodasLasMedidas(tipoMedida, new PeticionarioREST.Callback () {
            @Override
            public void respuestaRecibida(int codigo, String cuerpo) {
                try {
                    if(codigo==200) {

                        JSONArray jsonObject = new JSONArray(cuerpo);
                        mostrarDatosContaminacion(jsonObject);
                    }

                }catch (JSONException err){
                    Log.d("Error", err.toString());
                }
            }
        });

        //Quito la opcion navegacion
        googleMap.getUiSettings().setMapToolbarEnabled(false);
        googleMap.getUiSettings().setZoomControlsEnabled(false);


        //Mi posición
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED && ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED) {
            googleMap.setMyLocationEnabled(true);


            //Hacer zoom a mi localización
            if (locationManager != null) {
                Location location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);

                if (location != null) {
                    googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(location.getLatitude(), location.getLongitude()), 13));

                    CameraPosition cameraPosition = new CameraPosition.Builder()
                            .target(new LatLng(location.getLatitude(), location.getLongitude()))      // Centrar el mapa en mi posición
                            .zoom(15)                   // Zoom de la cámara
                            .bearing(0)                // Orientación norte
                            .build();

                    googleMap.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
                }
            }
        }

        //
        //
        //
        mostrarDatosEstacionContaminacionGandia(googleMap);

    }


    //MAPA DE COLOR
    private void mostrarDatosContaminacion(JSONArray jsonObject) {

        List<WeightedLatLng> list = null;

        // Create the gradient.
        int[] colors = {
                Color.rgb(102, 225, 0), // green
                Color.rgb(255, 0, 0)    // red
        };

        float[] startPoints = {
                0.2f, 2f
        };

        Gradient gradient = new Gradient(colors, startPoints);

        //Obtener una lista con la latitud, longitud y valor de la medida
        try {
            list = leerDatosJson(jsonObject);
        } catch (JSONException e) {
            Toast.makeText(context, "Problem reading list of locations.", Toast.LENGTH_LONG).show();
        }

        // Creando un heat map tile provider, pasando una lista WeightedLatLng
        mProvider = new HeatmapTileProvider.Builder().weightedData(list).gradient(gradient).radius(50).build();
        // Añado a tile overlay to the map, usando heat map tile provider
        mOverlay = map.addTileOverlay(new TileOverlayOptions().tileProvider(mProvider));

    }

    private List<WeightedLatLng> leerDatosJson(JSONArray jsonObject) throws JSONException {

        ArrayList<WeightedLatLng> listValorMedida = new ArrayList<WeightedLatLng>();

        for (int i = 0; i < jsonObject.length(); i++) {
            JSONObject object = jsonObject.getJSONObject(i);
            double lat = object.getDouble("latitud");
            double lng = object.getDouble("longitud");
            double medida = object.getDouble("valorMedida");
            Log.d("MEDIDA", String.valueOf(medida));
            listValorMedida.add(new WeightedLatLng(new LatLng(lat, lng), medida));
        }

        return listValorMedida;
    }

    private void mostrarDatosEstacionContaminacionGandia (final GoogleMap googleMap){

        laLogica.obtenerDatosEstacionGandia(new PeticionarioREST.Callback () {
            @Override
            public void respuestaRecibida(int codigo, String cuerpo) {
                try {

                    JSONArray jsonObject = new JSONArray(cuerpo);

                    //Obtener ultimo valor medido en la estación
                    JSONObject object = jsonObject.getJSONObject(jsonObject.length()-1);

                    String hora = object.getString("hora");
                    double co = object.getDouble("co");

                    /*
                    double s02 = object.getDouble("s02");
                    double no = object.getDouble("no");
                    double no2 = object.getDouble("no2");
                    double nox = object.getDouble("nox");
                    double o3 = object.getDouble("o3");*/

                    //Añado la estación de medida de Gandia
                    LatLng estacionMedidaGandia = new LatLng(38.968148, -0.189648);
                    googleMap.addMarker(new MarkerOptions().position(estacionMedidaGandia)
                            .title("Estación Gandía")
                            .icon(BitmapDescriptorFactory.fromResource(R.drawable.ic_estacion))
                            .snippet(" Nivel CO: " + co + "   Hora: " + hora));

                }catch (JSONException err){
                    Log.d("Error", err.toString());
                }
            }
        });


    }
}
