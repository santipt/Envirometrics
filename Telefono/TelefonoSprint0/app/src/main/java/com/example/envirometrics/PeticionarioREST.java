package com.example.envirometrics;

import android.content.Context;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;

public class PeticionarioREST {

    //---------------------------------------------------------------------------------
    //variables PRIVADAS
    //---------------------------------------------------------------------------------
    private String url;
    private RequestQueue queue;


    //---------------------------------------------------------------------------------
    // Le pasamos la url del servidor que queramos conectarnos y un contexto ( MainActivity por ejemplo )
    // Texto, Context --> PeticionarioREST() --> (modifica los parámetros de dentro de la clase)
    //---------------------------------------------------------------------------------
    PeticionarioREST(String laUrl, Context context ){

        this.url = laUrl;
        queue = Volley.newRequestQueue( context );

    }

    //---------------------------------------------------------------------------------
    // Con este método podremos enviar un JSON por medio del protocolo HTTP al servidor
    // Texto, JSONObject --> postJSONHTTP()
    //---------------------------------------------------------------------------------
    public void postJSONHTTP(String paramsUrl, JSONObject elJson){
        JsonObjectRequest jsonObjRequest = new JsonObjectRequest
                (Request.Method.POST, url + paramsUrl, elJson, new Response.Listener<JSONObject>()
                {
                    @Override
                    public void onResponse(JSONObject response)
                    {
                        Log.d("Respuesta", response.toString());
                    }
                },
                        new Response.ErrorListener()
                        {
                            @Override
                            public void onErrorResponse(VolleyError error)
                            {
                                Log.d("Error conectar servidor", error.toString());
                            }
                        });

        // Add the request to the RequestQueue.
        queue.add(jsonObjRequest);
    }

}
