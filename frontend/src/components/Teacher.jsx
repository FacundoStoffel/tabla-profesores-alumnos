import React, { useState, useEffect } from "react";
import { Button, CloseButton, Table, Form } from "react-bootstrap";
import "./../styles/teacher.css";

export default function Teacher() {
  //Estados
  const [teacher, setTeacher] = useState([]);

  // Estado para controlar si se está agregando o editando
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDNI, setSelectedDNI] = useState(null);

  const [formData, setFormData] = useState({
    apellido: "",
    nombre: "",
    dni: "",
    materia: "",
  });

  // Estado para controlar el modal
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getTeacher();
  }, []);

  const getTeacher = async () => {
    let parametros = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await fetch("https://tabla-profesores-alumnos.onrender.com/teacher", parametros);
      const result = await res.json();

      if (res.ok) {
        setTeacher(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Función para manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para abrir el modal en modo "Agregar"
  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ apellido: "", nombre: "", dni: "", materia: "" });
    setShowModal(true);
  };

  // Función para abrir el modal en modo "Editar"
  const openEditModal = (teacher) => {
    setIsEditing(true);
    setSelectedDNI(teacher.dni);
    setFormData({
      apellido: teacher.apellido,
      nombre: teacher.nombre,
      dni: teacher.dni,
      materia: teacher.materia,
    });
    setShowModal(true);
  };

  // Función para enviar datos del nuevo profesor (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = "https://tabla-profesores-alumnos.onrender.com/teacher/create";
    let method = "POST";

    if (isEditing) {
      url = `https://tabla-profesores-alumnos.onrender.com/teacher/edit/${selectedDNI}`;
      method = "PUT";
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        alert(
          isEditing
            ? "Profesor actualizado correctamente"
            : "Profesor agregado correctamente"
        );
        getTeacher();
        setShowModal(false);
      } else {
        alert("Error al guardar el profesor: " + result.message);
      }
    } catch (error) {
      console.error("Error enviando los datos:", error);
    }
  };

  const handleDelete = async (dni) => {
    if (!window.confirm("Estás seguro de eliminar a este profesor?")) return;

    try {
      const res = await fetch(`https://tabla-profesores-alumnos.onrender.com/teacher/delete/${dni}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (res.ok) {
        alert("Profesor eliminado correctamente");
        getTeacher();
      } else {
        alert("Error al eliminar al profesor: " + result.message);
      }
    } catch (error) {
      console.log("Error eliminando al profesor", error);
    }
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dni</th>
            <th>Materia</th>
            <th>
              {/* Botón para abrir el modal */}
              <Button variant="info" onClick={openAddModal}>
                Agregar Profesor
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {teacher.map((teacher, index) => (
            <tr key={index}>
              <td>{teacher.nombre_completo}</td>
              <td>{teacher.dni}</td>
              <td>{teacher.materia}</td>
              <td>
                <Button
                  onClick={() => openEditModal(teacher)}
                  variant="info"
                  className="btn"
                >
                  Editar
                </Button>
                <Button
                  onClick={() => handleDelete(teacher.dni)}
                  variant="info"
                  className="btn"
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">
              <h2>{isEditing ? "Editar Profesor" : "Agregar Profesor"}</h2>
              <CloseButton
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></CloseButton>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2" controlId="formBasicEmail">
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
              <Form.Group className="mb-2" controlId="formBasicEmail">
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
              <Form.Group className="mb-2" controlId="formBasicEmail">
                <Form.Label>DNI:</Form.Label>
                <Form.Control
                  type="number"
                  name="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  required
                  disabled={isEditing} // Deshabilitado si estamos editando
                />
              </Form.Group>
              <br />
              <Form.Group className="mb-2" controlId="formBasicEmail">
                <Form.Label>Materia:</Form.Label>
                <Form.Control
                  type="text"
                  name="materia"
                  value={formData.materia}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <br />
              <Form.Group className="mb-2" controlId="formBasicEmail">
                <Button type="submit" variant="info">
                  {isEditing ? "Actualizar" : "Agregar"}
                </Button>
              </Form.Group>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}
