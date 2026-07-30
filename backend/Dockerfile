# Stage 1: Build application with Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy files
COPY . ./

# Package application JAR skipping tests
RUN if [ -f "pom.xml" ]; then mvn clean package -DskipTests; else cd backend && mvn clean package -DskipTests; fi

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
