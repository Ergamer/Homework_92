const express = require('express');
const cors = require('cors');
const app = express();
const expressWs = require('express-ws')(app);


const port = 8000;


app.use(cors());
const clients = {};
let canvas = [];

app.ws('/picture', (ws, req) => {
    const id = req.get('sec-websocket-key');
    clients[id] = ws;

    ws.send(JSON.stringify({
        type: 'NEW_PICTURE',
        array: canvas
    }));

    ws.on('message', (msg) => {

        let pixels = JSON.parse(msg);
        console.log(JSON.parse(msg));

        try {

        } catch (e) {
            return ws.send(JSON.stringify({
                type: 'ERROR',
                message: 'Message is not JSON'
            }));
        }

        switch (pixels.type) {
            case 'CREATE_PICTURE':
                console.log(pixels)
                canvas = canvas.concat(pixels.drawPoints);
                Object.values(clients).forEach(client => {
                    client.send(JSON.stringify({
                        type: 'NEW_PICTURE',
                        array: canvas
                    }));
                });
                break;
            default:
                return ws.send(JSON.stringify({
                    type: 'ERROR',
                    message: 'Unknown message type'
                }));
        }

    });

    ws.on('close', (msg) => {
        delete clients[id];
        console.log('Client disconnected.');
        console.log('Number of active connections: ', Object.values(clients).length);
    });
});




app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});