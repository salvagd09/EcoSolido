package com.DisenoProductos.EcoSolido.Repositories;

import com.DisenoProductos.EcoSolido.Models.Entities.IncidenciaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidenciaRepository extends JpaRepository<IncidenciaEntity,Integer> {
    List<IncidenciaEntity> findByUsuario_NombreUsuario(String nombreUsuario);
}
