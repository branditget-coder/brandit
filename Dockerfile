# Stage 1: Build application with Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml first and pre-fetch dependencies for Docker layer caching
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B

# Copy full backend source and build application executable JAR
COPY backend/ ./
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy compiled jar from build stage
COPY --from=build /app/target/brandit-backend-1.0.0.jar app.jar

# Expose port (dynamic on Railway)
EXPOSE 8080

# Environment defaults
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

# Launch Spring Boot application
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
