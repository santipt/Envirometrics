package com.example.envirometrics.ui.cerrraSesion;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class CerrarSesionViewModel extends ViewModel {

    private MutableLiveData<String> mText;

    public CerrarSesionViewModel() {

    }

    public LiveData<String> getText() {
        return mText;
    }
}