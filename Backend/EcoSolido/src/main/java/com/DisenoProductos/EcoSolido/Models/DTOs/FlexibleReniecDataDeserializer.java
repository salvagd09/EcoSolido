package com.DisenoProductos.EcoSolido.Models.DTOs;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

public class FlexibleReniecDataDeserializer extends JsonDeserializer<ReniecDataDTO> {
    @Override
    public ReniecDataDTO deserialize(JsonParser p, DeserializationContext ctxt)
            throws IOException {
        if (p.currentToken() == JsonToken.START_ARRAY) {
            p.skipChildren();
            return null;
        }
        return ctxt.readValue(p, ReniecDataDTO.class);
    }
}
