/* KUKULCÁN PRO MAX - CORE ENGINE 
   Fusión: Kukulcán + Chaac + Águila 
*/
const express = require('express');
const { Server } = require('socket.io');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database('./kukulcan.sqlite');

// Configuración de carpetas para el ejecutable
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Registro de pedidos con estética Águila
app.post('/api/pedidos', (req, res) => {
  const { cliente, items, total, tipo } = req.body;
  const stmt = db.prepare('INSERT INTO pedidos (cliente, total, tipo, estado) VALUES (?, ?, ?, ?)');
  const info = stmt.run(cliente, total, tipo, 'pendiente');
  
  // Notificación en tiempo real a Cocina (Chaac)
  io.emit('nuevo_pedido', { id: info.lastInsertRowid, cliente, items, total });
  res.json({ ok: true, folio: info.lastInsertRowid });
});

const server = app.listen(3000, () => console.log("☀️ El Quinto Sol ha despertado en el puerto 3000"));
const io = new Server(server);
