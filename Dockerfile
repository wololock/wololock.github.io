FROM node:8-slim

RUN apt-get update && apt-get install -y libpng-dev

RUN npm --version
RUN npm install hexo-cli -g

VOLUME /blog
WORKDIR /blog

EXPOSE 4000

COPY entrypoint.sh /root/
RUN chmod +x /root/entrypoint.sh

ENTRYPOINT ["/root/entrypoint.sh"]