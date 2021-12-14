const Admin = () => {
    const view = `<section class="main-container">
                    <div id="controles" class="form">
                        <div class="form_titulos">
                            <div class="form__titulos_left">
                                <h2 class="form__titulo">ADMIN 🏁</h2>
                            </div>
                            <div class="form__titulos_right">
                                <h2 class="form__titulo estado" id="estado">Por iniciar...</h2>
                            </div>
                        </div>
                        <div class="separador"></div>
                        <div class="jugadores_container">
                            <div class="jugadores_equipo_1">
                                <input
                                type="button"
                                id="btn_gana_1"
                                name="btn_gana_1"
                                class="form_input form_button"
                                value="CAR 1 🚗"                                
                                /> 
                                <p id="1A"></p>
                                <p id="1D"></p>
                            </div>
                            <div><p class="versus">VS</p></div>
                            <div class="jugadores_equipo_2">
                                <input
                                type="button"
                                id="btn_gana_2"
                                name="btn_gana_2"
                                class="form_input form_button"
                                value="🚕 CAR 2"                                
                                /> 
                                <p id="2A"></p>
                                <p id="2D"></p>
                            </div>
                        </div>
                        <form action="post">
                            <div class="separador"></div>
                            
                            <input
                                type="button"
                                id="btn_iniciar_detener"
                                name="btn_iniciar_detener"
                                class="form_input form_button"
                                value="▶ Iniciar"
                            />
                            <input
                                type="button"
                                id="btn_reiniciar"
                                name="btn_reiniciar"
                                class="form_input form_button"
                                value="⏏ Reiniciar"
                            />
                    </div>
                </section>`;
    return view;
};

export default Admin;
