import getEmoji from "./getEmoji";

const setControles = async (DriverData) => {
    const hosturl = "https://remotecarcontrol.herokuapp.com";

    const WsServer = (location.protocol == "http:" ? "ws://" : "wss://") + "remotecarcontrol.herokuapp.com";

    const ws = new WebSocket(WsServer + DriverData.uri);

    var equipoCompleto = false;
    ws.onopen = function () {
        document.getElementById("j1").innerHTML = DriverData.driverName + " " + getEmoji();
        document.getElementById("car").innerHTML = "🚘📡" + " CARRO " + DriverData.car;

        ws.pingInterval = setInterval(() => {
            ws.send("{P}");
            if (!equipoCompleto) {
                cargarCompanero(DriverData);
            }
        }, 2000);
    };

    ws.onclose = function (e) {
        clearInterval(ws.pingInterval);
        document.getElementById("estado").innerHTML = "Carrera finalizada";

        setTimeout(() => {
            confetti({ particleCount: 500, spread: 150 });
            location.hash = "#/registro";
        }, 10000);
    };

    ws.onmessage = function (e) {
        if (e.data === '{"winner":"1"}' || e.data === '{"winner":"2"}') {
            mostrarGanador(e.data);
            return;
        }

        document.getElementById("estado").innerHTML = e.data;
    };

    function forewardCommand(event) {
        if (event === "D" || event === "U") {
            ws.send("{" + DriverData.motor + "F" + event + "}");
        }
    }

    function backwardCommand(event) {
        if (event === "D" || event === "U") {
            ws.send("{" + DriverData.motor + "B" + event + "}");
        }
    }

    async function cargarCompanero(driver) {
        let url = hosturl + "/driverNames/" + driver.car;

        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "GET",
        }).catch((error) => {
            console.error("Error fetch equipo: " + error);
        });

        const equipo = await response.json();

        if (equipo["A"] != "" && equipo["D"] != "") {
            equipoCompleto = true;
        }

        var jugador1 = "";
        var jugador2 = "";

        if (driver.motor === "A") {
            jugador1 = " ↕ " + equipo["A"] + getEmoji();
            jugador2 = getEmoji() + " ↔ " + equipo["D"];
        } else if (driver.motor === "D") {
            jugador1 += " ↔ " + equipo["D"] + getEmoji();
            jugador2 += getEmoji() + equipo["A"] + " ↕ ";
        }

        document.getElementById("j1").innerHTML = jugador1;
        document.getElementById("j2").innerHTML = jugador2;
    }

    function cargarEventosBotones() {
        var controles_up_down = document.getElementById("controles_up_down");
        var controles_left_right = document.getElementById("controles_left_right");

        var btn_adelante = document.getElementById("btn_up");
        var btn_reversa = document.getElementById("btn_down");
        var btn_izquierda = document.getElementById("btn_left");
        var btn_derecha = document.getElementById("btn_right");

        // Cargar eventos de botones
        if (DriverData.motor === "A") {
            // ACELERAR REVERSA
            controles_left_right.style.display = "none";

            console.log("Carga Eventos Aceleración");
            // BTN ADELANTE
            btn_adelante.addEventListener("mouseup", () => {
                console.log("btn_adelante suelto");
                forewardCommand("U");
            });
            btn_adelante.addEventListener("mousedown", () => {
                console.log("btn_adelante presionado");
                forewardCommand("D");
            });
            btn_adelante.addEventListener("touchstart", () => {
                console.log("btn_adelante presionado");
                forewardCommand("D");
            });
            btn_adelante.addEventListener("touchend", () => {
                console.log("btn_adelante suelto");
                forewardCommand("U");
            });

            // BTN REVERSA
            btn_reversa.addEventListener("mouseup", () => {
                console.log("btn_reversa suelto");
                backwardCommand("U");
            });
            btn_reversa.addEventListener("mousedown", () => {
                console.log("btn_reversa presionado");
                backwardCommand("D");
            });
            btn_reversa.addEventListener("touchstart", () => {
                console.log("btn_reversa presionado");
                backwardCommand("D");
            });
            btn_reversa.addEventListener("touchend", () => {
                console.log("btn_reversa suelto");
                backwardCommand("U");
            });
        } else if (DriverData.motor === "D") {
            // DIRECCCION
            controles_up_down.style.display = "none";

            console.log("Carga Eventos Dirección");

            // BTN IZQUIERDA
            btn_izquierda.addEventListener("mouseup", () => {
                console.log("btn_izquierda suelto");
                forewardCommand("U");
            });
            btn_izquierda.addEventListener("mousedown", () => {
                console.log("btn_izquierda presionado");
                forewardCommand("D");
            });
            btn_izquierda.addEventListener("touchstart", () => {
                console.log("btn_izquierda presionado");
                forewardCommand("D");
            });
            btn_izquierda.addEventListener("touchend", () => {
                console.log("btn_izquierda suelto");
                forewardCommand("U");
            });

            // BTN IZQUIERDA
            btn_derecha.addEventListener("mouseup", () => {
                console.log("btn_derecha suelto");
                backwardCommand("U");
            });
            btn_derecha.addEventListener("mousedown", () => {
                console.log("btn_derecha presionado");
                backwardCommand("D");
            });
            btn_derecha.addEventListener("touchstart", () => {
                console.log("btn_derecha presionado");
                backwardCommand("D");
            });
            btn_derecha.addEventListener("touchend", () => {
                console.log("btn_derecha suelto");
                backwardCommand("U");
            });
        }
    }

    function mostrarGanador(ganador) {
        var ganadorAux = JSON.parse(ganador);
        var text_equipo = document.getElementById("text_equipo");

        var confetiSetInterval = null;

        if (ganadorAux.winner == DriverData.car) {
            text_equipo.innerHTML = `<p> 😎 FELICIDADES 🥇</p>`;

            confetti({ particleCount: 500, spread: 150 });
            confetiSetInterval = setInterval(() => {
                confetti({ particleCount: 500, spread: 150 });
            }, 1500);
        } else {
            text_equipo.innerHTML = `<p> 😅 GRACIAS POR PARTICIPAR 🥈</p>`;
        }
        setTimeout(() => {
            clearInterval(confetiSetInterval);
        }, 10000);
    }

    cargarEventosBotones();
};

export default setControles;
