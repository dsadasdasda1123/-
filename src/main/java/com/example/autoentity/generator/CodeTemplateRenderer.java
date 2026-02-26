package com.example.autoentity.generator;

import com.example.autoentity.dto.GenerationMode;
import com.example.autoentity.metadata.ColumnMeta;
import com.example.autoentity.metadata.TableMeta;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CodeTemplateRenderer {

    public String renderEntity(String basePackage, TableMeta tableMeta, GenerationMode mode) {
        StringBuilder sb = new StringBuilder();
        sb.append("package ").append(basePackage).append(".entity;\n\n");

        sb.append("import lombok.Data;\n");
        sb.append("import lombok.NoArgsConstructor;\n");
        sb.append("import lombok.AllArgsConstructor;\n");

        appendTypeImports(sb, tableMeta.getColumns());

        if (mode == GenerationMode.JPA) {
            sb.append("import javax.persistence.*;\n");
        } else {
            sb.append("import com.baomidou.mybatisplus.annotation.*;\n");
        }

        sb.append("\n@Data\n@NoArgsConstructor\n@AllArgsConstructor\n");

        if (mode == GenerationMode.JPA) {
            sb.append("@Entity\n@Table(name = \"").append(tableMeta.getTableName()).append("\")\n");
        } else {
            sb.append("@TableName(\"").append(tableMeta.getTableName()).append("\")\n");
        }

        sb.append("public class ").append(tableMeta.getClassName()).append(" {\n\n");

        for (ColumnMeta column : tableMeta.getColumns()) {
            if (column.isPrimaryKey()) {
                sb.append(mode == GenerationMode.JPA ? "    @Id\n" : "    @TableId\n");
            }

            if (mode == GenerationMode.JPA) {
                sb.append("    @Column(name = \"").append(column.getColumnName()).append("\")\n");
            } else {
                sb.append("    @TableField(\"").append(column.getColumnName()).append("\")\n");
            }

            if (column.getRemarks() != null && !column.getRemarks().isBlank()) {
                sb.append("    /** ").append(column.getRemarks()).append(" */\n");
            }
            sb.append("    private ").append(simpleType(column.getJavaType())).append(" ").append(column.getFieldName()).append(";\n\n");
        }

        sb.append("}\n");
        return sb.toString();
    }

    public String renderRepository(String basePackage, TableMeta tableMeta, GenerationMode mode) {
        if (mode == GenerationMode.JPA) {
            return "package " + basePackage + ".repository;\n\n" +
                    "import " + basePackage + ".entity." + tableMeta.getClassName() + ";\n" +
                    "import org.springframework.data.jpa.repository.JpaRepository;\n" +
                    "import org.springframework.stereotype.Repository;\n\n" +
                    "@Repository\n" +
                    "public interface " + tableMeta.getClassName() + "Repository extends JpaRepository<" + tableMeta.getClassName() + ", Long> {\n" +
                    "}\n";
        }
        return "package " + basePackage + ".mapper;\n\n" +
                "import " + basePackage + ".entity." + tableMeta.getClassName() + ";\n" +
                "import com.baomidou.mybatisplus.core.mapper.BaseMapper;\n" +
                "import org.apache.ibatis.annotations.Mapper;\n" +
                "\n@Mapper\n" +
                "public interface " + tableMeta.getClassName() + "Mapper extends BaseMapper<" + tableMeta.getClassName() + "> {\n" +
                "}\n";
    }

    public String renderService(String basePackage, TableMeta tableMeta, GenerationMode mode) {
        if (mode == GenerationMode.MYBATIS_PLUS) {
            return "package " + basePackage + ".service;\n\n" +
                    "import " + basePackage + ".entity." + tableMeta.getClassName() + ";\n" +
                    "import com.baomidou.mybatisplus.extension.service.IService;\n\n" +
                    "public interface " + tableMeta.getClassName() + "Service extends IService<" + tableMeta.getClassName() + "> {\n" +
                    "}\n";
        }

        return "package " + basePackage + ".service;\n\n" +
                "import " + basePackage + ".entity." + tableMeta.getClassName() + ";\n" +
                "import java.util.List;\n\n" +
                "public interface " + tableMeta.getClassName() + "Service {\n" +
                "    " + tableMeta.getClassName() + " save(" + tableMeta.getClassName() + " entity);\n" +
                "    List<" + tableMeta.getClassName() + "> findAll();\n" +
                "}\n";
    }

    public String renderServiceImpl(String basePackage, TableMeta tableMeta, GenerationMode mode) {
        String className = tableMeta.getClassName();
        if (mode == GenerationMode.JPA) {
            return "package " + basePackage + ".service.impl;\n\n" +
                    "import " + basePackage + ".entity." + className + ";\n" +
                    "import " + basePackage + ".repository." + className + "Repository;\n" +
                    "import " + basePackage + ".service." + className + "Service;\n" +
                    "import org.springframework.stereotype.Service;\n" +
                    "import java.util.List;\n\n" +
                    "@Service\n" +
                    "public class " + className + "ServiceImpl implements " + className + "Service {\n\n" +
                    "    private final " + className + "Repository repository;\n\n" +
                    "    public " + className + "ServiceImpl(" + className + "Repository repository) {\n" +
                    "        this.repository = repository;\n" +
                    "    }\n\n" +
                    "    @Override\n" +
                    "    public " + className + " save(" + className + " entity) {\n" +
                    "        return repository.save(entity);\n" +
                    "    }\n\n" +
                    "    @Override\n" +
                    "    public List<" + className + "> findAll() {\n" +
                    "        return repository.findAll();\n" +
                    "    }\n" +
                    "}\n";
        }

        return "package " + basePackage + ".service.impl;\n\n" +
                "import " + basePackage + ".entity." + className + ";\n" +
                "import " + basePackage + ".mapper." + className + "Mapper;\n" +
                "import " + basePackage + ".service." + className + "Service;\n" +
                "import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;\n" +
                "import org.springframework.stereotype.Service;\n\n" +
                "@Service\n" +
                "public class " + className + "ServiceImpl extends ServiceImpl<" + className + "Mapper, " + className + "> implements " + className + "Service {\n" +
                "}\n";
    }

    public String renderMapperXml(String basePackage, TableMeta tableMeta) {
        String entityClass = basePackage + ".entity." + tableMeta.getClassName();
        String mapperClass = basePackage + ".mapper." + tableMeta.getClassName() + "Mapper";

        StringBuilder columns = new StringBuilder();
        StringBuilder values = new StringBuilder();
        StringBuilder resultMap = new StringBuilder();
        for (int i = 0; i < tableMeta.getColumns().size(); i++) {
            ColumnMeta c = tableMeta.getColumns().get(i);
            if (i > 0) {
                columns.append(", ");
                values.append(", ");
            }
            columns.append(c.getColumnName());
            values.append("#{").append(c.getFieldName()).append("}");
            String tag = c.isPrimaryKey() ? "id" : "result";
            resultMap.append("    <").append(tag).append(" column=\"").append(c.getColumnName())
                    .append("\" property=\"").append(c.getFieldName()).append("\"/>\n");
        }

        return "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n" +
                "<!DOCTYPE mapper PUBLIC \"-//mybatis.org//DTD Mapper 3.0//EN\" \"http://mybatis.org/dtd/mybatis-3-mapper.dtd\">\n" +
                "<mapper namespace=\"" + mapperClass + "\">\n\n" +
                "  <resultMap id=\"BaseResultMap\" type=\"" + entityClass + "\">\n" +
                resultMap +
                "  </resultMap>\n\n" +
                "  <insert id=\"insert\" parameterType=\"" + entityClass + "\">\n" +
                "    INSERT INTO " + tableMeta.getTableName() + " (" + columns + ")\n" +
                "    VALUES (" + values + ")\n" +
                "  </insert>\n\n" +
                "  <select id=\"findAll\" resultMap=\"BaseResultMap\">\n" +
                "    SELECT " + columns + " FROM " + tableMeta.getTableName() + "\n" +
                "  </select>\n\n" +
                "</mapper>\n";
    }

    public String renderController(String basePackage, TableMeta tableMeta, GenerationMode mode) {
        String varName = Character.toLowerCase(tableMeta.getClassName().charAt(0)) + tableMeta.getClassName().substring(1);
        if (mode == GenerationMode.MYBATIS_PLUS) {
            return "package " + basePackage + ".controller;\n\n" +
                    "import " + basePackage + ".entity." + tableMeta.getClassName() + ";\n" +
                    "import " + basePackage + ".service." + tableMeta.getClassName() + "Service;\n" +
                    "import org.springframework.web.bind.annotation.*;\n" +
                    "import java.util.List;\n\n" +
                    "@RestController\n" +
                    "@RequestMapping(\"/api/" + varName + "\")\n" +
                    "public class " + tableMeta.getClassName() + "Controller {\n\n" +
                    "    private final " + tableMeta.getClassName() + "Service service;\n\n" +
                    "    public " + tableMeta.getClassName() + "Controller(" + tableMeta.getClassName() + "Service service) {\n" +
                    "        this.service = service;\n" +
                    "    }\n\n" +
                    "    @PostMapping\n" +
                    "    public " + tableMeta.getClassName() + " create(@RequestBody " + tableMeta.getClassName() + " " + varName + ") {\n" +
                    "        service.save(" + varName + ");\n" +
                    "        return " + varName + ";\n" +
                    "    }\n\n" +
                    "    @GetMapping\n" +
                    "    public List<" + tableMeta.getClassName() + "> list() {\n" +
                    "        return service.list();\n" +
                    "    }\n" +
                    "}\n";
        }

        return "package " + basePackage + ".controller;\n\n" +
                "import " + basePackage + ".entity." + tableMeta.getClassName() + ";\n" +
                "import " + basePackage + ".service." + tableMeta.getClassName() + "Service;\n" +
                "import org.springframework.web.bind.annotation.*;\n" +
                "import java.util.List;\n\n" +
                "@RestController\n" +
                "@RequestMapping(\"/api/" + varName + "\")\n" +
                "public class " + tableMeta.getClassName() + "Controller {\n\n" +
                "    private final " + tableMeta.getClassName() + "Service service;\n\n" +
                "    public " + tableMeta.getClassName() + "Controller(" + tableMeta.getClassName() + "Service service) {\n" +
                "        this.service = service;\n" +
                "    }\n\n" +
                "    @PostMapping\n" +
                "    public " + tableMeta.getClassName() + " create(@RequestBody " + tableMeta.getClassName() + " " + varName + ") {\n" +
                "        return service.save(" + varName + ");\n" +
                "    }\n\n" +
                "    @GetMapping\n" +
                "    public List<" + tableMeta.getClassName() + "> list() {\n" +
                "        return service.findAll();\n" +
                "    }\n" +
                "}\n";
    }

    private void appendTypeImports(StringBuilder sb, List<ColumnMeta> columns) {
        List<String> imports = columns.stream()
                .map(ColumnMeta::getJavaType)
                .filter(type -> type.contains("."))
                .distinct()
                .sorted()
                .collect(java.util.stream.Collectors.toList());

        for (String i : imports) {
            sb.append("import ").append(i).append(";\n");
        }
    }

    private String simpleType(String type) {
        if (!type.contains(".")) {
            return type;
        }
        return type.substring(type.lastIndexOf('.') + 1);
    }
}
