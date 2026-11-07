package com.DisenoProductos.EcoSolido.Integrations;

import com.DisenoProductos.EcoSolido.Models.DTOs.ComprobanteDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.ConsultaRucDTO;

public interface ValidadorRUC {
    ConsultaRucDTO consultarRuc(String ruc);
    ComprobanteDTO verificarComprobante(String rucEmisor, String serie, String numero);
}
