package com.example.envirometrics;

public class Usuario {

    private String email;
    private String telefono;
    private String password;


    public Usuario(String email_, String tel_, String password_)
    {
        this.email = email_;
        this.telefono = tel_;
        this.password = password_;
    }

    public String getEmail() {
        return email;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.email = correoElectronico;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String tel) {
        this.telefono = tel;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword() {
        this.password = password;
    }
}
