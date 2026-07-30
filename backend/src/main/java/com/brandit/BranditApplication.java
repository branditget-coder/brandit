package com.brandit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BranditApplication {
    public static void main(String[] args) {
        SpringApplication.run(BranditApplication.class, args);
    }
}
