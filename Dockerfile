FROM ubuntu:18.04

RUN apt-get update && apt-get upgrade -y && apt-get install -y build-essential python-dev gcc g++ git libpq-dev make \
    python-pip python2.7 python2.7-dev libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf2.0-0 libffi-dev shared-mime-info \
    libxml2-dev libxslt-dev libssl-dev libpng-dev curl autoconf curl iputils-ping

RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install -y nodejs

RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install yarn

# Employing the layer caching strategy
WORKDIR /app

ADD package.json .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]

