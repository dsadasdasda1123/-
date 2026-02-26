package com.example.autoentity.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
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
