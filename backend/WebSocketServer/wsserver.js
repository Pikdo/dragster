const ws = require('ws');
const path = require('path');
const express = require('express');
const parse = require('url').parse;
const app = express();

const serverPort = process.env.PORT || 3000;

const wssCars = new ws.Server({ noServer: true });
const wssDrivers = new ws.Server({ noServer: true });
const wssRaceController = new ws.Server({ noServer: true });

let carsList = {};
let driversList = {};
let raceController = {};
//const raceStatus = {isRunning: false};
let isRunnig = false;
const racerCommandsList = ["{RFU}", "{RFD}", "{RBU}", "{RBD}", "{LFU}", "{LFD}", "{LBU}", "{LBD}", "{GTD}"];
//other commands {GPD}
const adminCommandsList = ["{startRace}", "{stopRace}"];

let driverCommandControl = {};

wssCars.on('connection', socket => {
    carsList[socket.carID] = socket;
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
    driversList[socket.driverID] = socket;
    if (!driverCommandControl[socket.driverID]) {
        // Solamente lo inicializa cuando es la primera vez, cuando se reconecta no
        driverCommandControl[socket.driverID] = { GTD: false };
    }
    console.log('[' + socket.driverID + '] Driver conection');

    socket.on('message', function(message) {
        if (isRunnig) { // solo revisa el mensaje cuando están corriendo los carros
            const reseivedMessage = message.toString();
            //console.log('[' + socket.driverID + '] Driver Received Message:', message.toString());
            if (racerCommandsList.indexOf(reseivedMessage) !== -1 && carsList[socket.carID]) {
                //console.log('diver command ', reseivedMessage);
                switch (reseivedMessage) {
                    case '{GTD}':
                        turbo(socket.driverID, socket.carID);
                        break;
                    default:
                        carsList[socket.carID].send(reseivedMessage);
                        break;
                }
            }
        }
    });

    socket.on('close', function(reasonCode, description) {
        console.log('[' + socket.driverID + '] Driver disconnected: ');
    });
});

wssRaceController.on('connection', socket => {
    raceController = socket;
    console.log('Race Controller conection');

    socket.on('message', function(message) {
        const reseivedMessage = message.toString();
        //console.log('[' + socket.driverID + '] Driver Received Message:', message.toString());
        if (adminCommandsList.indexOf(reseivedMessage) !== -1) {
            switch (reseivedMessage) {
                case '{startRace}':
                    raceStart();
                    break;
                case '{stopRace}':
                    raceStop();
                    break;
                default:
                    break;
            }
        }
    });

    socket.on('close', function(reasonCode, description) {
        console.log('Race Controller disconnected: ');
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
            wssCars.emit('connection', socket, request);
        });
    } else if (pathnameSegments[1] === 'driver' && pathnameSegments[2] && (pathnameSegments[3] === 'r' || pathnameSegments[3] === 'l')) {
        wssDrivers.handleUpgrade(request, socket, head, socket => {
            socket.carID = pathnameSegments[2];
            socket.driverID = pathnameSegments[2] + '-' + pathnameSegments[3];
            wssDrivers.emit('connection', socket, request);
        });
    } else if (pathnameSegments[1] === 'racecontroller') {
        wssRaceController.handleUpgrade(request, socket, head, socket => {
            wssRaceController.emit('connection', socket, request);
        });
    } else {
        socket.destroy();
    }
    // });
});

const turbo = (driverID, carID) => {
    if (!driverCommandControl[driverID].GTD) {
        carsList[carID].send('{GTD}');
        driverCommandControl[driverID].GTDtimeoutObj = setTimeout(() => {
            carsList[carID].send('{GTU}');
        }, 3000);
        // clearTimeout(GTDtimeoutObj);
        driverCommandControl[driverID].GTD = true; // Solo se usa 1 vez por cada jugador
    }
}

const raceStart = () => {
    // Resetea el uso del turbo:
    for (var driverID in driverCommandControl) {
        driverCommandControl[driverID].GTD = false;
        if (driverCommandControl[driverID].GTDtimeoutObj) {
            clearTimeout(driverCommandControl[driverID].GTDtimeoutObj);
        }
    }

    broadcastDriversMessage("La carrera comienza en.... 3");
    const timeoutObj = setTimeout(() => {
        broadcastDriversMessage("La carrera comienza en.... 2");
        const timeoutObj = setTimeout(() => {
            broadcastDriversMessage("La carrera comienza en.... 1");
            const timeoutObj = setTimeout(() => {
                broadcastDriversMessage("...GO...");
                isRunnig = true
            }, 1200);
        }, 1200);
    }, 1200);
}

const raceStop = () => {
    isRunnig = false
    broadcastCarMessage('{GPD}');

    broadcastDriversMessage("La carrera ha terminado....");

    // Detiene turbos en uso
    for (var driverID in driverCommandControl) {
        if (driverCommandControl[driverID].GTDtimeoutObj) {
            clearTimeout(driverCommandControl[driverID].GTDtimeoutObj);
        }
    }
}

const broadcastDriversMessage = (message) => {
    for (var driverID in driversList) {
        driversList[driverID].send(message);
    }
    raceController.send(message);
}

const broadcastCarMessage = (message) => {
    for (var carID in carsList) {
        carsList[carID].send(message);
    }
}

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

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/pages/client_race_controller.html");
});

app.get("/:carid/:carside", (req, res) => {
    res.sendFile(__dirname + "/pages/client_" + req.params.carid + "_" + req.params.carside + ".html");
});