# Checklist — Plataforma Flor de Luz

> Detalle de cada tarea (criterios, verificación, dependencias) en `tasks/plan.md`. Marcar acá a medida que se cierra.
> Actualizado: lun 12/10/2026. Primer encuentro: sáb 24/10. **Vista previa lista** (landing, inscripción, aula y panel con datos de ejemplo), subida a GitHub. [x] hecho · [~] hecho a medias · [ ] pendiente.

## Fase 0 — Preparación (en paralelo, sin código) · dom 11/10 a mié 14/10
- [ ] **P1** Prueba de grabación con **Fathom** (decidido 12/10): qué link da, si se abre sin cuenta, si deja descargar el MP4 ⚠️ *la más crítica*
- [ ] **P2** Reunir contenidos. Recibido: logo y flyer, alias, firma (Victoria Salami). **Falta:** WhatsApp, link de Meet, texto y programa reales, PDF cuestionario, gráfico 7 grupos, foto de la flor sin texto, confirmar regla de la seña
- [~] **P3** Cuentas: repo GitHub ✅, hosting = Vercel ✅, **proyecto Supabase `flor-de-luz` creado ✅** (ref `oszjytxfzsafhqolsvox`, us-east-1). **Falta:** desactivar registro público (Auth > Sign In / Providers > "Allow new users to sign up" OFF), pegar `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`, `vercel login` y acceso de la app de GitHub de Vercel al repo

## Fase 1 — Cimientos
- [x] **T1** Proyecto base + sistema de diseño Flor de Luz (mobile-first). Playwright se instala más adelante
- [x] **T2** Cálculo de seña y cuotas (29 tests en verde)
- [x] **T3** Base de datos + RLS + buckets + pruebas de RLS (2026-10-13): migración `supabase/migrations/20261013000000_esquema_inicial.sql` aplicada, 40 comprobaciones de seguridad OK (`supabase/tests/rls.sql`), cuotas generadas por trigger en la base
- [ ] **PENDIENTE TEXTOS (Lucas, más tarde):** Victoria debe revisar/reemplazar lo escrito por Claude en `src/content/curso.ts`: programa de los 5 encuentros, qué incluye, bajada, preguntas frecuentes; más un párrafo de presentación suyo (sección "sobre mí" de la landing, hoy placeholder), foto, y política de cancelación/términos si tiene. Confirmar con prueba real que el botón de WhatsApp (5493425250399) abre el chat.
- [ ] **T4** Auth y roles (`proxy.ts`, login, admin)
- [ ] ✅ **Checkpoint A**

## Fase 2 — Inscripción · **M1: vie 16/10**
- [~] **T5** Landing pública: hecha con textos de ejemplo; falta Lighthouse y los textos reales
- [x] **T6** Formulario de inscripción: guarda en Supabase (2026-10-16), duplicados por email y campo trampa; en producción. **Falta** límite por IP (opcional)
- [~] **T7** Confirmación y datos de pago: hecha; falta cargar el WhatsApp de Victoria
- [~] **T8** Admin: inscripciones: maqueta con datos de ejemplo; falta conectarla a la base
- [ ] ✅ **Checkpoint M1** (probado en iPhone y Android; Victoria aprueba textos)

## Fase 3 — Aula · **M2: jue 22/10**
- [ ] **T9** Habilitar alumnos (contraseña temporal)
- [~] **T10** Aula: inicio (próximo encuentro + Meet): maqueta funcionando con datos de ejemplo
- [~] **T11** Página de clase: maqueta lista; el reproductor ya distingue YouTube de otros links (Fathom)
- [~] **T12** Admin: gestión de clases: maqueta sin funciones
- [~] **T13** Biblioteca: maqueta con las 4 secciones (incluye el espacio para el gráfico)
- [ ] ✅ **Checkpoint M2** (ensayo general con Victoria)

## Sáb 24/10 — Primer encuentro 🎓

## Fase 4 — Primera clase real · **M3: vie 30/10**
- [ ] **T14** Guía de 1 página + clase 1 publicada por Victoria + ajustes

## Fase 5 — Cierre · **M4: antes del 5/12**
- [ ] **T15** Examen final
- [ ] **T16** Diploma PDF
- [ ] **T17** Verificación pública del diploma
- [ ] ✅ **Checkpoint M4**

## Fase 6 — Entrega · antes del 12/12
- [ ] **T18** Pulido, accesibilidad, dispositivos reales
- [ ] **T19** Seguridad final, respaldo, README, contexto del workspace
