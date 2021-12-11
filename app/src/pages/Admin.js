const Admin = () => {
    const view = `<section class="main-container">
                    <div id="controles" class="form">
                        <div class="form_titulos">
                            <div class="form__titulos_left">
                                <h2 class="form__titulo">🏁ADMIN</h2>
                            </div>
                            <div class="form__titulos_right">
                                <h2 class="form__titulo estado" id="estado">Por iniciar...</h2>
                            </div>
                        </div>
                        <div class="separador"></div>
                        <div class="jugadores_container">
                            <div class="jugadores_equipo_1">
                                <p>CAR 1 🚗</p>
                                <p class="equipo_1">↕ Tavo 😏</p>
                                <p class="equipo_1">↔ Leo 😮</p>
                            </div>
                            <div><p class="versus">VS</p></div>
                            <div class="jugadores_equipo_2">
                                <p>🚕 CAR 2</p>
                                <p class="equipo_2">🤠 Jose ↕</p>
                                <p class="equipo_2">🧐 Diego ↔</p>
                            </div>
                        </div>                                
                        <form action="post">
                            <div class="separador"></div>
                            
                            <input
                                type="button"
                                id="btn_registrar"
                                name="btn_registrar"
                                class="form_input form_button"
                                value="Iniciar/Detener"
                            />  
                            <input
                                type="button"
                                id="btn_registrar"
                                name="btn_registrar"
                                class="form_input form_button"
                                value="Reiniciar"
                            />                 
                    </div>
                </section>`;
    return view;
};

export default Admin;
