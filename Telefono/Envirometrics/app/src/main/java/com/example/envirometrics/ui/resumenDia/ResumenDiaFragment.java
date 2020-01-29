package com.example.envirometrics.ui.resumenDia;

import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.example.envirometrics.LogicaFake;
import com.example.envirometrics.PeticionarioREST;
import com.example.envirometrics.R;
import com.github.rahatarmanahmed.cpv.CircularProgressView;
import com.google.android.gms.common.server.converter.StringToIntConverter;
import com.orhanobut.hawk.Hawk;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

import lecho.lib.hellocharts.model.Axis;
import lecho.lib.hellocharts.model.AxisValue;
import lecho.lib.hellocharts.model.Line;
import lecho.lib.hellocharts.model.LineChartData;
import lecho.lib.hellocharts.model.PointValue;
import lecho.lib.hellocharts.model.Viewport;
import lecho.lib.hellocharts.view.LineChartView;

public class ResumenDiaFragment extends Fragment {
    private LineChartView chart;
    private TextView distancia;
    private LogicaFake laLogica;
    private int idUsuario;
    private TextView textoMediaContaminacion;
    private int numberOfPoints = 5;
    private CircularProgressView progressView;
    private ImageView imagenAdvertencia;


    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        View root = inflater.inflate(R.layout.fragment_resumen_diario, container, false);

        //Empieza la animación de cargar
        progressView = (CircularProgressView) root.findViewById(R.id.progress_viewResumen);
        progressView.setVisibility(View.VISIBLE);
        progressView.startAnimation();


        Hawk.init(getContext()).build();

        idUsuario = Hawk.get("id");

        laLogica = new LogicaFake(getContext());
        chart = root.findViewById(R.id.chart);
        distancia = root.findViewById(R.id.textViewDistancia);
        textoMediaContaminacion = root.findViewById(R.id.textoMediaContaminacion);
        imagenAdvertencia = root.findViewById(R.id.imgAdvertencia);

        obtenerDistanciaRecorrida();
        empezarHacerDibujoContaminacionDiaria();
        obtenerCalidadDelAireRespiradoDuranteElDia();
        // Disable viewport recalculations, see toggleCubic() method for more info.
        chart.setViewportCalculationEnabled(false);

        resetViewport();


        return root;

    }

    private void resetViewport() {
        // Reset viewport height range to (0,100)
        final Viewport v = new Viewport(chart.getMaximumViewport());
        v.bottom = 0;
        v.top = 100;
        v.left = 0;
        v.right = numberOfPoints - 1;
        chart.setMaximumViewport(v);
        chart.setCurrentViewport(v);
    }


    // -----------------------------------------------------------------------------
    //  JSONArray -> f()
    // -----------------------------------------------------------------------------
    private void hacerDibujoContaminacionDiaria(JSONArray jsonArrayMedidas) throws JSONException {

        chart.setInteractive(true);

        List<PointValue> values = new ArrayList<PointValue>();

        //
        //
        //
        if(jsonArrayMedidas.length()==0) {
            values.add(new PointValue(0, 56));
            values.add(new PointValue(1, 44));
            values.add(new PointValue(2, 56));
            values.add(new PointValue(3, 80));
            values.add(new PointValue(4, 50));
        }else {

            for (int i = 0; i < 5; i++) {

                JSONObject object = jsonArrayMedidas.getJSONObject(i);

                double medida = object.getDouble("valorMedida");

                values.add(new PointValue(i, (float) medida));
                Log.d("VALOR GRAFICA", String.valueOf(medida));

            }
        }

        //
        // Crear línea gráfica
        //
        Line line = new Line(values).setColor(Color.rgb(0,180,154)).setCubic(true).setHasLabels(true);
        List<Line> lines = new ArrayList<Line>();
        lines.add(line);


        LineChartData data = new LineChartData();
        data.setLines(lines);

        AxisValue axisValueX;
        List<AxisValue> valores = new ArrayList<AxisValue>();

        String[] horas = {"8:00", "12:00", "18:00", "20:00", "22:00"};
        String[] contaminacion = new String[horas.length];

        //
        //
        //
        for (int i = 0; i < horas.length; i++){
            contaminacion[i]=horas[i];
            axisValueX = new AxisValue(i).setLabel(contaminacion[i]);// se le asigna a cada posicion el label que se desea
            // "i" es el valor del indice y dias es el string que mostrara el label
            valores.add(axisValueX);
        }

        Axis axisX = new Axis().setValues(valores);
        //Axis axisY = Axis.generateAxisFromRange(0, 90, 1);// para añadir un rango al eje Y

        //
        // Añadimos titulo a los indices
        //
        //axisX.setName("Horas");
        //axisY.setName("Contaminación %");

        // asignamos cada eje a su posicion en la grafica
        data.setAxisXBottom(axisX);
        //data.setAxisYLeft(axisY);

        chart.setZoomEnabled(false);

        //Le pasamos toda la informacion a la vista de la grafica
        chart.setLineChartData(data);

        progressView.stopAnimation();
        progressView.setVisibility(View.INVISIBLE);

    }

    // -----------------------------------------------------------------------------
    //
    // -----------------------------------------------------------------------------
    private void empezarHacerDibujoContaminacionDiaria(){
        //
        // busco las medidas para el dibujo
        //
        laLogica.buscarMedidasDelUltimoDiaDeUnUsuario(idUsuario,
                new PeticionarioREST.Callback () {
                    @Override
                    public void respuestaRecibida(int codigo, String cuerpo) {

                        try {
                                JSONArray jsonArrayMedidas = new JSONArray(cuerpo);
                                //
                                // ya tengo los datos, llamo a hacer el dibujo
                                //
                                hacerDibujoContaminacionDiaria(jsonArrayMedidas);


                        } catch (JSONException err) {
                                Log.d("Error", err.toString());
                        }

                        if(codigo ==  404){
                            try {
                                JSONArray jsonArrayMedidas = new JSONArray();
                                hacerDibujoContaminacionDiaria(jsonArrayMedidas);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }

                    }
                });
    }

    private void obtenerDistanciaRecorrida (){

        laLogica.distanciaRecorridaEnUnDia(idUsuario,
                new PeticionarioREST.Callback () {
                    @Override
                    public void respuestaRecibida(int codigo, String cuerpo) {
                        try {
                            //Limito la distancia a dos decimales (está en Km)
                            DecimalFormat df = new DecimalFormat("#.#");
                            JSONObject jsonObject = new JSONObject(cuerpo);
                            distancia.setText(1.2 + " Km");
                            //df.format(jsonObject.get("respuesta"))

                        }catch (JSONException err){
                            Log.d("Error", err.toString());
                        }
                    }
                });
    }

    private void obtenerCalidadDelAireRespiradoDuranteElDia () {
        laLogica.calidadDelAireRespiradoEnElUltimoDia(idUsuario,
                new PeticionarioREST.Callback () {
                    @Override
                    public void respuestaRecibida(int codigo, String cuerpo) {
                        if(codigo == 200){
                            try {
                                DecimalFormat df = new DecimalFormat("#.#");
                                JSONObject jsonObject = new JSONObject(cuerpo);
                                textoMediaContaminacion.setText(df.format(jsonObject.get("respuesta"))+ " ppm");
                                Double contaminacion = Double.parseDouble(df.format(jsonObject.get("respuesta")));

                                if(contaminacion >= 120.0){
                                    imagenAdvertencia.setImageResource(R.drawable.grave);
                                }
                                if(contaminacion >= 50.0){
                                    imagenAdvertencia.setImageResource(R.drawable.media);
                                }else{
                                    imagenAdvertencia.setImageResource(R.drawable.buena);
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                });
    }

}

