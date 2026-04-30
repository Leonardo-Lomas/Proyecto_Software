package com.example.terapeutico.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.CascadeType;

@Entity
@Table(name = "terapeutas")
public class Terapeuta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "especialidad")
    private String especialidad;

    @Column(name = "consultorio")
    private int consultorio;

    @Column(name = "horario_disponible")
    private List<String> horarioDisponible;

    @Column(name = "estado")
    private Boolean estado;

    @OneToMany(mappedBy = "terapeuta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cita> citas;


    public Terapeuta(){}


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public int getConsultorio() {
        return consultorio;
    }

    public void setConsultorio(int consultorio) {
        this.consultorio = consultorio;
    }

    public List<String> getHorarioDisponible() {
        return horarioDisponible;
    }

    public void setHorarioDisponible(List<String> horarioDisponible) {
        this.horarioDisponible = horarioDisponible;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public List<Cita> getCitas() {
        return citas;
    }

    public void setCitas(List<Cita> citas) {
        this.citas = citas;
    }


    



}
