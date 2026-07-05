FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

ARG GRADLE_VERSION=8.12
RUN apk add --no-cache wget unzip \
    && wget -q https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -O /tmp/gradle.zip \
    && unzip -q /tmp/gradle.zip -d /opt \
    && mv /opt/gradle-${GRADLE_VERSION} /opt/gradle \
    && rm /tmp/gradle.zip
ENV PATH="/opt/gradle/bin:${PATH}"

COPY build.gradle.kts settings.gradle.kts ./
RUN gradle dependencies --no-daemon -q
COPY src ./src
RUN gradle bootJar --no-daemon -x test -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]