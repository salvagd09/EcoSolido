package com.DisenoProductos.EcoSolido.Models.Entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuario_insignia", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_usuario", "id_insignia"})
})
public class UsuarioInsigniaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario_insignia")
    private Integer idUsuarioInsignia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private UsuarioEntity usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_insignia", nullable = false)
    private InsigniaEntity insignia;

    @Column(name = "fecha_desbloqueo", nullable = false)
    private LocalDateTime fechaDesbloqueo = LocalDateTime.now();

    public Integer getIdUsuarioInsignia() { return idUsuarioInsignia; }
    public void setIdUsuarioInsignia(Integer idUsuarioInsignia) { this.idUsuarioInsignia = idUsuarioInsignia; }

    public UsuarioEntity getUsuario() { return usuario; }
    public void setUsuario(UsuarioEntity usuario) { this.usuario = usuario; }

    public InsigniaEntity getInsignia() { return insignia; }
    public void setInsignia(InsigniaEntity insignia) { this.insignia = insignia; }

    public LocalDateTime getFechaDesbloqueo() { return fechaDesbloqueo; }
    public void setFechaDesbloqueo(LocalDateTime fechaDesbloqueo) { this.fechaDesbloqueo = fechaDesbloqueo; }
}
