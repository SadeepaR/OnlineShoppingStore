FROM openjdk:17
WORKDIR /app
COPY target/email_management-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
