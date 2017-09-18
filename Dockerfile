FROM nodesource/trusty:6.3.1

ADD package.json package.json
RUN npm install --only=dev
RUN npm install
ADD . .
RUN npm run build

EXPOSE 8081

CMD ["npm","run", "node"]
