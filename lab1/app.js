const http = require('http');

const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

let items = [
  { id: 1, name: 'Keyboard', price: 1000 },
  { id: 2, name: 'Mouse', price: 500 }
];

const server = http.createServer((req, res) => {

  if (req.method === 'GET' && req.url === '/items') {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });

    return res.end(JSON.stringify(items));
  }

  if (req.method === 'POST' && req.url === '/items') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const item = JSON.parse(body);

      item.id = Date.now();

      items.push(item);

      res.writeHead(201, {
        'Content-Type': 'application/json'
      });

      res.end(JSON.stringify(item));
    });

    return;
  }

  if (
    req.method === 'PATCH' &&
    req.url.startsWith('/items/')
  ) {
    const id = Number(
      req.url.split('/')[2]
    );

    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const updateData =
        JSON.parse(body);

      const item =
        items.find(i => i.id === id);

      if (!item) {
        res.writeHead(404);
        return res.end();
      }

      Object.assign(
        item,
        updateData
      );

      res.writeHead(200, {
        'Content-Type': 'application/json'
      });

      res.end(JSON.stringify(item));
    });

    return;
  }

  if (
    req.method === 'DELETE' &&
    req.url.startsWith('/items/')
  ) {
    const id = Number(
      req.url.split('/')[2]
    );

    items = items.filter(
      i => i.id !== id
    );

    res.writeHead(204);
    return res.end();
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, HOSTNAME, () => {
  console.log(
    `Server running at http://${HOSTNAME}:${PORT}`
  );
});