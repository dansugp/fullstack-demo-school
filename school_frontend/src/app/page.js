"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const API_BASE_URL = "http://localhost:8000";

export default function Home() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [ordering, setOrdering] = useState("full_name");
  const [currentPage, setCurrentPage] = useState(1);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const loadStudents = async () => {
    const url = `${API_BASE_URL}/students/?search=${query}&ordering=${ordering}&page=${currentPage}`;
    const res = await fetch(url);
    const data = await res.json();

    setStudents(data.results || []);
    setNext(data.next);
    setPrevious(data.previous);
  };

  const orderingClickHandler = (button) => {
    if (button === "name_button") {
      if (ordering === "full_name") setOrdering("-full_name");
      else setOrdering("full_name");
    } else {
      if (ordering === "code") setOrdering("-code");
      else setOrdering("code");
    }
  };

  useEffect(() => {
    loadStudents();
  }, [query, ordering, currentPage]);
const onSubmit = async (data) => {
  console.log("Submitting data: ", data);
  const response = await fetch(`${API_BASE_URL}/students/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (response.ok) {
    const newStudent = await response.json();
    await loadStudents();
    toast.success("Estudiante agregado con éxito");
  } else {
    const errorData = await response.json();
    console.error("Error adding student: ", errorData);

    let errorMessage = "";
    for (const key in errorData) {
      errorMessage += `${key}: ${errorData[key]}\n`;
    }

    toast.error("Error al agregar el estudiante", {
      description: errorMessage,
    });
  }
};

  return (
    <Card className="w-96 mx-auto mt-4">
      <CardHeader>
        <CardTitle>Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button
            variant="outline"
            onClick={() => {
              orderingClickHandler("name_button");
            }}
          >
            {ordering === "full_name" ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              orderingClickHandler("code_button");
            }}
          >
            {ordering === "code" ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </Button>
        </div>
        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <Pagination className="my-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => previous && setCurrentPage(currentPage - 1)}
                disabled={!previous}
                variant="outline"
                className={!previous ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => next && setCurrentPage(currentPage + 1)}
                disabled={!next}
                variant="outline"
                className={!next ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="p-4 h-96 overflow-y-auto">
          <ul>
            {students.map((student) => (
              <li
                key={student.code}
                onClick={() => router.push(`/students/${student.id}`)}
                className="text-md font-medium my-2 flex flex-row justify-between cursor-pointer hover:underline"
                title={student.email}
              >
                <div>{student.full_name}</div>
                <div>{student.code}</div>
              </li>
            ))}
          </ul>
        </div>
        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4">Crear estudiante</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear estudiante</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Field className="mt-4">
                  <FieldLabel htmlFor="full_name">Nombre completo</FieldLabel>
                  <Input
                    id="full_name"
                    placeholder="Ingresa el nombre"
                    {...register("full_name", { required: true })}
                  />
                </Field>

                <Field className="mt-4">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    placeholder="Ingresa el email"
                    {...register("email", { required: true })}
                  />
                </Field>

                <Field className="mt-4">
                  <FieldLabel htmlFor="code">Código</FieldLabel>
                  <Input
                    id="code"
                    placeholder="Ingresa el código"
                    {...register("code", { required: true })}
                  />
                </Field>

                <Field>
                  <FieldLabel>Grupo</FieldLabel>
                  <select
                    className="border rounded-md p-2 w-full"
                    {...register("group")}
                  >
                    <option value="">Sin grupo</option>
                    <option value="1">Grupo 1</option>
                  </select>
                </Field>

                <Button type="submit" onClick={handleSubmit(onSubmit)}>
                  Guardar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
