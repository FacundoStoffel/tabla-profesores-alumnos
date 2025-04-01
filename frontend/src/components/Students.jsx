import React, { useState, useEffect } from "react";
import ImportStudent from "./ImporStudent";
import { Button, CloseButton, Table, Form } from "react-bootstrap";

export default function Students() {
  //Estados
  const [student, setStudent] = useState([]);

  //Editar alumnos
  const [selectedDNI, setSelectedDNI] = useState(null);

  const [formData, setFormData] = useState({
    apellido: "",
    nombre: "",
    nacimiento: "",
    dni: "",
    localidad: "",
    domicilio: "",
    curso: "",
  });

  // Estado para controlar el modal
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    getStudent();
  }, []);

  // Función para manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getStudent = async () => {
    let parametros = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await fetch("http://localhost:8080/students", parametros);
      const result = await res.json();

      if (res.ok) {
        setStudent(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Función para abrir el modal en modo "Editar"
  const openEditModal = (alumno) => {
    setSelectedDNI(alumno.dni);
    setFormData({
      apellido: alumno.apellido,
      nombre: alumno.nombre,
      nacimiento: alumno.nacimiento.split("T")[0],
      dni: alumno.dni,
      localidad: alumno.localidad,
      domicilio: alumno.domicilio,
      curso: alumno.curso,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = `http://localhost:8080/students/edit/${selectedDNI}`;
    let method = "PUT";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Alumno actualizado correctamente");
        getStudent();
        setShowModal(false);
      } else {
        alert("Error al guardar el alumno: " + result.message);
      }
    } catch (error) {
      console.error("Error enviando los datos:", error);
    }
  };

  const handleDelete = async (dni) => {
    if (!window.confirm("Estás seguro de eliminar a este alumno?")) return;

    try {
      const res = await fetch(`http://localhost:8080/students/delete/${dni}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (res.ok) {
        alert("Alumno eliminado correctamente");
        getStudent();
      } else {
        alert("Error al eliminar al alumno: " + result.message);
      }
    } catch (error) {
      console.log("Error eliminando al alumno", error);
    }
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "";

    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Apellido</th>
            <th>Nombre</th>
            <th>Nacimiento</th>
            <th>DNI</th>
            <th>Localidad</th>
            <th>Domicilio</th>
            <th>Curso</th>
            <th>
              <Button
                onClick={() => setShowImportModal(true)}
                variant="success"
              >
                <img className="excel" src="./sobresalir (1).png" alt="logo-excel"/>
                Importar Excel
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {student.map((student, index) => (
            <tr key={index}>
              <td>{student.apellido}</td>
              <td>{student.nombre}</td>
              <td>{formatearFecha(student.nacimiento)}</td>
              <td>{student.dni}</td>
              <td>{student.localidad}</td>
              <td>{student.domicilio}</td>
              <td>{student.curso}</td>
              <td>
                <Button
                  onClick={() => openEditModal(student)}
                  className="btn"
                  variant="info"
                >
                  Editar
                </Button>
                <Button
                  onClick={() => handleDelete(student.dni)}
                  className="btn"
                  variant="info"
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ImportStudent
              onClose={() => setShowImportModal(false)}
              onImportSuccess={getStudent}
            />
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">
              <h2>Editar Alumno</h2>
              <CloseButton
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></CloseButton>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-0" controlId="formBasicEmail">
                <Form.Label>Apellido:</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <br />
              <Form.Group className="mb-0" controlId="formBasicEmail">
                <Form.Label>Nombre:</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <br />
              <Form.Group className="mb-0" controlId="formBasicEmail">
                <Form.Label>Nacimiento:</Form.Label>
                <Form.Control
                  type="date"
                  name="nacimiento"
                  value={formData.nacimiento}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <br />
              <Form.Group className="mb-0" controlId="formBasicEmail">
                <Form.Label>DNI:</Form.Label>
                <Form.Control
                  type="number"
                  name="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  required
                  disabled={true}
                />
              </Form.Group>
              <br />
              <Form.Group className="mb-0" controlId="formBasicEmail">
                <Form.Label>Localidad:</Form.Label>
                <Form.Control
                  type="text"
                  name="localidad"
                  value={formData.localidad}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <br />
              <Form.Group className="mb-0" controlId="formBasicEmail">
                <Form.Label>Domicilio:</Form.Label>
                <Form.Control
                  type="text"
                  name="domicilio"
                  value={formData.domicilio}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <br />
              <Form.Group className="mb-0" controlId="formBasicEmail">
                <Form.Label>Curso:</Form.Label>
                <Form.Control
                  type="text"
                  name="curso"
                  value={formData.curso}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <br />
              <Form.Group className="mb-0" controlId="formBasicEmail">
                <Button variant="info" type="submit">
                  {"Actualizar"}
                </Button>
              </Form.Group>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}
