package com.example.terapeutico.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "codigosOTP")
public class Autenticacion {
    
    @Column(name = "estado")
    private Boolean estado;

    @OneToOne
    private Usuario usuario;

    @Column(name = "fechaExpriacion")
    private String fechaExpiracion;

    public Autenticacion(){}

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getFechaExpiracion() {
        return fechaExpiracion;
    }

    public void setFechaExpiracion(String fechaExpiracion) {
        this.fechaExpiracion = fechaExpiracion;
    }

    

}
