# 빌드 단계
FROM node:24-alpine AS builder
WORKDIR /app
ARG VITE_MEMBER_ONE_USERNAME
ENV VITE_MEMBER_ONE_USERNAME=$VITE_MEMBER_ONE_USERNAME
ARG VITE_ROUTER_MODE
ENV VITE_ROUTER_MODE=$VITE_ROUTER_MODE
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 서빙 단계 (Nginx)
FROM nginx:alpine
# 빌드된 결과물만 복사
COPY --from=builder /app/dist /usr/share/nginx/html
# Nginx 설정파일 복사 (아래 3번 참고)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80