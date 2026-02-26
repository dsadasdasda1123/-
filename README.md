# Auto-Entity Generator (Spring Boot)

Auto-Entity Generator 是一个基于 Spring Boot 的代码生成工具。通过配置数据库连接与目标表名，即可自动提取元数据并生成常见分层代码。

## 功能特性

- 支持数据库：MySQL / PostgreSQL / Oracle
- 自动提取字段信息：字段名、类型、主键、可空、注释
- 数据类型自动映射：如 `VARCHAR -> String`、`DATETIME -> LocalDateTime`
- 模板化生成：
  - Entity（支持 JPA 或 MyBatis-Plus 注解）
  - Repository / Mapper
  - Service
  - ServiceImpl
  - Controller
  - Mapper XML（MyBatis 模式）
- 内置 Lombok 注解：`@Data`、`@NoArgsConstructor`、`@AllArgsConstructor`

## 快速启动

```bash
mvn spring-boot:run
```

默认启动端口：`8080`

## 接口说明

- URL: `POST /api/generator/generate`
- Body 示例：

```json
{
  "databaseType": "MYSQL",
  "jdbcUrl": "jdbc:mysql://127.0.0.1:3306/demo",
  "username": "root",
  "password": "root",
  "schema": "demo",
  "tables": ["user_account"],
  "basePackage": "com.example.generated",
  "outputDir": "./generated-src",
  "generationMode": "JPA"
}
```

返回值包含生成文件的绝对路径列表。

## 项目结构

- `metadata`: 数据库元数据提取
- `generator`: 代码模板渲染
- `service`: 生成流程编排与文件写出
- `controller`: 对外 REST API

当 `generationMode=MYBATIS_PLUS` 时，会使用 MyBatis-Plus 继承体系：`Mapper extends BaseMapper`、`Service extends IService`、`ServiceImpl extends ServiceImpl`，并额外生成 `resources/mapper/*Mapper.xml`。
- `util`: 命名转换与类型映射

## 后续可扩展方向

- 支持自定义模板（如 Freemarker/Velocity）
- ServiceImpl 自动生成
- 支持复合主键类型推断
- 生成 ZIP 下载包
