const express = require("express");
const router = express.Router();
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const AlumnosModel = require("./../model/alumnos.js");

// Configuración de almacenamiento de archivos con Multer
const upload = multer({ dest: "uploads/" });


router.get('/', (req, res) => {
  AlumnosModel.getAll((err, result) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.json(result);
      }
  });
});

// Subir archivo Excel y mostrar columnas
router.post("/subir_excel", upload.single("archivo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se seleccionó ningún archivo" });
  }

  const filepath = req.file.path;
  const workbook = xlsx.readFile(filepath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  // Convertir la hoja a JSON, forzando la conversión de fechas
  const data = xlsx.utils.sheet_to_json(sheet, {
    raw: false,
    dateNF: "yyyy-mm-dd",
  });

  // Obtener nombres de columnas
  const columnas = Object.keys(data[0] || {});

  // res.json({ columnas, datos: data.slice(0, 5), filename: req.file.filename });
  res.json({ columnas, datos: data, filename: req.file.filename });
});

// Guardar alumnos en la base de datos
router.post("/guardar_alumnos", (req, res) => {
  const { mapping, filename } = req.body;
  const filepath = path.join(__dirname, "../uploads", filename);
  const workbook = xlsx.readFile(filepath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  // Renombrar columnas según el mapping
  const columnasDB = [
    "apellido",
    "nombre",
    "nacimiento",
    "dni",
    "localidad",
    "domicilio",
    "curso",
  ];
  const renamedData = data.map((row) => {
    let newRow = {};
    columnasDB.forEach((col) => {
      newRow[col] = row[mapping[col]] || null;
    });

    // Convertir fecha si es un string en formato MM/DD/YY o si es un número (Excel almacena fechas como números)
    if (newRow.nacimiento) {
      if (!isNaN(newRow.nacimiento)) {
        // Si la fecha es un número de Excel, convertirlo a fecha real
        let excelDate = parseFloat(newRow.nacimiento);
        let jsDate = new Date((excelDate - 25569) * 86400000); // Convertir a milisegundos
        newRow.nacimiento = jsDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      } else if (typeof newRow.nacimiento === "string") {
        // Si la fecha es un string en formato MM/DD/YY
        let fechaPartes = newRow.nacimiento.split("/");
        if (fechaPartes.length === 3) {
          let mes = fechaPartes[0].padStart(2, "0");
          let dia = fechaPartes[1].padStart(2, "0");
          let anio = fechaPartes[2];

          // Si el año tiene solo 2 dígitos, convertirlo a 4 (ej: "10" → "2010")
          anio = anio.length === 2 ? `20${anio}` : anio;

          newRow.nacimiento = `${anio}-${mes}-${dia}`; // Convertir a YYYY-MM-DD
        }
      }
    }

    return newRow;
  });

  // Insertar en la base de datos
  AlumnosModel.insertarAlumnos(renamedData, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al insertar datos", error: err });
    }
    res.json({ message: "Alumnos importados correctamente" });
  });
});

router.put("/edit/:dni", (req, res) => {
  const alumno_edit = req.body;
  alumno_edit.dni = req.params.dni;

  AlumnosModel.edit(alumno_edit, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: "Alumno editado correctamente", result });
    }
  });
});

router.delete("/delete/:dni", (req, res) => {
  const dni = req.params.dni;

  AlumnosModel.delete(dni, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `No se encontró al alumno` });
    }

    res.status(200).json({ message: `Se eliminó al alumno con dni ${dni}` });
  });
});
module.exports = router;
