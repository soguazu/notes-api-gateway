# syntax=docker/dockerfile:1.5.2

FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package.json ./
COPY .babelrc ./
RUN npm install
COPY . .
RUN npm run build
# Build Stage 2
# This build takes the production build from staging build
#
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json ./
COPY .babelrc ./
RUN npm install
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 30001
CMD npm run start