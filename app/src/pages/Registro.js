const Registro = () => {
    const view = `
    <div class="form">
        <form action="post">
            <h2 class="form__titulo">REGISTRO</h2>
            <div class="separador"></div>
            <input
                type="text"
                name="txt_name_player"
                id="txt_name_player"
                placeholder="Digite su nombre"
                required
                class="form_input"
            />
            <input
                type="button"
                id="btn_registrar"
                name="btn_registrar"
                class="form_input form_button"
                value="INGRESAR"
            />
        </form>
    </div>
    `;
    return view;
};

export default Registro;
