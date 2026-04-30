package com.example.terapeutico.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "comprobantes")
public class Comprobante {
    
    @Id
    private String folio;

    @Column(name = "fechaDeGeneracion")
    private String fechaDeGeneracion;

    @Column(name = "nombrePaciente")
    private String nombrePaciente;

    @Column(name = "nombreTerapeuta")
    private String nombreTerapeuta;

    @Column(name = "fechaCita")
    private String fechaCita;

    @Column(name = "horaCita")
    private String horaCita;

    @Column(name = "consultorio")
    private int consultorio;

    @OneToOne
    private Cita cita;

    public Comprobante(){}

    public String getFolio() {
        return folio;
    }

    public void setFolio(String folio) {
        this.folio = folio;
    }

    public String getFechaDeGeneracion() {
        return fechaDeGeneracion;
    }

    public void setFechaDeGeneracion(String fechaDeGeneracion) {
        this.fechaDeGeneracion = fechaDeGeneracion;
    }

    public String getNombrePaciente() {
        return nombrePaciente;
    }

    public void setNombrePaciente(String nombrePaciente) {
        this.nombrePaciente = nombrePaciente;
    }

    public String getNombreTerapeuta() {
        return nombreTerapeuta;
    }

    public void setNombreTerapeuta(String nombreTerapeuta) {
        this.nombreTerapeuta = nombreTerapeuta;
    }

    public String getFechaCita() {
        return fechaCita;
    }

    public void setFechaCita(String fechaCita) {
        this.fechaCita = fechaCita;
    }

    public String getHoraCita() {
        return horaCita;
    }

    public void setHoraCita(String horaCita) {
        this.horaCita = horaCita;
    }

    public int getConsultorio() {
        return consultorio;
    }

    public void setConsultorio(int consultorio) {
        this.consultorio = consultorio;
    }

    public Cita getCita() {
        return cita;
    }

    public void setCita(Cita cita) {
        this.cita = cita;
    }

    


}
