/**
 * Contenido editable de la formación. Todo lo que se lee en la landing sale de
 * acá, así que para cambiar un texto se edita este archivo y nada más.
 *
 * BORRADOR: el programa y las descripciones son una propuesta inicial armada a
 * partir del flyer. Reemplazar por el texto real de Victoria.
 */
export const CURSO = {
  marca: "Flor de Luz",
  docente: "Victoria Salami",
  titulo: "Terapia floral",
  subtitulo: "Sistema Bach",
  nombreCompleto: "Formación en Terapia Floral Sistema Bach",
  complemento: "con Sistemas de Diagnóstico",
  bajada:
    "Una formación online para aprender el Sistema Bach paso a paso, en vivo y con todo el material disponible para repasar cuando quieras.",
  modalidad: "5 encuentros online en vivo por Meet",
  horario: "Sábados de 9:30 a 12:00",
  periodo: "De octubre a diciembre de 2026",
} as const;

export const COBRO = {
  alias: "comadre.tierra.mp",
  titular: "Victoria Salami",
} as const;

export const INCLUYE = [
  "5 encuentros en vivo por Meet",
  "Cada clase grabada para verla cuando quieras",
  "PDF de cada clase",
  "Biblioteca con el cuestionario y el gráfico de los 7 grupos emocionales",
  "Espacio para entregar el examen final",
  "Diploma de la formación firmado por Victoria Salami",
] as const;

export const PROGRAMA = [
  {
    orden: 1,
    titulo: "Introducción al Sistema Bach",
    puntos: [
      "Quién fue el Dr. Edward Bach y cómo nació el sistema",
      "Principios de la terapia floral",
      "Cómo se preparan y se usan las esencias",
    ],
  },
  {
    orden: 2,
    titulo: "Los 7 grupos emocionales",
    puntos: [
      "Miedo, incertidumbre, desinterés, soledad, hipersensibilidad, abatimiento y preocupación excesiva por los demás",
      "Cómo se agrupan las 38 esencias",
    ],
  },
  {
    orden: 3,
    titulo: "Las esencias, una por una",
    puntos: [
      "Qué estado emocional trabaja cada flor",
      "Cómo reconocer cada estado en una consulta",
    ],
  },
  {
    orden: 4,
    titulo: "Sistemas de diagnóstico",
    puntos: [
      "Diagnóstico con péndulo y gráfico de los 7 grupos",
      "El cuestionario como herramienta de consulta",
    ],
  },
  {
    orden: 5,
    titulo: "Integración y casos",
    puntos: [
      "Armado de una fórmula personalizada",
      "Repaso general y preparación del examen final",
    ],
  },
] as const;

export const PREGUNTAS_FRECUENTES = [
  {
    pregunta: "¿Necesito conocimientos previos?",
    respuesta:
      "No. La formación empieza desde cero y avanza de a poco, así que sirve tanto para quien recién se acerca como para quien ya conoce algo del tema.",
  },
  {
    pregunta: "¿Qué pasa si no puedo asistir a un encuentro en vivo?",
    respuesta:
      "Todas las clases quedan grabadas en la plataforma, con su PDF, para que las veas cuando puedas.",
  },
  {
    pregunta: "¿Cómo reservo mi lugar?",
    respuesta:
      "Completás el formulario, elegís cómo querés pagar y transferís la seña de inscripción de $60.000, que después se descuenta del total. Cuando Victoria la confirma, te habilita el acceso al aula.",
  },
  {
    pregunta: "¿Cómo recibo el diploma?",
    respuesta:
      "Al aprobar el examen final, el diploma queda disponible para descargar desde tu perfil en la plataforma.",
  },
] as const;
