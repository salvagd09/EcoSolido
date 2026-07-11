package com.DisenoProductos.EcoSolido.Repositories;

import com.DisenoProductos.EcoSolido.Models.Entities.InsigniaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InsigniaRepository extends JpaRepository<InsigniaEntity, Integer> {
    Optional<InsigniaEntity> findByNombre(String nombre);
}
