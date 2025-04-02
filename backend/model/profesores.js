require('rootpath')();
const mysql = require('mysql2');
const config = require("config.json");

var profesores_db = {};

var connection = mysql.createConnection(config.database);
connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('base de datos conectada')
    }
});


profesores_db.getAll = function (funCallback){
    $query = 'SELECT CONCAT(apellido, " ", nombre)AS nombre_completo, dni, materia from profesor';
    connection.query($query, function(err, rows){
        if(err){
            funCallback({
                message: "Ah ocurrido un error al listar las columnas",
                derail: err
            });
        }else{
            funCallback(undefined, rows);
        }
    });
};

profesores_db.create = function (dato, funCallback){
    params = [
        dato.apellido,
        dato.nombre,
        dato.dni,
        dato.materia
    ];

    $query = 'INSERT INTO profesor (apellido, nombre, dni, materia) VALUES (?,?,?,?)';

    connection.query($query, params, (err, rows) =>{
        if(err){
            if(err.code == "ER_DUP_ENTRY"){
                funCallback({
                    message: 'Este profesor ya fue registrado',
                    detail: err
                });
            }else{
                funCallback({
                    message: "Error del servidor",
                    detail: err
                });
            }
        }else{
            funCallback(undefined,{
                message: `Se creó al profesor ${dato.apellido} ${dato.nombre} exitosamente`,
                detail: rows
            });
        }
    });

}

profesores_db.edit = function (dato, dni, funCallback){

    params = [
        dato.apellido,
        dato.nombre,
        dato.materia,
        dni

    ];

    $query='UPDATE profesor set apellido=?, nombre=?, materia=? WHERE dni=?'

    connection.query($query, params, (err, rows)=>{
        if(err){
            funCallback({
                message: "error desconocido",
                detail: err
            });
        }else{
            if (rows.affectedRows == 0){
                funCallback({
                    message: "No se encontro al profesor con dni " + dni,
                    detail: err
                });
            }else{
                funCallback(undefined,{
                    message: `Se modifico al profesor con dni ${dni}`,
                    detail: rows
                });
            }
        }
    })
}

profesores_db.delete = function (dni, funCallback) {


    $query = 'DELETE from profesor WHERE dni=?';

    connection.query($query, dni, (err, rows) => {
        if (err) {
            return funCallback(err, null);
        }
        if (rows.affectedRows === 0) {
            return funCallback({ 
                message: `No se encontró el profesor con DNI: ${dni}`, 
                detail: null
            });
        } 

        return funCallback(null, { 
            message: `Se eliminó el profesor con DNI: ${dni}`, 
            detail: rows 
        });
    });
};

module.exports = profesores_db;