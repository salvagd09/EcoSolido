package com.DisenoProductos.EcoSolido.Models.Entities;

import jakarta.persistence.*;

@Entity
@Table(name="incidenciaFoto")
public class IncidenciaFotoEntity {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_foto")
    private Integer idFoto;
    /*
    * Para que se conecte correctamente con cloudinary*/
    @Column(name="public_id")
    private Integer publicId;
    @Column(name="url_foto")
    private String urlFoto;
    @ManyToOne
    @JoinColumn(name="id_incidencia")
    private IncidenciaEntity incidencia;
    public Integer getIdFoto() {
        return idFoto;
    }
    public void setIdFoto(Integer idFoto) {
        this.idFoto = idFoto;
    }
    public String getUrlFoto() {
        return urlFoto;
    }
    public void setUrlFoto(String urlFoto) {
        this.urlFoto = urlFoto;
    }

    public Integer getPublicId() {
        return publicId;
    }

    public void setPublicId(Integer publicId) {
        this.publicId = publicId;
    }

    public IncidenciaEntity getIncidencia() {
        return incidencia;
    }

    public void setIncidencia(IncidenciaEntity incidencia) {
        this.incidencia = incidencia;
    }
}
