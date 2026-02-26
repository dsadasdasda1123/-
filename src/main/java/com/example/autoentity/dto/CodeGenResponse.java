package com.example.autoentity.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CodeGenResponse {
    private List<String> generatedFiles;
    private String message;
}
