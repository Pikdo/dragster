import Header from "../templates/Header";
import Registro from "../pages/Registro";
import Controles from "../pages/Controles";
import Admin from "../pages/Admin";
import Error404 from "../pages/Error404";
import getHash from "../utils/getHash";
import resolveRoutes from "../utils/resolveRoutes";
import getDriver from "../utils/getDriver";
import setControles from "../utils/setControles";
import setControlAdmin from "../utils/setControlAdmin";

//const wsDriver = "http://remotecarcontrol.herokuapp.com/driver";
const wsAdmin = "http://remotecarcontrol.herokuapp.com/racecontroller";

const routes = {
    "/": Registro,
    "/registro": Registro,
    "/controles": Controles,
    "/admin": Admin,
};
let globalParam = {
    nombre: "",
    control: "",
};

const header = document.getElementById("header");
const content = document.getElementById("content");
let driver = {};

const router = async () => {
    header.innerHTML = Header();

    let hash = getHash();
    let route = await resolveRoutes(hash);

    //let render = routes[route] ? routes[route] : Error404;

    // Carga las vistas
    switch (route) {
        case "/":
            content.innerHTML = Registro();
            setRegistro();
            break;
        case "/registro":
            content.innerHTML = Registro();
            setRegistro();
            break;
        case "/controles":
            if (globalParam.nombre === "") {
                location.hash = "#/registro";
                break;
            }
            driver = await getDriver(globalParam.nombre);
            content.innerHTML = Controles(driver);
            setControles(driver);
            break;
        case "/admin":
            content.innerHTML = Admin();
            setControlAdmin();
            break;
        default:
            Error404();
            break;
    }
};

function setRegistro() {
    var btn_registrar = document.getElementById("btn_registrar");
    var txt_name_player = document.getElementById("txt_name_player");

    if (btn_registrar) {
        btn_registrar.addEventListener("click", function () {
            console.log(txt_name_player.value);
            registrarJugador(txt_name_player.value);
        });
    }
}

async function registrarJugador(nombre) {
    if (nombre === "") {
        alert("Registre un nombre para poder ingresar");
        return;
    }

    if (location.hash === "#/registro" || location.hash === "") {
        globalParam["nombre"] = nombre;
        location.hash = "#/controles";
    }
}

export default router;
