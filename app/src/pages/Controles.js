const Constroles = (driver) => {
    const view = `
        <div id="controles" class="form">
            <div class="form_titulos">
                <div class="form__titulos_left">
                    <h2 class="form__titulo">🚘📡 CARRO ${driver.car}</h2>
                </div>
                <div class="form__titulos_right">
                    <h2 class="form__titulo estado" id="estado">Por iniciar...</h2>
                </div>
            </div>

            <div class="separador"></div>
            <div class="controles_container">
                <div id="controles_up_down" class="controles_up_down">
                    <input type="button" id="btn_up" name="btn_up" class="arrow up" value="▲" />
                    <input type="button" id="btn_down" name="btn_down" class="arrow down" value="▼" />
                </div>
                <div id="controles_left_right" class="controles_left_right">
                    <input type="button" id="btn_left" name="btn_left" class="arrow izquierda" value="◀" />
                    <input type="button" id="btn_right" name="btn_right" class="arrow down" value="▶" />
                </div>
            </div>
            <div class="jugadores_container">
                <div class="jugador_up_down">
                    <p class="nombre_jugador_1">${driver.emoji} ${driver.nombre}</p>
                </div>
                <div class="jugador_left_right">
                    <p class="nombre_jugador_2"></p>
                </div>
            </div>
            <hr />
            <div id="text_equipo" class="mensaje">EQUIPO</div>
        </div>
    `;
    return view;
};

export default Constroles;
