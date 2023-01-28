FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production


# Bundle app source
COPY . .

ARG BUILD_MODE=development
# build with webpack
RUN npx webpack build --config ./webpack.config.js --mode $BUILD_MODE


EXPOSE 3000
CMD [ "node", "server/server.js" ]