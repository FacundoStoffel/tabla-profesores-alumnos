require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const profesores_db = require("./../model/profesores.js");

app.get('/', getAll);
app.post('/create', createTeacher);
app.put('/edit/:dni', editTeacher);
app.delete('/delete/:dni', deleteTeacher);


function getAll(req, res){
    profesores_db.getAll((err, result) =>{
        if(err){
            res.status(500).send(err);
        }else{
            res.json(result);
        }
    });
};

function createTeacher(req, res){
    let teacher_register = req.body;
    profesores_db.create(teacher_register, (err, result) =>{
        if(err){
            console.error("Error al registrar el Profesor: ", err);
            res.status(500).send({message: "Error al registrar al profesor", error: err});
        }else{
            console.log("Profesor registrado correctamente", result);
            res.json({message: "Profesor registrado exitosamente" })
        }
    })
}

function editTeacher(req, res) {

    let teacher_edit = req.body;
    let dni = req.params.dni;
    profesores_db.edit(teacher_edit, dni, (err, result)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.json(result);
        }
    });

};

function deleteTeacher(req, res){
    let dni = req.params.dni;
    profesores_db.delete(dni, (err, result)=>{
        if (err) {
            res.status(500).json({error: err.message});
        }
         else {
            if (result.detail.affectedRows == 0) {
                res.status(404).json({message: `No se encontro al profesor con dni: ${dni}`});
            } 
            else {
                res.status(200).json({message: `Se elimino al profesor con dni: ${dni}`});
            }
        }
    })
}




module.exports = app;