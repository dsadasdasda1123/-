package com.example.autoentity.util;

import org.apache.commons.lang3.StringUtils;

public final class NamingUtils {

    private NamingUtils() {
    }

    public static String toClassName(String name) {
        return toCamelCase(name, true);
    }

    public static String toFieldName(String name) {
        return toCamelCase(name, false);
    }

    private static String toCamelCase(String source, boolean capitalizeFirst) {
        if (StringUtils.isBlank(source)) {
            return source;
        }
        String[] parts = source.toLowerCase().split("[_\\s-]+");
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < parts.length; i++) {
            String part = parts[i];
            if (part.isEmpty()) {
                continue;
            }
            if (i == 0 && !capitalizeFirst) {
                result.append(part);
            } else {
                result.append(Character.toUpperCase(part.charAt(0))).append(part.substring(1));
            }
        }
        return result.toString();
    }
}
