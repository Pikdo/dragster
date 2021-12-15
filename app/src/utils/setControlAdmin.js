import getEmoji from "./getEmoji";

const setControlAdmin = () => {
    const hosturl = "https://remotecarcontrol.herokuapp.com";

    const WsServer = (location.protocol == "http:" ? "ws://" : "wss://") + "remotecarcontrol.herokuapp.com";

    const ws = new WebSocket(WsServer + "/racecontroller");

    var btn_iniciar_detener = document.getElementById("btn_iniciar_detener");
    var btn_reiniciar = document.getElementById("btn_reiniciar");
    var iniciado = false;
    var equiposCompletos = false;

    ws.onopen = function () {
        ws.pingInterval = setInterval(() => {
            ws.send("{P}");
            if (!iniciado && !equiposCompletos) {
                cargarJugadores();
            }
        }, 2000);
    };

    ws.onclose = function () {
        clearInterval(ws.pingInterval);
    };

    ws.onmessage = function (e) {
        if (e.data === '{"winner":"1"}' || e.data === '{"winner":"2"}') {
            return;
        }

        document.getElementById("estado").innerHTML = e.data;
    };

    function startCommand() {
        ws.send("{startRace}");
    }

    function stopCommand() {
        ws.send("{stopRace}");
    }

    function winCommand(ganador) {
        ws.send("{winner:" + ganador + "}");
        mostrarGanador(ganador);
    }

    function cargarEventos() {
        var btn_gana_1 = document.getElementById("btn_gana_1");
        var btn_gana_2 = document.getElementById("btn_gana_2");

        btn_gana_1.addEventListener("mousedown", () => {
            winCommand(1);
        });
        btn_gana_1.addEventListener("touchstart", () => {
            winCommand(1);
        });

        btn_gana_2.addEventListener("mousedown", () => {
            winCommand(2);
        });
        btn_gana_2.addEventListener("touchstart", () => {
            winCommand(2);
        });

        btn_iniciar_detener.addEventListener("click", () => {
            iniciarDetener();
        });
        btn_iniciar_detener.addEventListener("touchstart", () => {
            iniciarDetener();
        });

        btn_reiniciar.addEventListener("click", () => {
            reiniciar();
        });
        btn_reiniciar.addEventListener("touchstart", () => {
            reiniciar();
        });
    }

    function iniciarDetener() {
        if (iniciado == false) {
            startCommand();
            iniciado = true;
        }
    }

    function reiniciar() {
        stopCommand();
        limpiar();
    }

    function limpiar() {
        iniciado = false;
        equiposCompletos = false;
        btn_iniciar_detener.value = "▶ Iniciar";
        document.getElementById("estado").innerHTML = "Por iniciar...";
        document.getElementById("1A").innerHTML = "";
        document.getElementById("1D").innerHTML = "";
        document.getElementById("2A").innerHTML = "";
        document.getElementById("2D").innerHTML = "";
    }

    async function cargarJugadores() {
        var estado = document.getElementById("estado");

        estado.innerHTML = "Esperando jugadores...";

        const response1 = await fetch(hosturl + "/driverNames/1", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "GET",
        }).catch((error) => {
            console.error("Error fetch equipo: " + error);
        });

        const response2 = await fetch(hosturl + "/driverNames/2", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "GET",
        }).catch((error) => {
            console.error("Error fetch equipo: " + error);
        });

        let equipo1 = await response1.json();
        let equipo2 = await response2.json();

        if (equipo1["A"] && equipo1["D"] && equipo2["A"] && equipo2["D"]) {
            equiposCompletos = true;
            estado.innerHTML = "Equipos completos";
        }

        document.getElementById("1A").innerHTML = equipo1["A"] ? " ↕ " + equipo1["A"] + getEmoji() : "Sin 1A";
        document.getElementById("1D").innerHTML = equipo1["D"] ? " ↔ " + equipo1["D"] + getEmoji() : "Sin 1D";
        document.getElementById("2A").innerHTML = equipo2["A"] ? getEmoji() + equipo2["A"] + " ↕ " : "Sin 2A";
        document.getElementById("2D").innerHTML = equipo2["D"] ? getEmoji() + equipo2["D"] + " ↔ " : "Sin 2D";
    }

    function mostrarGanador(ganador) {
        document.getElementById("estado").innerHTML = "Ganador equipo:" + ganador;

        confetti({ particleCount: 500, spread: 50 });
    }

    cargarEventos();
};

export default setControlAdmin;
