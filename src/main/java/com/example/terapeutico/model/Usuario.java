package com.example.terapeutico.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.util.List;

import jakarta.persistence.CascadeType;

@Entity
@Table(name="pacientes")
public class Usuario {
    
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cita> citas;

    @Column(name="nombre",nullable = false)
    private String nombre;

    @Id
    @Column(name="telefono",nullable = false)
    private String telefono;

    @Column(name="email")
    private String email;

    @Column(name="fechaDeNacimiento", nullable = false)
    private String fechaDeNacimiento;

    @Column(name="sexo",nullable = false)
    private Character sexo;

    @Column(name="autenticado",nullable = false)
    private boolean autenticado;

    @OneToOne(mappedBy = "usuario",cascade = CascadeType.ALL,orphanRemoval = true)
    private Autenticacion codigoOTP;


    public Usuario(){        
    }

        // Geters y setters
    public String getNombre(){
        return nombre;
    }

    public String getTelefono(){
        return telefono;
    }

    public String getEmail(){
        return email;
    }

    public String getFechaDeNacimiento(){
        return fechaDeNacimiento;
    }

    public Character getSexo(){
        return sexo;
    }
    
    public boolean getAutenticado(){
        return autenticado;
    }

    //Setters

    public void setNombre(String Nombre){
        this.nombre=Nombre;
    }

    public void setTelefono(String Telefono){
        this.telefono=Telefono;
    }

    public void setEmail(String Email){
        this.email=Email;
    }

    public void setFechaDeNacimiento(String FechaDeNacimiento){
        this.fechaDeNacimiento=FechaDeNacimiento;
    }

    public void setSexo(Character Sexo){
       this.sexo=Sexo;
    }
    
    public void setAutenticado(boolean Autenticado){
        this.autenticado=Autenticado;
    }

    public List<Cita> getCitas() {
        return citas;
    }

    public void setCitas(List<Cita> citas) {
        this.citas = citas;
    }


    
}
