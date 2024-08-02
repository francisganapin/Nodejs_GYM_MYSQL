import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import mysql from 'mysql2/promise';

const mimeTypes = {
  '.html': 'public',
  '.js': 'public',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const server = createServer(async (req, res) => {
  // show all available data in your data base
  // Database query handling
  if (req.url === '/post/customers') {
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'memberdb',
      });

      const [rows] = await connection.query('SELECT * FROM gym_members');
      await connection.end();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: rows }));
    } catch (error) {
      console.error('Error connecting to the database:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Error connecting to the database' }));
    }
    return;
  }

  // Insert new member into the database
  if (req.url === '/get/customers' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const { id, expiry, membership, firstName, lastName, phoneNumber, address } = JSON.parse(body);

      try {
        const connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: 'root',
          database: 'memberdb',
        });

        const sql = 'INSERT INTO gym_members (ID_CARD  , Expiry, Membership, First_Name, Last_Name, Phone_Number, Address) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [id, expiry, membership, firstName, lastName, phoneNumber, address];

        await connection.query(sql, values);
        await connection.end();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Member registered successfully.' }));
      } catch (error) {
        console.error('Error inserting data:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'An error occurred while registering the member.' }));
      }
    });
    return;
  }

  // File serving
  try {
    let filePath;

    if (req.url === '/' || req.url === '/homepage' || req.url === '/homepage.html') {
      filePath = join(process.cwd(),'public', 'homepage.html');
    } else if (req.url === '/login_member') {
      filePath = join(process.cwd(), 'public','login_member.html');
    } else if (req.url === '/add_member') {
      filePath = join(process.cwd(),'public', 'add_member.html');
    } else if (req.url === '/debug') {
      filePath = join(process.cwd(),'public', 'debug.html');
    } else {
      // For other requests, try to serve static files
      filePath = join(process.cwd(), req.url);
    }

    console.log(`Serving file: ${filePath}`);
    const content = await readFile(filePath);
    const ext = extname(filePath);
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(content);
  } catch (error) {
    console.error(`Error serving file: ${error}`);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on \x1b[34mhttp://127.0.0.1:3000/homepage\x1b[0m');
});