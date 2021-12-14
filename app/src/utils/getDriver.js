const wsDriverAPI = "http://remotecarcontrol.herokuapp.com/driver";

// driverNames/1 o 2  carros

const getDriver = async (jugador) => {
    try {
        const response = await fetch(wsDriverAPI, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ name: jugador }),
        }).catch((error) => {
            console.error("Fetch Error:" + error);
        });

        const driver = await response.json();

        if (Object.keys(driver).length === 0) {
            alert(`😅 Ya hay 4 jugadores registrados, espere a la siguiente carrera`);
            location.hash = "#/registro";
            return;
        }

        return driver;
    } catch (error) {
        console.error("Error al obtener driver: " + error);
    }
};

export default getDriver;
