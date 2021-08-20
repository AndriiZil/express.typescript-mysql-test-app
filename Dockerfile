FROM node:14-alpine as stage

WORKDIR /app

COPY src ./src
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
RUN npm run build

FROM node:14-alpine

WORKDIR /app

COPY --from=stage /app/node_modules ./node_modules
COPY --from=stage /app/dist ./dist
COPY --from=stage /app/package.json ./

EXPOSE 3000

CMD ["npm", "run", "start"]
