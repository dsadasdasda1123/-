package com.example.autoentity.controller;

import com.example.autoentity.dto.CodeGenRequest;
import com.example.autoentity.dto.CodeGenResponse;
import com.example.autoentity.service.CodeGenerationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/generator")
public class CodeGenerationController {

    private final CodeGenerationService codeGenerationService;

    public CodeGenerationController(CodeGenerationService codeGenerationService) {
        this.codeGenerationService = codeGenerationService;
    }

    @PostMapping("/generate")
    public ResponseEntity<CodeGenResponse> generate(@Valid @RequestBody CodeGenRequest request) throws Exception {
        return ResponseEntity.ok(codeGenerationService.generate(request));
    }
}
