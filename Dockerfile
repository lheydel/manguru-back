FROM node:12
WORKDIR /src

# Project dependencies
COPY package.json package.json
RUN NODE_ENV=development npm install

# Project sources
COPY . /src
RUN npm run build

# Launch
EXPOSE 8080
CMD ["npm", "start"]