const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/index.js", // archivo de inicio del proyecto
    output: {
        path: path.resolve(__dirname, "dist"), // Configuración de salida
        filename: "main.js", // Nombre del archivo inicial main
    },
    resolve: {
        extensions: [".js"], // Definimos las extensiones
    },
    module: {
        rules: [
            {
                test: /\.js?$/, // Nos permite identificar los archivos según se encuentran en nuestro entorno.
                exclude: /node_modules/, // Excluir la carpeta de node modules
                use: {
                    loader: "babel-loader", // Utilizar un loader como configuración establecida.
                },
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        compress: true,
        port: 9000,
    },
    plugins: [
        //Establecemos los plugins que vamos a utilizar
        new HtmlWebpackPlugin({
            inject: true, //Cómo vamos a inyectar un valor a un archivo HTML.
            template: "public/index.html", // Dirección donde se encuentra el template base de HTML
            filename: "index.html", // El nombre que tendrá el archivo en el dist
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "src/styles/", to: "styles/" }, // copia los archivos a una carpeta styles
                { from: "src/img/", to: "img/" }, // copia los archivos a una carpeta img
            ],
        }),
    ], //template base
};
