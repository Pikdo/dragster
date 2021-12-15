(()=>{"use strict";const n=()=>{const n=["😏","😎","😍","🤖","😺","🤠","🤑","😁","😊","👽","😬","🤩","🤗","😛","😃","🤓","🙄","😴"];return n[Math.round(Math.random()*(n.length-1))]};let e={nombre:""};const t=document.getElementById("header"),o=document.getElementById("content");let a={};const r=async()=>{t.innerHTML='\n    <div class="header-title">        \n        <p class="header-title__dragster">DRAGSTER</p>\n        <p class="header-title__race">RACE</p>\n    </div>\n    ';let r=location.hash.slice(1).toLocaleLowerCase().split("/")[1]||"/";switch(await(d=r,d.length<=3?"/"===d?d:"/:id":`/${d}`)){case"/":case"/registro":o.innerHTML='\n    <div class="form">        \n        <h2 class="form__titulo">REGISTRO</h2>\n        <div class="separador"></div>        \n            <input\n                type="text"\n                name="txt_name_player"\n                id="txt_name_player"\n                placeholder="Digite su nombre"\n                required\n                class="form_input"\n            />\n            <input\n                type="button"\n                id="btn_registrar"\n                name="btn_registrar"\n                class="form_input form_button"\n                value="INGRESAR"\n            />        \n        <div id="titulo" class="mensaje"></div>\n    </div>\n    ',i=document.getElementById("btn_registrar"),s=document.getElementById("txt_name_player"),i&&i.addEventListener("click",(function(){!async function(n){""!==n?"#/registro"!==location.hash&&""!==location.hash||(e.nombre=n,location.hash="#/controles"):alert("Registre un nombre para poder ingresar")}(s.value)}));break;case"/controles":if(""===e.nombre){location.hash="#/registro";break}a=await(async n=>{try{const e=await fetch("https://remotecarcontrol.herokuapp.com/driver",{headers:{Accept:"application/json","Content-Type":"application/json"},method:"POST",body:JSON.stringify({name:n})}).catch((n=>{console.error("Fetch Error:"+n)})),t=await e.json();return 0===Object.keys(t).length?(alert("😅 Ya hay 4 jugadores registrados, espere a la siguiente carrera"),void(location.hash="#/registro")):t}catch(n){console.error("Error al obtener driver: "+n)}})(e.nombre),o.innerHTML='\n        <div id="controles" class="form">\n            <div class="form_titulos">\n                <div class="form__titulos_left">                    \n                    <h2 class="form__titulo" id="car"></h2>\n                </div>\n                <div class="form__titulos_right">\n                    <h2 class="form__titulo estado" id="estado">Por iniciar...</h2>\n                </div>\n            </div>\n\n            <div class="separador"></div>\n            <div class="controles_container">\n                <div id="controles_up_down" class="controles_up_down">\n                    <input type="button" id="btn_up" name="btn_up" class="arrow up" value="▲" />\n                    <input type="button" id="btn_down" name="btn_down" class="arrow down" value="▼" />\n                </div>\n                <div id="controles_left_right" class="controles_left_right">\n                    <input type="button" id="btn_left" name="btn_left" class="arrow izquierda" value="◀" />\n                    <input type="button" id="btn_right" name="btn_right" class="arrow down" value="▶" />\n                </div>\n            </div>\n            <div class="jugadores_container">\n                <div class="jugador_up_down">\n                    <p id="j1" class="nombre_jugador_1"></p>\n                </div>\n                <div class="jugador_left_right">\n                    <p id="j2" class="nombre_jugador_2"></p>\n                </div>\n            </div>\n            <div class="separador"></div>\n            <div id="text_equipo" class="mensaje">EQUIPO</div>\n        </div>\n    ',(async e=>{const t=("http:"==location.protocol?"ws://":"wss://")+"remotecarcontrol.herokuapp.com",o=new WebSocket(t+e.uri);var a,r,i,s,d,c,l=!1;function u(n){"D"!==n&&"U"!==n||o.send("{"+e.motor+"F"+n+"}")}function m(n){"D"!==n&&"U"!==n||o.send("{"+e.motor+"B"+n+"}")}o.onopen=function(){document.getElementById("j1").innerHTML=e.driverName+" "+n(),document.getElementById("car").innerHTML="🚘📡 CARRO "+e.car,o.pingInterval=setInterval((()=>{o.send("{P}"),l||async function(e){let t="https://remotecarcontrol.herokuapp.com/driverNames/"+e.car;const o=await fetch(t,{headers:{Accept:"application/json","Content-Type":"application/json"},method:"GET"}).catch((n=>{console.error("Error fetch equipo: "+n)})),a=await o.json();""!=a.A&&""!=a.D&&(l=!0);var r="",i="";"A"===e.motor?(r=" ↕ "+a.A+n(),i=n()+" ↔ "+a.D):"D"===e.motor&&(r+=" ↔ "+a.D+n(),i+=n()+a.A+" ↕ "),document.getElementById("j1").innerHTML=r,document.getElementById("j2").innerHTML=i}(e)}),2e3)},o.onclose=function(n){clearInterval(o.pingInterval),document.getElementById("estado").innerHTML="Carrera finalizada",setTimeout((()=>{confetti({particleCount:500,spread:150}),location.hash="#/registro"}),1e4)},o.onmessage=function(n){var t,o,a,r;'{"winner":"1"}'!==n.data&&'{"winner":"2"}'!==n.data?document.getElementById("estado").innerHTML=n.data:(t=n.data,o=JSON.parse(t),a=document.getElementById("text_equipo"),r=null,o.winner==e.car?(a.innerHTML="<p> 😎 FELICIDADES 🥇</p>",confetti({particleCount:500,spread:150}),r=setInterval((()=>{confetti({particleCount:500,spread:150})}),1500)):a.innerHTML="<p> 😅 GRACIAS POR PARTICIPAR 🥈</p>",setTimeout((()=>{clearInterval(r)}),1e4))},a=document.getElementById("controles_up_down"),r=document.getElementById("controles_left_right"),i=document.getElementById("btn_up"),s=document.getElementById("btn_down"),d=document.getElementById("btn_left"),c=document.getElementById("btn_right"),"A"===e.motor?(r.style.display="none",console.log("Carga Eventos Aceleración"),i.addEventListener("mouseup",(()=>{console.log("btn_adelante suelto"),u("U")})),i.addEventListener("mousedown",(()=>{console.log("btn_adelante presionado"),u("D")})),i.addEventListener("touchstart",(()=>{console.log("btn_adelante presionado"),u("D")})),i.addEventListener("touchend",(()=>{console.log("btn_adelante suelto"),u("U")})),s.addEventListener("mouseup",(()=>{console.log("btn_reversa suelto"),m("U")})),s.addEventListener("mousedown",(()=>{console.log("btn_reversa presionado"),m("D")})),s.addEventListener("touchstart",(()=>{console.log("btn_reversa presionado"),m("D")})),s.addEventListener("touchend",(()=>{console.log("btn_reversa suelto"),m("U")}))):"D"===e.motor&&(a.style.display="none",console.log("Carga Eventos Dirección"),d.addEventListener("mouseup",(()=>{console.log("btn_izquierda suelto"),u("U")})),d.addEventListener("mousedown",(()=>{console.log("btn_izquierda presionado"),u("D")})),d.addEventListener("touchstart",(()=>{console.log("btn_izquierda presionado"),u("D")})),d.addEventListener("touchend",(()=>{console.log("btn_izquierda suelto"),u("U")})),c.addEventListener("mouseup",(()=>{console.log("btn_derecha suelto"),m("U")})),c.addEventListener("mousedown",(()=>{console.log("btn_derecha presionado"),m("D")})),c.addEventListener("touchstart",(()=>{console.log("btn_derecha presionado"),m("D")})),c.addEventListener("touchend",(()=>{console.log("btn_derecha suelto"),m("U")})))})(a);break;case"/admin":o.innerHTML='<section class="main-container">\n                    <div id="controles" class="form">\n                        <div class="form_titulos">\n                            <div class="form__titulos_left">\n                                <h2 class="form__titulo">ADMIN 🏁</h2>\n                            </div>\n                            <div class="form__titulos_right">\n                                <h2 class="form__titulo estado" id="estado">Por iniciar...</h2>\n                            </div>\n                        </div>\n                        <div class="separador"></div>\n                        <div class="jugadores_container">\n                            <div class="jugadores_equipo_1">\n                                <input\n                                type="button"\n                                id="btn_gana_1"\n                                name="btn_gana_1"\n                                class="form_input form_button"\n                                value="CAR 1 🚗"                                \n                                /> \n                                <p id="1A"></p>\n                                <p id="1D"></p>\n                            </div>\n                            <div><p class="versus">VS</p></div>\n                            <div class="jugadores_equipo_2">\n                                <input\n                                type="button"\n                                id="btn_gana_2"\n                                name="btn_gana_2"\n                                class="form_input form_button"\n                                value="🚕 CAR 2"                                \n                                /> \n                                <p id="2A"></p>\n                                <p id="2D"></p>\n                            </div>\n                        </div>\n                        <form action="post">\n                            <div class="separador"></div>                            \n                            <input\n                                type="button"\n                                id="btn_iniciar_detener"\n                                name="btn_iniciar_detener"\n                                class="form_input form_button"\n                                value="▶ Iniciar"\n                            />\n                            <input\n                                type="button"\n                                id="btn_reiniciar"\n                                name="btn_reiniciar"\n                                class="form_input form_button"\n                                value="⏏ Reiniciar"\n                            />\n                    </div>\n                </section>',(()=>{const e="https://remotecarcontrol.herokuapp.com",t=("http:"==location.protocol?"ws://":"wss://")+"remotecarcontrol.herokuapp.com",o=new WebSocket(t+"/racecontroller");var a,r,i=document.getElementById("btn_iniciar_detener"),s=document.getElementById("btn_reiniciar"),d=!1,c=!1;function l(n){o.send("{winner:"+n+"}"),function(n){document.getElementById("estado").innerHTML="Ganador equipo:"+n,confetti({particleCount:500,spread:50})}(n)}function u(){0==d&&(o.send("{startRace}"),d=!0)}function m(){o.send("{stopRace}"),d=!1,c=!1,i.value="▶ Iniciar",document.getElementById("estado").innerHTML="Por iniciar...",document.getElementById("1A").innerHTML="",document.getElementById("1D").innerHTML="",document.getElementById("2A").innerHTML="",document.getElementById("2D").innerHTML=""}o.onopen=function(){o.pingInterval=setInterval((()=>{o.send("{P}"),d||c||async function(){var t=document.getElementById("estado");t.innerHTML="Esperando jugadores...";const o=await fetch(e+"/driverNames/1",{headers:{Accept:"application/json","Content-Type":"application/json"},method:"GET"}).catch((n=>{console.error("Error fetch equipo: "+n)})),a=await fetch(e+"/driverNames/2",{headers:{Accept:"application/json","Content-Type":"application/json"},method:"GET"}).catch((n=>{console.error("Error fetch equipo: "+n)}));let r=await o.json(),i=await a.json();r.A&&r.D&&i.A&&i.D&&(c=!0,t.innerHTML="Equipos completos"),document.getElementById("1A").innerHTML=r.A?" ↕ "+r.A+n():"Sin 1A",document.getElementById("1D").innerHTML=r.D?" ↔ "+r.D+n():"Sin 1D",document.getElementById("2A").innerHTML=i.A?n()+i.A+" ↕ ":"Sin 2A",document.getElementById("2D").innerHTML=i.D?n()+i.D+" ↔ ":"Sin 2D"}()}),2e3)},o.onclose=function(){clearInterval(o.pingInterval)},o.onmessage=function(n){'{"winner":"1"}'!==n.data&&'{"winner":"2"}'!==n.data&&(document.getElementById("estado").innerHTML=n.data)},a=document.getElementById("btn_gana_1"),r=document.getElementById("btn_gana_2"),a.addEventListener("mousedown",(()=>{l(1)})),a.addEventListener("touchstart",(()=>{l(1)})),r.addEventListener("mousedown",(()=>{l(2)})),r.addEventListener("touchstart",(()=>{l(2)})),i.addEventListener("click",(()=>{u()})),i.addEventListener("touchstart",(()=>{u()})),s.addEventListener("click",(()=>{m()})),s.addEventListener("touchstart",(()=>{m()}))})()}var i,s,d};window.addEventListener("load",r),window.addEventListener("hashchange",r)})();