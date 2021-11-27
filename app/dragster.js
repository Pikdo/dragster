document.addEventListener("DOMContentLoaded", function (event) {
    addEventos();
});

function addEventos() {
    var txt_name_player = document.getElementById("txt_name_player");
    var btn_registrar = document.getElementById("btn_registrar");

    btn_registrar.addEventListener("click", function () {
        alert("Hola " + txt_name_player.value + " has sido registrad@ en mi corazón 💘, te amo");
    });
}
