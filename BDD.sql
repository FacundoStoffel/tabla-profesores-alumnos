create database profesores;

create table PROFESOR
(
 apellido VARCHAR(50) NOT NULL,
 nombre VARCHAR(50) NOT NULL,
 dni INT UNIQUE NOT NULL,
 materia VARCHAR(50) NOT NULL
 );
 
 create table ALUMNOS
 (
	apellido VARCHAR(50) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    nacimiento DATE NOT NULL,
    dni INT UNIQUE NOT NULL,
    localidad VARCHAR(80) NOT NULL,
    domicilio VARCHAR(80) NOT NULL,
    curso VARCHAR(20) NOT NULL
 );
 
 select * from alumnos
 
 -- QUERYS DE PROFESORES
SELECT CONCAT(apellido, " ", nombre)AS nombre_completo, dni, materia from profesor;
INSERT INTO profesor (apellido, nombre, dni, materia) VALUES ("gomez", "juan", 2345255, "ingles");
UPDATE profesor set apellido="rodriguez", nombre="Juan", dni=12345678, materia="lengua" WHERE dni=2345255