package com.example.autoentity.metadata;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ColumnMeta {
    private String columnName;
    private String fieldName;
    private String dbType;
    private String javaType;
    private String remarks;
    private boolean primaryKey;
    private boolean nullable;
}
