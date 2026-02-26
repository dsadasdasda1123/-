package com.example.autoentity.util;

import java.util.Locale;

public final class JavaTypeMapper {

    private JavaTypeMapper() {
    }

    public static String map(String dbType) {
        if (dbType == null) {
            return "String";
        }

        String normalized = dbType.toUpperCase(Locale.ROOT);
        if (normalized.contains("CHAR") || normalized.contains("TEXT") || normalized.contains("CLOB") || normalized.contains("JSON")) {
            return "String";
        }
        if (normalized.contains("BIGINT")) {
            return "Long";
        }
        if (normalized.contains("INT") || normalized.contains("NUMBER") || normalized.contains("SERIAL")) {
            return "Integer";
        }
        if (normalized.contains("DECIMAL") || normalized.contains("NUMERIC")) {
            return "java.math.BigDecimal";
        }
        if (normalized.contains("DOUBLE") || normalized.contains("FLOAT")) {
            return "Double";
        }
        if (normalized.contains("BOOL") || normalized.equals("BIT")) {
            return "Boolean";
        }
        if (normalized.contains("TIMESTAMP") || normalized.contains("DATETIME")) {
            return "java.time.LocalDateTime";
        }
        if (normalized.equals("DATE")) {
            return "java.time.LocalDate";
        }
        if (normalized.contains("TIME")) {
            return "java.time.LocalTime";
        }
        if (normalized.contains("BINARY") || normalized.contains("BLOB")) {
            return "byte[]";
        }
        return "String";
    }
}
