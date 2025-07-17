# Dockerfile for product_management
FROM openjdk:17
WORKDIR /app
COPY target/product_management-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
