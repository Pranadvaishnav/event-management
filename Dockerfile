FROM node

COPY package.json /app/package.json
COPY public /app/public
COPY server.js /app/server.js
COPY models /app/models/
COPY data /app/data/
COPY .vscode /app/.vscode/

WORKDIR /app

RUN npm install

EXPOSE 4242

CMD ["node", "server.js"]