FROM node:11
WORKDIR /src

# Build tools
RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y python
RUN npm install -g node-gyp

# Project dependencies
COPY package.json package.json
RUN NODE_ENV=development npm install
RUN npm install bcrypt

# Project sources
COPY . /src
RUN npm run build

# Launch
EXPOSE 8080
CMD ["npm", "start"]