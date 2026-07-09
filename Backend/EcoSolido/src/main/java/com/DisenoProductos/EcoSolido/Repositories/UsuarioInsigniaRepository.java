package com.DisenoProductos.EcoSolido.Repositories;

import com.DisenoProductos.EcoSolido.Models.Entities.UsuarioInsigniaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioInsigniaRepository extends JpaRepository<UsuarioInsigniaEntity, Integer> {
    @Query("SELECT ui FROM UsuarioInsigniaEntity ui JOIN FETCH ui.insignia WHERE ui.usuario.idUsuario = :idUsuario")
    List<UsuarioInsigniaEntity> findByUsuario_IdUsuario(@Param("idUsuario") Integer idUsuario);

    boolean existsByUsuario_IdUsuarioAndInsignia_IdInsignia(Integer idUsuario, Integer idInsignia);
}
