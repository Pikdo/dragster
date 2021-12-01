const Constroles = () => {
    const view = `
        <div id="controles" class="form">
            <div class="form_titulos">
                <div class="form__titulos_left">
                    <h2 class="form__titulo">🎮CONTROLES</h2>
                </div>
                <div class="form__titulos_right">
                    <h2 class="form__titulo estado" id="estado">Por iniciar...</h2>
                </div>
            </div>

            <div class="separador"></div>
            <div class="controles_container">
                <div class="controles_up_down">
                    <input type="button" id="btn_up" name="btn_up" class="arrow up" value="▲" />
                    <input type="button" id="btn_dwon" name="btn_down" class="arrow down" value="▼" />
                </div>
                <div class="controles_left_right controles_disabled">
                    <input type="button" id="btn_up" name="btn_up" class="arrow izquierda" value="◀" />
                    <input type="button" id="btn_down" name="btn_down" class="arrow down" value="▶" />
                </div>
            </div>
            <div class="jugadores_container">
                <div class="jugador_up_down">
                    <p class="nombre_jugador_1">😏 Tavo</p>
                </div>
                <div class="jugador_left_right">
                    <p class="nombre_jugador_2">😮 Leo</p>
                </div>
            </div>
            <hr />
            <div><h2>EQUIPO</h2></div>
        </div>
    `;
    return view;
};

export default Constroles;
