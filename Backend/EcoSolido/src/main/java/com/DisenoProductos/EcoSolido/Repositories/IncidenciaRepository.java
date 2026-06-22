package com.DisenoProductos.EcoSolido.Repositories;

import com.DisenoProductos.EcoSolido.Models.Entities.IncidenciaEntity;
import com.DisenoProductos.EcoSolido.Models.States.IncidenciaEstados;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidenciaRepository extends JpaRepository<IncidenciaEntity,Integer> {
    List<IncidenciaEntity> findByUsuario_NombreUsuario(String nombreUsuario);
    long countByUsuario_NombreUsuario(String nombreUsuario);
    long countByUsuario_NombreUsuarioAndEstado(String nombreUsuario, IncidenciaEstados estado);
}
