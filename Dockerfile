FROM nginx:1.27-alpine

COPY index.html /usr/share/nginx/html/index.html
COPY app/ /usr/share/nginx/html/app/

EXPOSE 80
