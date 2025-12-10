# first tell base image to docker file (runtime that you work)
FROM node:18.14.1
LABEL authors="ttknpde-v"

# default should set like below
WORKDIR /usr/src/app

# copy package.json file to /usr/src/app
COPY package.json ./

# skip npm init because I did
RUN npm install

# copy all file/folder than put to /usr/src/app
COPY . .

# set port inside container
EXPOSE 8000

# Now I have to do is to tell Docker what command I want to run when our image is run inside of a container.
#
CMD [ "npm", "start" ]