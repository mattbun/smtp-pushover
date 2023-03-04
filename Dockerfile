ARG NODE_VERSION=16.19.1
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

COPY tsconfig.json .
COPY src src
RUN yarn build && yarn install --production --frozen-lockfile

FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app
COPY --from=build /app/node_modules/ node_modules/
COPY --from=build /app/dist dist

ENTRYPOINT [ "node", "dist/index.js" ]
