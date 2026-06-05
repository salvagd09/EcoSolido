package com.DisenoProductos.EcoSolido.Repositories;

import com.DisenoProductos.EcoSolido.Models.DTOs.LoginRequestDTO;
import com.DisenoProductos.EcoSolido.Models.Entities.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity,Integer> {
    Optional<UsuarioEntity> findByNombreUsuario(String nombreUsuario);
}
