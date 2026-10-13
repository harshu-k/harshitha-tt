FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /build
COPY backend/pom.xml .
RUN mvn -B dependency:go-offline

COPY backend/src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app
ENV APP_DATA_DIR=/app/data \
    APP_UPLOAD_DIR=/app/uploads
RUN mkdir -p /app/data /app/uploads

COPY --from=build /build/target/ssims-backend-1.0.0.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
