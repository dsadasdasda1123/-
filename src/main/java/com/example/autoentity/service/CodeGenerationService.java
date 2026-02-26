package com.example.autoentity.service;

import com.example.autoentity.dto.CodeGenRequest;
import com.example.autoentity.dto.CodeGenResponse;
import com.example.autoentity.generator.CodeTemplateRenderer;
import com.example.autoentity.metadata.DatabaseMetadataExtractor;
import com.example.autoentity.metadata.TableMeta;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Service
public class CodeGenerationService {

    private final DatabaseMetadataExtractor extractor;
    private final CodeTemplateRenderer renderer;

    public CodeGenerationService(DatabaseMetadataExtractor extractor, CodeTemplateRenderer renderer) {
        this.extractor = extractor;
        this.renderer = renderer;
    }

    public CodeGenResponse generate(CodeGenRequest request) throws Exception {
        List<TableMeta> tableMetaList = extractor.extract(request);
        List<String> generated = new ArrayList<>();

        Path outputRoot = java.nio.file.Paths.get(request.getOutputDir());
        String packagePath = request.getBasePackage().replace('.', '/');

        for (TableMeta tableMeta : tableMetaList) {
            generated.add(write(outputRoot.resolve(packagePath).resolve("entity").resolve(tableMeta.getClassName() + ".java"),
                    renderer.renderEntity(request.getBasePackage(), tableMeta, request.getGenerationMode())));

            String repositoryFolder = request.getGenerationMode().name().equals("JPA") ? "repository" : "mapper";
            String repositorySuffix = request.getGenerationMode().name().equals("JPA") ? "Repository" : "Mapper";
            generated.add(write(outputRoot.resolve(packagePath).resolve(repositoryFolder)
                            .resolve(tableMeta.getClassName() + repositorySuffix + ".java"),
                    renderer.renderRepository(request.getBasePackage(), tableMeta, request.getGenerationMode())));

            generated.add(write(outputRoot.resolve(packagePath).resolve("service").resolve(tableMeta.getClassName() + "Service.java"),
                    renderer.renderService(request.getBasePackage(), tableMeta, request.getGenerationMode())));

            generated.add(write(outputRoot.resolve(packagePath).resolve("service").resolve("impl")
                            .resolve(tableMeta.getClassName() + "ServiceImpl.java"),
                    renderer.renderServiceImpl(request.getBasePackage(), tableMeta, request.getGenerationMode())));

            if (request.getGenerationMode().name().equals("MYBATIS_PLUS")) {
                generated.add(write(outputRoot.resolve("resources").resolve("mapper")
                                .resolve(tableMeta.getClassName() + "Mapper.xml"),
                        renderer.renderMapperXml(request.getBasePackage(), tableMeta)));
            }

            generated.add(write(outputRoot.resolve(packagePath).resolve("controller").resolve(tableMeta.getClassName() + "Controller.java"),
                    renderer.renderController(request.getBasePackage(), tableMeta, request.getGenerationMode())));
        }

        return CodeGenResponse.builder()
                .generatedFiles(generated)
                .message("Code generated successfully")
                .build();
    }

    private String write(Path path, String content) throws IOException {
        Files.createDirectories(path.getParent());
        Files.write(path, content.getBytes(StandardCharsets.UTF_8));
        return path.toAbsolutePath().toString();
    }
}
