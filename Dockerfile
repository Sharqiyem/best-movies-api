FROM  node:16.18.0 as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["node", "dist/main"]

# comands
# docker build -t best-api .
# docker run best-api
