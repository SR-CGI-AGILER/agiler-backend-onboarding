FROM node:carbon

WORKDIR /random

COPY . /random

RUN npm install

# CMD ["EXPORT", "NODE_ENV=dev"]

# CMD ["echo", "$NODE_ENV"]

# CMD ["echo", "Hello World"]

ENV NODE_ENV=dev

CMD ["npm", "start"]