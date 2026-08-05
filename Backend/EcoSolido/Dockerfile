
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

COPY src ./src
COPY .mvn ./.mvn
COPY mvnw .
COPY mvnw.cmd .

RUN mvn -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
RUN apt-get update && apt-get install -y \
    mysql-client \
    && rm -rf /var/lib/apt/lists/

ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

COPY --from=builder /app/target/*.jar /app/app.jar

RUN mkdir -p /app/uploads/products /app/uploads/backups /app/certs
# Forzar la creación de un archivo vacío en caso de que tu código lo requiera al arrancar
RUN touch /app/certs/ca.pem
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]