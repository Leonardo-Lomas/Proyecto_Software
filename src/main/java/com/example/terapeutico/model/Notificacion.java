package com.example.terapeutico.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "notificaciones")
public class Notificacion {
    
    @Column(name = "fechaEnvio")
    private String fecha;

    @Column(name = "mensaje")
    private String mensaje;

    @OneToOne
    private Cita cita;

    public Notificacion(){}

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public Cita getCita() {
        return cita;
    }

    public void setCita(Cita cita) {
        this.cita = cita;
    }

    

}
