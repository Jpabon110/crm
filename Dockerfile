FROM node:8.15.0-alpine as build-stage
ARG REACT_APP_API_ROOT
ARG REACT_APP_CLOUDINARY_UPLOAD_URL
ARG PORT
# File Author / Maintainer
LABEL maintainer="aureolab.cl"

#Setting enviroment variables
ENV appDir /var/www/app
ENV REACT_APP_API_ROOT=${REACT_APP_API_ROOT}
ENV REACT_APP_CLOUDINARY_UPLOAD_URL=${REACT_APP_CLOUDINARY_UPLOAD_URL}
ENV PORT=${PORT}
 
#Setting work directory
WORKDIR ${appDir}

# Create app directory
RUN mkdir -p $appDir

# Install app dependencies while the images is builded
ADD package.json $appDir
#ADD yarn.lock $appDir

RUN yarn global add node-gyp
RUN yarn

# Bundle app source
ADD . $appDir

# Compilate the app
RUN yarn run build

# ANOTHER STAGE

FROM nginx:1.15.8-alpine

ADD ./nginx.conf /etc/nginx/nginx.conf
ADD ./site.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/www/html/solicitudes

RUN apk --no-cache add shadow

RUN groupadd -f -g 999 appuser && \
   useradd -r -u 999 -g appuser appuser

RUN mkdir -p /run/nginx
RUN touch /run/nginx/nginx.pid

#RUN chmod go+rwx /var/run/nginx.pid
RUN chmod -R go+rwx /var/run
RUN chmod -R go+rwx /var/cache/nginx

USER nginx

COPY --from=build-stage /var/www/app/dist/ /var/www/html/dist

# Append "daemon off;" to the beginning of the configuration
# in order to avoid an exit of the container

EXPOSE 8080

