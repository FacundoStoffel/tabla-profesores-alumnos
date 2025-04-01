import React, { useState } from "react";
import { Button, CloseButton, Table, Form } from "react-bootstrap";

export default function ImportStudent({ onClose, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [columnas, setColumnas] = useState([]);
  const [datosPreview, setDatosPreview] = useState([]);
  const [filename, setFilename] = useState("");
  const [mapping, setMapping] = useState({});

  const camposBD = [
  {label: "Apellido", value: "apellido"},
    {label:"Nombre", value:"nombre"},
    {label:"Nacimiento", value:"nacimiento"},
    {label:"Dni", value:"dni"},
    {label:"Localidad", value:"localidad"},
    {label:"Domicilio", value:"domicilio"},
    {label:"Curso", value:"curso"},
  ];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("archivo", file);

    const res = await fetch("http://localhost:8080/students/subir_excel", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setColumnas(data.columnas);
    setDatosPreview(data.datos);
    setFilename(data.filename);
  };

  const handleMappingChange = (campo, columnaExcel) => {
    setMapping((prev) => ({
      ...prev,
      [campo]: columnaExcel,
    }));
  };

  const handleGuardar = async () => {
    const camposRequeridos = [
      "apellido",
      "nombre",
      "nacimiento",
      "dni",
      "localidad",
      "domicilio",
      "curso",
    ];
    const incompletos = camposRequeridos.filter((c) => !mapping[c]);

    if (incompletos.length > 0) {
      alert(`Faltan mapear los siguientes campos: ${incompletos.join(", ")}`);
      return;
    }

    const confirmar = window.confirm(
      `Se van a guardar ${datosPreview.length} alumnos. ¿Deseás continuar?`
    );

    if (!confirmar) return;

    const res = await fetch("http://localhost:8080/students/guardar_alumnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mapping, filename }),
    });

    const result = await res.json();
    if (res.ok) {
      alert(result.message || "Alumnos guardados correctamente");
      onImportSuccess();
      onClose();
    } else {
      console.error("Error del servidor:", result);
      alert(result.message || "Error al guardar alumnos");
    }
  };

  return (
    <div>
      <div className="modal-title">
        <h2>Importar alumnos desde Excel</h2>
        <CloseButton className="btn-close" onClick={onClose}></CloseButton>
      </div>
      <Form.Control type="file" onChange={handleFileChange} />
      <Button variant="info" className="btn-excel" onClick={handleUpload}>
        Subir archivo
      </Button>

      {columnas.length > 0 && (
        <>
          <h3>Vista previa</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                {columnas.map((col, i) => (
                  <th key={i}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datosPreview.map((fila, i) => (
                <tr key={i}>
                  {columnas.map((col, j) => (
                    <td key={j}>{fila[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>

          <h3>Mapear columnas</h3>
          {camposBD.map((campo) => (
            <div key={campo.value}>
              <Form.Group className="mb-2" controlId="formBasicEmail">
                <Form.Label>{campo.label}: </Form.Label>
                <Form.Select
                  value={mapping[campo.value] || ""}
                  onChange={(e) => handleMappingChange(campo.value, e.target.value)}
                >
                  <option value="">Seleccionar columna...</option>
                  {columnas.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          ))}
          <h4>Resumen</h4>
          <p>
            Se encontraron <strong>{datosPreview.length}</strong> registros en
            el archivo Excel.
          </p>
          <Button variant="info" onClick={handleGuardar}>
            Guardar alumnos
          </Button>
        </>
      )}
    </div>
  );
}
