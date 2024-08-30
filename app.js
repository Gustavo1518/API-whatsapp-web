const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode'); // Librería para generar el QR en formato base64
const app = express();
const port = 4000;

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "cliente-predeterminado" // Puedes usar diferentes IDs para múltiples sesiones
  }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

let qrCodeData = ''; // Variable para almacenar el QR en formato base64

client.on('qr', (qr) => {
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error('Error al generar el QR:', err);
      return;
    }
    qrCodeData = url; // Guardar el QR en formato base64
  });
});

client.on('ready', async () => {
  console.log('Cliente está listo');
  data = await client.getNumberId('5215624562120');
  console.log(data);
});

client.initialize();

app.get('/whatsap/:numero', async (req, res) => {
  let numero = req.params.numero;
  console.log(numero);
  try {
    data = await client.getNumberId(`521${numero}`);
    if (data === null) return res.json({ status: 200, numberExist: false });
    
    return res.json({ status: 200, numberExist: true, user: data.user, server: data.server, _serialized: data._serialized });
  } catch (error) {
    return res.json({ status: 503, message: 'Error' });
  }
});

// Ruta para mostrar el código QR en el navegador
app.get('/qr', (req, res) => {
  if (qrCodeData) {
    res.send(`
      <h1>Escanea el código QR con tu aplicación de WhatsApp</h1>
      <img src="${qrCodeData}" alt="QR Code"/>
    `);
  } else {
    res.send('<h1>El código QR aún no está disponible. Inténtalo de nuevo más tarde.</h1>');
  }
});

app.listen(port, () => {
  console.log('Servidor corriendo correctamente en el puerto', port);
});
