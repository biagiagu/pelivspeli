//llamamos a las librerias que necesitemos
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//armamos la conexion a la BD
var conexiondb = require('./lib/conexiondb');



let app = express();

app.use(bodyParser.urlencoded({
    extended:true
}));
//para que pueda recibir json
app.use(bodyParser.json());

app.use(cors());

//llamamos al controlador
var competenciaController=require('./controlador/competenciasController')


//definimos una ruta para competencias (endpoints de la app)
//Lista todos las competencias
app.get('/competencias', competenciaController.obternerCompetencia);
//busca las peliculas para que compitan
app.get('/competencias/:id/peliculas', competenciaController.obtenerOpciones);
//guardar los Votos
app.post('/competencias/:id/voto', competenciaController.guardarVoto);
//obtener los resultados de las competencias
app.get('/competencias/:id/resultados', competenciaController.obtenerResultados);
//guarda nuevas competencias
app.post('/competencias/', competenciaController.crearCompetencia);
//Ejercicio  reiniciar
app.delete('/competencias/:id/votos', competenciaController.reiniciarCompetencia);
//obtener el listado de Generos
app.get('/generos', competenciaController.obtenerGeneros);
//obtener el listado de Directores
app.get('/directores', competenciaController.obtenerDirectores);



// este es el puerto donde vamos a estar escuchando la app y activamos la app
let puerto = 8080;

app.listen(
    puerto, 
    ()=>{
        console.log(`Estamos escuchando en el puerto ${puerto}`);
        //conectamos a la BD
        conexiondb.connect();
    }
);

