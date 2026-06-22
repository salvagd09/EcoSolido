package com.DisenoProductos.EcoSolido.Repositories;

import com.DisenoProductos.EcoSolido.Models.Entities.IncidenciaEntity;
import com.DisenoProductos.EcoSolido.Models.States.IncidenciaEstados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface IncidenciaRepository extends JpaRepository<IncidenciaEntity,Integer> {
    List<IncidenciaEntity> findByUsuario_NombreUsuario(String nombreUsuario);
    long countByUsuario_NombreUsuario(String nombreUsuario);
    long countByUsuario_NombreUsuarioAndEstado(String nombreUsuario, IncidenciaEstados estado);
    @Query("SELECT COUNT(i) FROM IncidenciaEntity i WHERE i.usuario.nombreUsuario = :nombreUsuario " +
            "AND i.fecha >= :inicioMes")
    long countDesdeFecha(@Param("nombreUsuario") String nombreUsuario, @Param("inicioMes") LocalDateTime inicioMes);
}
