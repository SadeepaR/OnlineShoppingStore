# Dockerfile for cart_management
FROM openjdk:17
WORKDIR /app
COPY target/cart_management-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
