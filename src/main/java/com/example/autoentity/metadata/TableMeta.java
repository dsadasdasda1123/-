package com.example.autoentity.metadata;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TableMeta {
    private String tableName;
    private String className;
    private String remarks;
    private List<ColumnMeta> columns;
}
