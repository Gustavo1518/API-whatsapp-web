const { Client,LocalAuth } = require('whatsapp-web.js');
const express = require('express')
const app = express()
const port = 4000
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth({
      clientId: "cliente-predeterminado" // Puedes usar diferentes IDs para múltiples sesiones
  })
});

app.get('/whatsap/:numero', async (req, res) => {
    let numero = req.params.numero;
    console.log(numero)
    try {
      data = await client.getNumberId(`521${numero}`)
      if(data === null) return res.json({status: 200 ,numberExist: false})
      
      return res.json({status: 200,numberExist: true, user: data.user, server: data.server, _serialized: data._serialized})
    } catch (error) {
      return res.json({status: 503, message: 'Error'})
    }
  
  })


client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    data = await client.getNumberId('5215624562120')
    console.log(data)
});


client.initialize();

app.listen(port, () => {
    console.log('Servido correctamente')
})