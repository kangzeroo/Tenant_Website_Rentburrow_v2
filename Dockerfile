FROM nodesource/trusty:6.3.1

ADD package.json package.json
RUN npm install
ADD . .

EXPOSE 8081

CMD ["npm","run", "node"]
