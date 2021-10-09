const ws = require('ws');
const path = require('path');
const express = require('express');
const parse = require('url').parse;
const app = express();

const serverPort = process.env.PORT || 3000;

const wssCars = new ws.Server({ noServer: true });
const wssDrivers = new ws.Server({ noServer: true });

const carsList = [];
const driversList = [];
const commandsList = ["{RFU}", "{RFD}", "{RBU}", "{RBD}", "{LFU}", "{LFD}", "{LBU}", "{LBD}"];

wssCars.on('connection', socket => {
    console.log('[' + socket.carID + '] Car conection');

    socket.on('message', function(message) {
        console.log('[' + socket.carID + '] Car Received Message:', message.toString());
        //socket.send('Hi this is WebSocket server!');
    });
    socket.on('close', function(reasonCode, description) {
        console.log('[' + socket.carID + '] Car Disconnected: ');
    });
});

wssDrivers.on('connection', socket => {
    console.log('[' + socket.driverID + '] Driver conection');

    socket.on('message', function(message) {
        const reseivedMessage = message.toString();
        // console.log('[' + socket.driverID + '] Driver Received Message:', message.toString());
        if (commandsList.indexOf(reseivedMessage) !== -1 && carsList[socket.carID]) {
            carsList[socket.carID].send(reseivedMessage);
        }
    });

    socket.on('close', function(reasonCode, description) {
        console.log('[' + socket.driverID + '] Driver disconnected: ');
    });
});

const server = app.listen(serverPort, () => {
    console.log("Application started and Listening on port ", serverPort);
});

server.on('upgrade', function upgrade(request, socket, head) {
    // This function is not defined on purpose. Implement it with your own logic.
    // authenticate(request, (err, request) => {
    //     if (err || !request) {
    //         console.log('Unauthorized:' + err);
    //         socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    //         socket.destroy();
    //         return;
    //     }

    const { pathname } = parse(request.url);
    const pathnameSegments = pathname.split("/");

    if (pathnameSegments[1] === 'car' && pathnameSegments[2]) {
        wssCars.handleUpgrade(request, socket, head, socket => {
            socket.carID = pathnameSegments[2];
            carsList[socket.carID] = socket;
            wssCars.emit('connection', socket, request);
        });
    } else if (pathnameSegments[1] === 'driver' && pathnameSegments[2] && (pathnameSegments[3] === 'r' || pathnameSegments[3] === 'l')) {
        wssDrivers.handleUpgrade(request, socket, head, socket => {
            socket.carID = pathnameSegments[2];
            socket.driverID = pathnameSegments[2] + '-' + pathnameSegments[3];
            driversList[socket.driverID] = socket;
            wssDrivers.emit('connection', socket, request);
        });
    } else {
        socket.destroy();
    }
    // });
});

// const authenticate = (request, callback) => {
//     const { pathname } = parse(request.url);
//     const pathnameSegments = pathname.split("/");

//     if (!pathnameSegments[1]) {
//         callback('No se indicó ruta');
//         return;
//     }

//     if (pathnameSegments[1] != 'car' && pathnameSegments[1] != 'driver') {
//         callback('la ruta indicada no es válida: ' + request.url);
//         return;
//     }

//     // console.log('request', request);
//     // console.log('request.headers.sec-websocket-key:', request.headers['sec-websocket-key']);
//     // const base64Credentials = request.headers['sec-websocket-key'].split(' ')[1];
//     // const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//     // console.log('credentials', credentials);

//     // if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
//     //     return res.status(401).json({ message: 'Missing Authorization Header' });
//     // }

//     // // verify auth credentials
//     // const base64Credentials =  req.headers.authorization.split(' ')[1];
//     // const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//     // const [username, password] = credentials.split(':');
//     // const user = await userService.authenticate({ username, password });
//     // if (!user) {
//     //     return res.status(401).json({ message: 'Invalid Authentication Credentials' });
//     // }

//     // attach user to request object
//     // req.user = user


//     callback(undefined, request);
// };


app.use('/img', express.static(path.join(__dirname, 'public/images')));
app.use('/', express.static(path.join(__dirname, 'public')));

// app.get('/favico.ico', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/images')"/public/images/favicon.ico");
// });

app.get("/:carid/:carside", (req, res) => {
    res.sendFile(__dirname + "/pages/client_" + req.params.carid + "_" + req.params.carside + ".html");
});