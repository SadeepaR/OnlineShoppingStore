FROM openjdk:17-jdk-slim

VOLUME /tmp

COPY target/discovery_server-0.0.1-SNAPSHOT.jar discovery_server.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "/discovery_server.jar"]
