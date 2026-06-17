package com.DisenoProductos.EcoSolido;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EcoSolidoApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcoSolidoApplication.class, args);
	}

}
