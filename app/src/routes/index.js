import Header from "../templates/Header";
import Registro from "../pages/Registro";
import Controles from "../pages/Controles";
import Admin from "../pages/Admin";
import Error404 from "../pages/Error404";
import getHash from "../utils/getHash";
import resolveRoutes from "../utils/resolveRoutes";
import getRegistro from "../utils/getRegistro";

const routes = {
    "/": Registro,
    "/registro": Registro,
    "/controles": Controles,
    "/admin": Admin,
};

const router = async () => {
    const header = null || document.getElementById("header");
    const content = null || document.getElementById("content");

    header.innerHTML = await Header();

    let hash = getHash();
    let route = await resolveRoutes(hash);

    let render = routes[route] ? routes[route] : Error404;

    content.innerHTML = await render();

    // Main de Registro
    getRegistro();
};

export default router;
