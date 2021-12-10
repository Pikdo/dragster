const getRegistro = () => {
    var txt_name_player = document.getElementById("txt_name_player");
    var btn_registrar = document.getElementById("btn_registrar");

    btn_registrar.addEventListener("click", function () {
        //Logica front end para registro
        // . . .

        // prueba de paquete de confetti para celebración
        confetti({ particleCount: 500 });
    });
};

export default getRegistro;
