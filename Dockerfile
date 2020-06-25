FROM node

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production


# Bundle app source
COPY . .


# build to javascript
RUN npm run build
# copy over the ormconfig
COPY ormconfig.json ./dist

WORKDIR ./dist

RUN ls

EXPOSE 4000

CMD NODE_ENV=production node index.js 
