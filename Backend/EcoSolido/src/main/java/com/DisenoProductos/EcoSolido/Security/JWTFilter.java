package com.DisenoProductos.EcoSolido.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
@Configuration
public class JwtFilter  extends OncePerRequestFilter {
    private static final org.slf4j.Logger logger =
            org.slf4j.LoggerFactory.getLogger(JwtFilter.class);
    private final JwtUtil jwtUtil;
    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        // Leer header Authorization
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ") && !header.substring(7).equals("null")) {
            String token = header.substring(7); // quitar "Bearer "
            try {
                if(jwtUtil.validarToken(token)){
                    String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    nombreUsuario, null, new ArrayList<>()
                            );
                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception ex) {
                // Loguea el motivo real del fallo
                logger.warn("JWT inválido o expirado: {}", ex.getMessage());
            }
        }

        // continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }
}
