//declaraciones iniciales para el proyecto
require('rootpath')();
const express = require('express');
const app = express();
const morgan = require('morgan');

var cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
morgan(':method :url :status :res[content-length] - :response-time ms');


const config = require("config.json");

const controllerProfesores = require("./controller/profesoresController.js");
const controllerAlumnos = require("./controller/alumnosController.js");


app.use('/teacher', controllerProfesores)
app.use('/students', controllerAlumnos);



//funcion para arrancar el servidor
app.listen(config.server.port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('servidor escuchando en el puerto ' + config.server.port)
    }
});