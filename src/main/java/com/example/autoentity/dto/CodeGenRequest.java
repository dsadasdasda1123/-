package com.example.autoentity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CodeGenRequest {

    @NotNull
    private DatabaseType databaseType;

    @NotBlank
    private String jdbcUrl;

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    private String schema;

    @NotEmpty
    private List<String> tables;

    @NotBlank
    private String basePackage;

    @NotBlank
    private String outputDir;

    @NotNull
    private GenerationMode generationMode = GenerationMode.JPA;
}
