require('rootpath')();
const mysql = require('mysql');
const config = require("config.json");


var connection = mysql.createConnection(config.database);
connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('base de datos conectada')
    }
});


const AlumnosModel = {
    insertarAlumnos: (alumnos, callback) => {
        const sql = `INSERT INTO alumnos (apellido, nombre, nacimiento, dni, localidad, domicilio, curso) VALUES ?`;
        const values = alumnos.map(row => [row.apellido, row.nombre, row.nacimiento, row.dni, row.localidad, row.domicilio, row.curso]);

        connection.query(sql, [values], (err, result) => {
            callback(err, result);
        });
    },

    getAll: (callback) => {
        const query = 'SELECT * FROM alumnos';
        connection.query(query, (err, rows) => {
            if (err) {
                callback({
                    message: "Ocurrió un error al listar los alumnos",
                    detail: err
                });
            } else {
                callback(undefined, rows);
            }
        });
    },

    edit: (alumno, callback) => {
        const query = `
          UPDATE alumnos 
          SET apellido = ?, nombre = ?, nacimiento = ?, localidad = ?, domicilio = ?, curso = ? 
          WHERE dni = ?
        `;
      
        const values = [
          alumno.apellido,
          alumno.nombre,
          alumno.nacimiento,
          alumno.localidad,
          alumno.domicilio,
          alumno.curso,
          alumno.dni
        ];
      
        connection.query(query, values, (err, result) => {
          callback(err, result);
        });
      },

    delete: (dni, callback) => {
        const query = 'DELETE FROM alumnos WHERE dni = ?';
      
        connection.query(query, dni, (err, rows) => {
          if (err) return callback(err, null);
          return callback(null, rows); // devolvemos solo rows
        });
      }
};

module.exports = AlumnosModel;

