const ws = require('ws');
const path = require('path');
const express = require('express');
var cors = require('cors')
const parse = require('url').parse;
var bodyParser = require('body-parser');
const app = express();

const serverPort = process.env.PORT || 3000;

const maxCarCommandTime = 3000; // tiempo máximo de un commando en milisegundos
const maxCommandTime = 10; // tiempo máximo de un commando en milisegundos

const wssCars = new ws.Server({ noServer: true });
const wssDrivers = new ws.Server({ noServer: true });
const wssRaceController = new ws.Server({ noServer: true });

let carsList = {};
let driversList = {};
let driversNames = {};
let raceController = {};
//const raceStatus = {isRunning: false};
let isRunnig = false;
const racerCommandsList = ["{AFU}", "{AFD}", "{ABU}", "{ABD}", "{DFU}", "{DFD}", "{DBU}", "{DBD}", '{GPD}'];
const racerTimedCommandsList = ["{GTF:}", "{GTB:}", "{ATF:}", "{ATB:}", "{DTF:}", "{DTB:}"];
//other commands {GPD}, {GTF:10}, {GTB:10}
const adminCommandsList = ["{startRace}", "{stopRace}", "{winner:1}", "{winner:2}"];
const commandTimeFactor = maxCarCommandTime / maxCommandTime; // relascion para el tiempo de los commando 
let driverData = [{ uri: "/driver/1/a", car: "1", motor: "A" }, { uri: "/driver/1/d", car: "1", motor: "D" }, { uri: "/driver/2/a", car: "2", motor: "A" }, { uri: "/driver/2/d", car: "2", motor: "D" }];
let driverDataLength = driverData.length;

let driverCommandControl = {};

//{AFD} Acelerate Foreward Down Inicia el avance
//{AFU} Acelerate Foreward Up Finaliza el avance
//{ABD} Acelerate Backward Down Inicia el retroceso
//{ABU} Acelerate Backward Up Finaliza el retroceso
//{DFD} Direction Foreward Down Inicia el gira la dirección en un centido (izquierda)
//{DFU} Direction Foreward Up Finaliza el gira la dirección en un centido (izquierda)
//{DBD} Direction Backward Down Inicia el gira la dirección en el otro centido (derecha)
//{DBU} Direction Backward Up Finaliza el gira la dirección en el otro centido (derecha)
//{GPD} General Stop Down Finaliza el avance o retroceso de ambas llantas
//{ATF:_} Acleración Timer Backward Avance durante un determinado tiempo 1 a 10 
//{ATB:_} Acleración Timer Backward Retroceso durante un determinado tiempo 1 a 10
//{DTF:_} Dirección Backward Avance durante un determinado tiempo 1 a 10 (izquierda)
//{DTB:_} Dirección Backward Retroceso durante un determinado tiempo 1 a 10 (derecha)
//{GTF:_} General Timer Foreward Avance durante un determinado tiempo 1 a 10 (Ambos Motores)
//{GTB:_} General Timer Backward Retroceso durante un determinado tiempo 1 a 10 (Ambos Motores)

//Deprecated:
//{GUD} General Turbo Down Inicia el avance en ambas llantas al maximo de tiempo
//{GUU} General Turbo Up Finaliza el avance en ambas llantas

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
        driverCommandControl[socket.driverID] = { GUD: false };
    }
    console.log('[' + socket.driverID + '] Driver conection');

    socket.on('message', function(message) {
        if (isRunnig) { // solo revisa el mensaje cuando están corriendo los carros
            const reseivedMessage = message.toString();
            //console.log('[' + socket.driverID + '] Driver Received Message:', reseivedMessage);
            const command = validateCommand(socket.driverID, reseivedMessage);
            //console.log('[' + socket.driverID + '] Driver validateCommand:', command);

            if (command && command.trim() && carsList[socket.carID]) {
                //console.log('diver command ', reseivedMessage);
                // switch (command) {
                //     case '{GUD}':
                //         turbo(socket.driverID, socket.carID);
                //         break;
                //     default:
                //         carsList[socket.carID].send(command);
                //         break;
                // }
                //console.log('[' + socket.driverID + '] Driver command:', command);
                carsList[socket.carID].send(command);
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
        //console.log('[RaceController] Received Message:', message.toString());
        if (adminCommandsList.indexOf(reseivedMessage) !== -1) {
            switch (reseivedMessage) {
                case '{startRace}':
                    raceStart();
                    break;
                case '{stopRace}':
                    raceStop();
                    break;
                case '{winner:1}':
                    raceStop(1);
                    break;
                case '{winner:2}':
                    raceStop(2);
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
    } else if (pathnameSegments[1] === 'driver' && pathnameSegments[2] && (pathnameSegments[3] === 'd' || pathnameSegments[3] === 'a')) {
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

const raceStart = () => {
    // Resetea el uso del turbo:
    for (var driverID in driverCommandControl) {
        driverCommandControl[driverID].GUD = false;
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

const raceStop = (winner) => {
    if (!isRunnig) {
        return;
    }

    isRunnig = false
    broadcastCarMessage('{GPD}');
    //broadcastDriversMessage("La carrera ha terminado....");
    if (winner) {
        broadcastDriversMessage("{\"winner\":\"" + winner + "\"}");
    }
    killDrivers();
    driverDataLength = driverData.length;
    driversNames = {};

    // Detiene turbos en uso
    // for (var driverID in driverCommandControl) {
    //     if (driverCommandControl[driverID].GUDtimeoutObj) {
    //         clearTimeout(driverCommandControl[driverID].GUDtimeoutObj);
    //     }
    // }
}

const broadcastDriversMessage = (message) => {
    for (var driverID in driversList) {
        if (driversList[driverID] && driversList[driverID].send) {
            driversList[driverID].send(message);
        }
    }
    raceController.send(message);
}

const broadcastCarMessage = (message) => {
    for (var carID in carsList) {
        //console.log('mensaje:', carID);
        carsList[carID].send(message);
    }
}

const killDrivers = () => {
    for (var driverID in driversList) {
        if (driversList[driverID] && driversList[driverID].close) {
            driversList[driverID].close();
            driversList[driverID] = {};
        }
    }
}

// const turbo = (driverID) => {
//     if (!driverCommandControl[driverID].GUD) {
//         driverCommandControl[driverID].GUD = true; // Solo se usa 1 vez por cada jugador
//         return '{GTF:' + maxCommandTime + '}';
//     }
//     return '';
// }

const validateCommand = (driverID, command) => {
    let commandRef = command;

    // Si es comando Turbo, lo valida y sustituye por commando respectivo
    // if (commandRef === '{GUD}') {
    //     commandRef = turbo(driverID);
    // }

    // Un commando válido debe tener al menos 5 caracteres
    if (commandRef.length < 5) {
        return "";
    }

    // Si es un comando directo lo deja pasar
    if (racerCommandsList.indexOf(commandRef) !== -1) {
        return commandSidetoNumber(commandRef);
    } else {
        commandBase = commandRef.substring(0, 5);
        // Si es un comando de tiempo, debe revisar y ajustar el valor del tiempo
        if (racerTimedCommandsList.indexOf(commandBase + "}") !== -1) {
            let time = getAdjustedCommandTime(commandRef);
            if (time > 0) {
                // si el tiempo ajustado es mayor a cero lo deja pasar
                return commandSidetoNumber(commandBase + time + "}");
            }
        }

        return "";
    }
}

const commandSidetoNumber = (command) => {
    let commandRef = command;

    // Un commando válido debe tener al menos 5 caracteres
    if (commandRef.length < 5) {
        return commandRef;
    }

    // Si es un comando directo lo deja pasar    
    switch (commandRef.charAt(1)) {
        case 'A':
            return commandRef.charAt(0) + '1' + commandRef.substring(2);
            //break;
        case 'D':
            return commandRef.charAt(0) + '2' + commandRef.substring(2);
            //break;
        default:
            return commandRef;
    }
}

const getAdjustedCommandTime = (command) => {
    try {
        let commandRef = command;
        let valor = 0;

        if (commandRef.length >= 7) {
            valor = parseInt(commandRef.charAt(5));
            //commandRef.substring(0, 4) + "_" + commandRef.substring(6, commandRef.length);
        }

        if (commandRef.length >= 8) {
            valor += 10;
            valor += parseInt(commandRef.charAt(6));
            //commandRef.substring(0, 5) + "_" + commandRef.substring(7, commandRef.length);
        }

        if (valor > maxCommandTime) {
            valor = maxCommandTime
        }

        return (valor * commandTimeFactor);
    } catch (error) {
        console.log("Commando no válido: ", command);
        console.error(error);
        return 0
    }
}

const processDriver = (index, driverName) => {
    //Rechaza nombres en blanco
    if (!driverName || driverName == "") {
        return {}
    }

    let objectTmp = driverData[index];

    if (driverDataLength > 0) {
        driverData[index] = driverData[driverDataLength - 1];
        driverData[driverDataLength - 1] = objectTmp;
    }

    driverDataLength--;

    if (driverName) {
        objectTmp.driverName = driverName;
    } else {
        objectTmp.driverName = "Jugador_" + objectTmp.car + objectTmp.motor;
    }
    driversNames[objectTmp.car + objectTmp.motor] = objectTmp.driverName;
    return objectTmp;
}


const validateDriverName = (driverName) => {
    //Rechaza nombres en blanco
    if (!driverName || driverName == "") {
        return {}
    }

    //console.log("driverName: ", driverName);
    //console.log("driversNames: ", driversNames);
    // Si el nombre ya existe, retorna los mismos datos
    switch (driverName) {
        case driversNames["1A"]:
            return { uri: "/driver/1/a", car: "1", motor: "A", "driverName": driverName }
            break;
        case driversNames["1D"]:
            return { uri: "/driver/1/d", car: "1", motor: "D", "driverName": driverName }
            break;
        case driversNames["2A"]:
            return { uri: "/driver/2/a", car: "2", motor: "A", "driverName": driverName }
            break;
        case driversNames["2D"]:
            return { uri: "/driver/2/d", car: "2", motor: "D", "driverName": driverName }
            break;
            //default:
    }
    return {};
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

app.use(cors())
app.use(bodyParser.json()); // body en formato json
app.use(bodyParser.urlencoded({ extended: false })); //body formulario
app.use('/img', express.static(path.join(__dirname, 'app/img')));
app.use('/styles', express.static(path.join(__dirname, 'app/styles')));
app.use('/', express.static(path.join(__dirname, 'app')));

app.get("/driverNames/:carid", (req, res) => {
    let respNames = {};
    respNames["A"] = driversNames[req.params.carid + "A"] || "";
    respNames["D"] = driversNames[req.params.carid + "D"] || "";
    res.json(respNames);
});

app.post("/driver", (req, res) => {
    //Rechaza nombres en blanco
    let driverName = req.body.name
        //console.log("driverName:", driverName);
    if (!driverName || driverName == "") {
        return {}
    }

    let resVal = validateDriverName(driverName);
    if (resVal && resVal.driverName) {
        res.json(resVal);
        return;
    }

    // Si no quedan retorna objeto bacio
    if (driverDataLength <= 0 || isRunnig) {
        res.json({});
        return;
    }

    // Si solo queda uno lo retorna de forma directa
    if (driverDataLength <= 1) {
        res.json(processDriver(0, driverName));
        return;
    }

    // Si quedan varios espacios toma uno al azar
    let index = Math.floor(Math.random() * (driverDataLength));
    res.json(processDriver(index, driverName));
    return;
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/app/index.html");
});


///   test routes 
app.get("/test", (req, res) => {
    res.sendFile(__dirname + "/pages/client_test.html");
});

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/pages/client_race_controller.html");
});

// app.get("/:carid/:carside", (req, res) => {
//     res.sendFile(__dirname + "/pages/client_" + req.params.carid + "_" + req.params.carside + ".html");
// });