package com.example.envirometrics.ui.tools;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import com.example.envirometrics.Ajustes;
import com.example.envirometrics.LoginActivity;
import com.example.envirometrics.R;
import com.orhanobut.hawk.Hawk;

public class ToolsFragment extends Fragment {

    private ToolsViewModel toolsViewModel;
/*
    @Override
    public void onCreate (Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        Intent i = new Intent(getActivity().getApplication(), Ajustes.class);
        startActivity(i);
    }

 */
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        View root = null;

        Intent i = new Intent(getActivity(), Ajustes.class);
        startActivity(i);

        return root;
    }
}