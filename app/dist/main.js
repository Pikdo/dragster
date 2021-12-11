(()=>{"use strict";const n=()=>'\n        <div class="Error404">\n            <h2>Error 404</h2>\n        </div>\n    ',t={"/":()=>'\n    <div class="form">\n        <form action="post">\n            <h2 class="form__titulo">REGISTRO</h2>\n            <div class="separador"></div>\n            <input\n                type="text"\n                name="txt_name_player"\n                id="txt_name_player"\n                placeholder="Digite su nombre"\n                required\n                class="form_input"\n            />\n            <input\n                type="button"\n                id="btn_registrar"\n                name="btn_registrar"\n                class="form_input form_button"\n                value="INGRESAR"\n            />\n        </form>\n    </div>\n    ',"/controles":()=>'\n        <div id="controles" class="form">\n            <div class="form_titulos">\n                <div class="form__titulos_left">\n                    <h2 class="form__titulo">🎮CONTROLES</h2>\n                </div>\n                <div class="form__titulos_right">\n                    <h2 class="form__titulo estado" id="estado">Por iniciar...</h2>\n                </div>\n            </div>\n\n            <div class="separador"></div>\n            <div class="controles_container">\n                <div class="controles_up_down">\n                    <input type="button" id="btn_up" name="btn_up" class="arrow up" value="▲" />\n                    <input type="button" id="btn_dwon" name="btn_down" class="arrow down" value="▼" />\n                </div>\n                <div class="controles_left_right controles_disabled">\n                    <input type="button" id="btn_up" name="btn_up" class="arrow izquierda" value="◀" />\n                    <input type="button" id="btn_down" name="btn_down" class="arrow down" value="▶" />\n                </div>\n            </div>\n            <div class="jugadores_container">\n                <div class="jugador_up_down">\n                    <p class="nombre_jugador_1">😏 Tavo</p>\n                </div>\n                <div class="jugador_left_right">\n                    <p class="nombre_jugador_2">😮 Leo</p>\n                </div>\n            </div>\n            <hr />\n            <div><h2>EQUIPO</h2></div>\n        </div>\n    ',"/admin":()=>'<section class="main-container">\n                    <div id="controles" class="form">\n                        <div class="form_titulos">\n                            <div class="form__titulos_left">\n                                <h2 class="form__titulo">🏁ADMIN</h2>\n                            </div>\n                            <div class="form__titulos_right">\n                                <h2 class="form__titulo estado" id="estado">Por iniciar...</h2>\n                            </div>\n                        </div>\n                        <div class="separador"></div>\n                        <div class="jugadores_container">\n                            <div class="jugadores_equipo_1">\n                                <p>CAR 1 🚗</p>\n                                <p class="equipo_1">↕ Tavo 😏</p>\n                                <p class="equipo_1">↔ Leo 😮</p>\n                            </div>\n                            <div><p class="versus">VS</p></div>\n                            <div class="jugadores_equipo_2">\n                                <p>🚕 CAR 2</p>\n                                <p class="equipo_2">🤠 Jose ↕</p>\n                                <p class="equipo_2">🧐 Diego ↔</p>\n                            </div>\n                        </div>                                \n                        <form action="post">\n                            <div class="separador"></div>\n                            \n                            <input\n                                type="button"\n                                id="btn_registrar"\n                                name="btn_registrar"\n                                class="form_input form_button"\n                                value="Iniciar/Detener"\n                            />  \n                            <input\n                                type="button"\n                                id="btn_registrar"\n                                name="btn_registrar"\n                                class="form_input form_button"\n                                value="Reiniciar"\n                            />                 \n                    </div>\n                </section>'},i=async()=>{const i=document.getElementById("header"),s=document.getElementById("content");i.innerHTML=await'\n    <div class="header-title">        \n        <p class="header-title__dragster">DRAGSTER</p>\n        <p class="header-title__race">RACE</p>\n    </div>\n    ';let e=location.hash.slice(1).toLocaleLowerCase().split("/")[1]||"/",a=await(n=>n.length<=3?"/"===n?n:"/:id":`/${n}`)(e),o=t[a]?t[a]:n;s.innerHTML=await o(),document.getElementById("txt_name_player"),document.getElementById("btn_registrar").addEventListener("click",(function(){confetti({particleCount:500})}))};window.addEventListener("load",i),window.addEventListener("hashchange",i)})();