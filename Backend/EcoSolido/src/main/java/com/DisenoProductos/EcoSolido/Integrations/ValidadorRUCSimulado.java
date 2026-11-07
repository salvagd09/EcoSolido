package com.DisenoProductos.EcoSolido.Integrations;

import com.DisenoProductos.EcoSolido.Models.DTOs.ComprobanteDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.ConsultaRucDTO;
import com.DisenoProductos.EcoSolido.Models.DTOs.EstablecimientoDTO;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Validador de RUC en MODO DEMOSTRACIÓN.
 * No consulta SUNAT: valida el formato y el dígito verificador con el algoritmo
 * oficial y responde con datos de prueba. Para usar la API real, cambiar
 * validador.ruc.modo=api en application.properties.
 */
@Service
@ConditionalOnProperty(name = "validador.ruc.modo", havingValue = "simulado", matchIfMissing = true)
public class ValidadorRUCSimulado implements ValidadorRUC {

    private static final int[] PESOS = {5, 4, 3, 2, 7, 6, 5, 4, 3, 2};

    // Datos ficticios para la demo (todos con dígito verificador válido)
    private static final Map<String, ConsultaRucDTO> EMPRESAS_PRUEBA = Map.of(
            "20600000013", new ConsultaRucDTO(true, "20600000013",
                    "RESTAURANTE DEMO CARABAYLLO S.A.C.", "ACTIVO", "HABIDO",
                    List.of(
                            new EstablecimientoDTO("0000", "DOMICILIO FISCAL", "AV. EJEMPLO 123", "LOS OLIVOS"),
                            new EstablecimientoDTO("0001", "LOCAL COMERCIAL", "AV. TUPAC AMARU 4500", "CARABAYLLO")),
                    "Consulta simulada"),
            "20600000021", new ConsultaRucDTO(true, "20600000021",
                    "MERCADO DEMO VILLA EL SALVADOR E.I.R.L.", "ACTIVO", "HABIDO",
                    List.of(new EstablecimientoDTO("0000", "DOMICILIO FISCAL", "AV. EL SOL 800", "VILLA EL SALVADOR")),
                    "Consulta simulada"),
            "20600000030", new ConsultaRucDTO(true, "20600000030",
                    "EMPRESA SIN LOCAL EN DISTRITO S.A.", "ACTIVO", "HABIDO",
                    List.of(new EstablecimientoDTO("0000", "DOMICILIO FISCAL", "JR. PRUEBA 456", "MIRAFLORES")),
                    "Consulta simulada"),
            "20600000048", new ConsultaRucDTO(true, "20600000048",
                    "EMPRESA DADA DE BAJA S.A.C.", "BAJA DE OFICIO", "NO HABIDO",
                    List.of(new EstablecimientoDTO("0000", "DOMICILIO FISCAL", "CALLE FALSA 1", "CARABAYLLO")),
                    "Consulta simulada")
    );

    @Override
    public ConsultaRucDTO consultarRuc(String ruc) {
        String error = validarFormato(ruc);
        if (error != null) {
            return ConsultaRucDTO.noEncontrado(ruc, error);
        }
        ConsultaRucDTO conocida = EMPRESAS_PRUEBA.get(ruc);
        if (conocida != null) {
            return conocida;
        }
        // Cualquier otro RUC válido: empresa genérica activa en Carabayllo
        return new ConsultaRucDTO(true, ruc, "EMPRESA DE PRUEBA " + ruc, "ACTIVO", "HABIDO",
                List.of(new EstablecimientoDTO("0000", "DOMICILIO FISCAL", "DIRECCION DE PRUEBA", "CARABAYLLO")),
                "Consulta simulada (RUC no registrado en datos de prueba)");
    }

    @Override
    public ComprobanteDTO verificarComprobante(String rucEmisor, String serie, String numero) {
        if (validarFormato(rucEmisor) != null) {
            return new ComprobanteDTO(false, "RUC del emisor inválido");
        }
        if (serie == null || !serie.toUpperCase().matches("^[FB][A-Z0-9]{3}$")) {
            return new ComprobanteDTO(false, "Serie inválida (ej.: F001 para factura, B001 para boleta)");
        }
        if (numero == null || !numero.matches("^\\d{1,8}$")) {
            return new ComprobanteDTO(false, "Número inválido (hasta 8 dígitos)");
        }
        // Regla de demo para mostrar el caso de comprobante inexistente
        if (numero.endsWith("000")) {
            return new ComprobanteDTO(false, "El comprobante no existe en SUNAT (simulado)");
        }
        return new ComprobanteDTO(true, "Comprobante válido (simulado)");
    }

    /** Devuelve null si el RUC es válido, o el motivo si no lo es. */
    private String validarFormato(String ruc) {
        if (ruc == null || !ruc.matches("^\\d{11}$")) {
            return "El RUC debe tener 11 dígitos";
        }
        String prefijo = ruc.substring(0, 2);
        if (!List.of("10", "15", "17", "20").contains(prefijo)) {
            return "El RUC debe empezar con 10, 15, 17 o 20";
        }
        int suma = 0;
        for (int i = 0; i < 10; i++) {
            suma += Character.getNumericValue(ruc.charAt(i)) * PESOS[i];
        }
        int digito = 11 - (suma % 11);
        if (digito == 10) digito = 0;
        if (digito == 11) digito = 1;
        if (digito != Character.getNumericValue(ruc.charAt(10))) {
            return "El dígito verificador del RUC no es válido";
        }
        return null;
    }
}