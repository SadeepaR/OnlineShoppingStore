FROM openjdk:17
WORKDIR /app
COPY target/order_management-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8083
# Use the ENTRYPOINT instruction to specify the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
