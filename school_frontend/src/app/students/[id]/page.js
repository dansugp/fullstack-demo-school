"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "http://localhost:8000"; // ajusta si es diferente

export default function StudentDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/students/${id}/`);

        if (!response.ok) {
          throw new Error("Error al cargar estudiante");
        }

        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  if (loading) return <p className="p-4">Cargando...</p>;

  if (!student) return <p className="p-4">Estudiante no encontrado</p>;

  return (
    <div className="p-6 max-w-md mx-auto border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Detalle del estudiante</h2>

      <p className="mb-2">
        <strong>Nombre:</strong> {student.full_name}
      </p>

      <p className="mb-2">
        <strong>Email:</strong> {student.email}
      </p>

      <p className="mb-4">
        <strong>Código:</strong> {student.code}
      </p>

      <Button onClick={() => router.push("/")}>
        Volver
      </Button>
    </div>
  );
}
