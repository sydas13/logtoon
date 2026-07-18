package com.logtoon.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Objects;
import java.util.TimeZone;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {

		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		System.out.println(Objects.requireNonNull(BackendApplication.class.getResource("/")).getPath());
		SpringApplication.run(BackendApplication.class, args);
	}

}
