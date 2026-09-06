package com.aibudgetguardian;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AIBudgetGuardianApplication {

    public static void main(String[] args) {
        SpringApplication.run(AIBudgetGuardianApplication.class, args);
    }
}
