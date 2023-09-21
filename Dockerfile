# FROM node:18

# WORKDIR /app/
# COPY package*.json ./
# RUN npm install
# RUN npm install -g @angular/cli
# COPY . .
# EXPOSE 4200
# CMD ["ng", "serve", "--host", "0.0.0.0"]

# ----------------------------
# build from source
# ----------------------------
FROM node:18 AS build

WORKDIR /app/

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

# ----------------------------
# run with nginx
# ----------------------------
FROM nginx

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
COPY --from=build /app/dist/todo-front-end /usr/share/nginx/html

EXPOSE 80