package com.example.autoentity.metadata;

import com.example.autoentity.dto.CodeGenRequest;
import com.example.autoentity.util.JavaTypeMapper;
import com.example.autoentity.util.NamingUtils;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DatabaseMetadataExtractor {

    public List<TableMeta> extract(CodeGenRequest request) throws SQLException {
        List<TableMeta> tables = new ArrayList<>();

        try (Connection connection = DriverManager.getConnection(request.getJdbcUrl(), request.getUsername(), request.getPassword())) {
            DatabaseMetaData metaData = connection.getMetaData();
            String schema = request.getSchema();

            for (String tableName : request.getTables()) {
                Set<String> primaryKeys = extractPrimaryKeys(metaData, schema, tableName);
                List<ColumnMeta> columns = extractColumns(metaData, schema, tableName, primaryKeys);

                tables.add(TableMeta.builder()
                        .tableName(tableName)
                        .className(NamingUtils.toClassName(tableName))
                        .remarks(extractTableRemark(metaData, schema, tableName))
                        .columns(columns)
                        .build());
            }
        }

        return tables;
    }

    private Set<String> extractPrimaryKeys(DatabaseMetaData metaData, String schema, String tableName) throws SQLException {
        Set<String> keys = new HashSet<>();
        try (ResultSet rs = metaData.getPrimaryKeys(null, schema, tableName)) {
            while (rs.next()) {
                keys.add(rs.getString("COLUMN_NAME"));
            }
        }
        return keys;
    }

    private List<ColumnMeta> extractColumns(DatabaseMetaData metaData,
                                            String schema,
                                            String tableName,
                                            Set<String> primaryKeys) throws SQLException {
        List<ColumnMeta> columns = new ArrayList<>();
        try (ResultSet rs = metaData.getColumns(null, schema, tableName, "%")) {
            while (rs.next()) {
                String columnName = rs.getString("COLUMN_NAME");
                String dbType = rs.getString("TYPE_NAME");

                columns.add(ColumnMeta.builder()
                        .columnName(columnName)
                        .fieldName(NamingUtils.toFieldName(columnName))
                        .dbType(dbType)
                        .javaType(JavaTypeMapper.map(dbType))
                        .remarks(rs.getString("REMARKS"))
                        .nullable(rs.getInt("NULLABLE") == DatabaseMetaData.columnNullable)
                        .primaryKey(primaryKeys.contains(columnName))
                        .build());
            }
        }
        return columns;
    }

    private String extractTableRemark(DatabaseMetaData metaData, String schema, String tableName) throws SQLException {
        try (ResultSet rs = metaData.getTables(null, schema, tableName, new String[]{"TABLE"})) {
            if (rs.next()) {
                return rs.getString("REMARKS");
            }
        }
        return "";
    }
}
