# Plan de implementación: Plataforma Flor de Luz — Formación en Terapia Floral Sistema Bach

> Base: `SPEC.md` v2 (2026-10-11). Estado del plan: **para aprobación**. Checklist ejecutable: `tasks/todo.md`.

## Resumen

Una web privada, pensada primero para el celular, con tres piezas: **(1)** una landing y un formulario de inscripción públicos, **(2)** un aula tipo Classroom para los alumnos (próximo encuentro con link de Meet, clases en video + PDF, biblioteca, examen final, diploma) y **(3)** un panel simple para Victoria. Los pagos se hacen por fuera (alias `comadre.tierra.mp`). Se construye con Next.js 16 + Supabase + Vercel, igual que ElOutletDelPrecio.

## Cómo se logra que "salga bien a la primera"

Un plan no garantiza eso. Lo que sí lo hace probable son siete decisiones, y las tomé al armar esto:

1. **Lo urgente va primero y lo que depende de otros, se destraba ya.** El flyer dice "Inscripciones abiertas": el formulario sale antes que el aula. Y las tres cosas que no dependen de código (que Victoria pueda grabar, juntar sus contenidos, crear las cuentas) arrancan **hoy, en paralelo**.
2. **Cortes verticales.** Cada tarea entrega algo que funciona de punta a punta (pantalla + datos + seguridad), no "toda la base" y después "toda la pantalla".
3. **La seguridad se prueba, no se supone.** Las reglas de acceso (RLS) de la base se verifican con consultas reales de un visitante, un alumno y la docente. Es el error clásico de este tipo de plataforma: que la pantalla esconda algo que la base igual entrega.
4. **Probar en celulares reales, no solo en el simulador de la computadora.** iPhone y Android, en cada hito.
5. **Ensayo general con Victoria antes del 24/10.** Que ella cargue una clase de prueba sola. Si necesita ayuda en el ensayo, no está listo.
6. **Menos piezas que puedan fallar.** Sin pasarela de pagos, sin emails automáticos, sin streaming propio. Cada cosa que no se construye es algo que no se rompe.
7. **Plan B para lo crítico.** Si el aula no estuviera lista el 24/10, las clases igual se dan por Meet y las grabaciones se comparten por link de YouTube hasta que esté. No hay forma de que la plataforma frene el curso.

## Decisiones de arquitectura

| Decisión | Por qué |
|---|---|
| **Next.js 16 (App Router) + TypeScript + CSS Modules** | Es el stack ya probado en ElOutletDelPrecio; se reaprovechan sus lecciones (`proxy.ts` en vez de middleware, `updateTag` en server actions) |
| **Supabase** (Postgres + Auth + Storage), proyecto nuevo | Auth con roles y reglas por fila (RLS) cubren el acceso privado sin escribir un backend |
| **Contraseña temporal creada por Victoria, no invitación por email** | El envío de emails del plan gratuito de Supabase tiene un límite de muy pocos por hora: invitar a un grupo entero fallaría. La docente copia un mensaje de bienvenida y lo manda por WhatsApp |
| **Registro público de Supabase desactivado** | Solo se entra con una cuenta que crea la docente. Es la lección de seguridad de la tienda de Alan |
| **Clave `service_role` solo en el servidor** | Se usa únicamente en server actions de `/admin` (crear alumnos, resetear contraseñas). Nunca llega al navegador |
| **YouTube no listado + embed `youtube-nocookie.com`** | Cero costo y reproductor confiable en celular. Se acepta que el link no es estrictamente privado (grupo chico) |
| **Archivos en buckets privados con URL firmada de corta duración** | Los PDF y exámenes no son públicos |
| **Fechas con zona horaria explícita `America/Argentina/Buenos_Aires`** | Vercel corre en UTC: sin esto, "próximo encuentro" cambiaría de día a las 21:00 |
| **PDF de clase: botón "Abrir / descargar", no un visor incrustado** | Los visores PDF dentro de la página se comportan mal en iPhone |
| **Campos de formulario con fuente ≥ 16 px y botones ≥ 48 px** | Evita el zoom automático de iOS y hace usable la web con una mano |
| **Diploma generado con `@react-pdf/renderer` en el servidor** | Sin servicios externos; el código de verificación queda en la base |

## Mapa de dependencias

```
Cuentas (GitHub, Supabase, Vercel) ──┐
Contenidos de Victoria ──────────────┤
                                     ▼
T1 Scaffold + diseño ─► T2 Cálculo de cuotas ─┐
        │                                      ▼
        └──────────► T3 Base de datos + RLS ─► T4 Auth y roles
                                                  │
              ┌───────────────────────────────────┤
              ▼                                   ▼
   T5 Landing ─► T6 Formulario ─► T7 Confirmación   T8 Admin: inscripciones
                                                  │
                                                  ▼
                              T9 Habilitar alumno ─► T10 Aula (inicio)
                                                         │
                                       T12 Admin: clases ─► T11 Página de clase
                                                         │
                                                         ▼
                                                 T13 Biblioteca
                                                         │
                                                         ▼
                                     T14 Primera clase real (con Victoria)
                                                         │
                                                         ▼
                                  T15 Examen ─► T16 Diploma ─► T17 Verificación
                                                         │
                                                         ▼
                                    T18 Pulido, accesibilidad, dispositivos
                                                         │
                                                         ▼
                                       T19 Seguridad final + entrega
```

## Calendario

| Hito | Fecha objetivo | Tareas |
|---|---|---|
| Fase 0 (en paralelo a todo) | **dom 11/10 a mié 14/10** | P1, P2, P3 |
| **M1 — Se pueden inscribir** | **vie 16/10** | T1 a T8 |
| **M2 — Aula lista para el primer encuentro** | **jue 22/10** | T9 a T13 + ensayo con Victoria |
| **Sáb 24/10 — Primer encuentro** | | Ya con la plataforma andando y el link de Meet en el aula |
| **M3 — Primera clase publicada por Victoria** | **vie 30/10** | T14 |
| **M4 — Examen y diploma** | **antes del 5/12** | T15 a T17 |
| Entrega final | **antes del 12/12** | T18, T19 |

Hay margen: M1 y M2 caen dentro de las dos semanas disponibles, con unos días de colchón antes del 24/10 para lo que salga mal.

---

# Fase 0 — Preparación (sin código, en paralelo)

### P1. Prueba de grabación con Fathom — **la más crítica de todo el proyecto**
**Quién:** Victoria, con Lucas al lado. **Cuándo:** esta semana, nunca después del jueves 22/10.
**Descripción:** Las clases se graban con Fathom (decidido el 12/10). Falta comprobar qué entrega exactamente, porque de eso depende cómo se muestra la clase en el aula.
**Criterios:**
- [ ] Victoria abre una reunión de Meet de prueba con Fathom, graba 2 minutos y encuentra la grabación en su cuenta de Fathom.
- [ ] Se anota **qué link da** para compartir y si se abre **sin iniciar sesión** en el celular de otra persona.
- [ ] Se anota si Fathom permite **descargar el video** (MP4) en su plan.
- [ ] Decisión: si el link de Fathom se abre sin cuenta, el aula lo usa directamente (botón "Ver la clase"); si hay MP4 descargable, se puede subir a YouTube no listado para reproducirlo dentro de la página. Si ninguna sirve: plan B con OBS.
**Verificación:** el link de la prueba se abre en el celular de Lucas, sin sesión iniciada.

### P2. Reunir los contenidos de Victoria
**Pedir (en un solo mensaje):** número de WhatsApp para el formulario · link de Meet (fijo o por clase) · logo con fondo transparente (PNG o vectorial) · descripción y programa del curso, a quién va dirigido, qué incluye · PDF del cuestionario · gráfico de los 7 grupos emocionales (alta resolución) · si tiene términos y condiciones o política de cancelación · cómo quiere firmar el diploma (firma escaneada o solo nombre) · confirmar la regla de descuento de la seña.
**Criterios:** carpeta compartida con todo, con nombres claros. Lo que no exista se anota como "a crear" y se prioriza por hito.

### P3. Cuentas y proyectos
**Quién:** Lucas (hay pasos que solo puede hacer él).
- [ ] Repo de GitHub **vacío** creado a mano (no hay `gh` instalado); Lucas confirma la URL exacta antes de hacer el primer push.
- [ ] Proyecto Supabase nuevo; registro público **desactivado** desde el día uno; anotar URL y claves en un `.env.local` fuera de git.
- [ ] Proyecto Vercel vinculado al repo.
- [ ] Decidir el plan de hosting (ver Preguntas abiertas #13 del spec).

---

# Fase 1 — Cimientos

### T1. Proyecto base y sistema de diseño
**Descripción:** Crear el proyecto, el sistema visual de Flor de Luz y la estructura de layouts, pensado para 360 px.
**Criterios:**
- [ ] Next.js 16 + TypeScript estricto + ESLint + Vitest + Playwright configurados; `npm run build` limpio.
- [ ] Tokens de color y tipografía en `tokens.css` (paleta del spec ajustada tomando muestras del logo y flyer reales); fuentes cargadas con `next/font`.
- [ ] Logo y flyer optimizados en `public/` (sin el nombre `WhatsApp Image…`), con el logo sobre fondo claro resuelto (transparente si Victoria lo mandó; si no, recorte propio).
- [ ] Componentes base: botón (≥ 48 px), campo de formulario (≥ 16 px), tarjeta, encabezado y pie, contenedor. Documentados en una página interna de muestra.
- [ ] Contraste AA verificado en los pares de color que se usan.
**Verificación:** `npm run build`, `npm run lint`, `npx tsc --noEmit`; captura de la página de muestra a 360, 390 y 768 px, revisada a ojo contra el flyer.
**Dependencias:** P3 (repo). **Alcance:** M (≈5 archivos de configuración + estilos + componentes).

### T2. Cálculo de seña y cuotas (con tests primero)
**Descripción:** La lógica de plata, aislada y probada, antes de que ninguna pantalla la use. Tres planes, seña de 60.000 descontada de las primeras cuotas.
**Criterios:**
- [ ] `calcularCuotas` devuelve `[240000]`, `[110000, 170000]` y `[20000, 80000, 80000, 80000, 80000]` para los tres planes.
- [ ] Los montos son enteros en pesos (sin decimales flotantes); seña y precios salen de una configuración central.
- [ ] Función de formato de moneda argentina (`$ 240.000`).
- [ ] Casos borde: plan con cuota menor que la seña, plan desconocido, monto en cero.
**Verificación:** `npm test` en verde, con el test escrito **antes** de la función y viéndolo fallar primero.
**Dependencias:** T1. **Alcance:** S (2 archivos).

### T3. Base de datos con reglas de acceso (RLS) y almacenamiento
**Descripción:** Esquema completo del spec en migraciones SQL versionadas, con RLS en cada tabla, buckets privados y los tres planes cargados.
**Criterios:**
- [ ] Tablas: `planes`, `inscripciones`, `perfiles`, `clases`, `material`, `cuotas`, `examenes`, `diplomas`, con claves y restricciones.
- [ ] RLS activado en **todas**. Un visitante anónimo solo puede **insertar** una inscripción (nunca leer ninguna). Un alumno solo lee sus datos, clases `publicada`s y material; solo la docente escribe contenido.
- [ ] Buckets privados: `clases-pdf`, `biblioteca`, `examenes`, `diplomas`, con políticas por rol.
- [ ] Seed de planes e **idempotente** (volver a correrlo no duplica ni pisa datos; lección del `seed` de la tienda de Alan).
- [ ] Función auxiliar `es_admin()` usada en las políticas.
**Verificación:** `npx supabase db push` sin errores; **script de pruebas de RLS** que ejecuta consultas como anónimo, como alumno A, como alumno B y como admin y comprueba cada permiso y cada negativa (mensaje esperado: `42501` o cero filas).
**Dependencias:** P3. **Alcance:** M (1 a 3 migraciones + script de prueba). *Va temprano porque es el riesgo más caro de arreglar tarde.*

### T4. Autenticación y roles
**Descripción:** Login por email y contraseña, sesión, protección de rutas por rol y creación de la cuenta admin de Victoria.
**Criterios:**
- [ ] `/login` funcional en celular; cerrar sesión; sesión persistente.
- [ ] `proxy.ts` protege `/aula/*` (alumno o admin) y `/admin/*` (solo admin); sin sesión redirige a `/login` conservando el destino.
- [ ] Un alumno que escribe `/admin` en la barra **no entra** y no ve nada.
- [ ] Cuenta admin de Victoria creada y verificada; cuenta admin de Lucas para soporte.
- [ ] Cambio de contraseña obligatorio cuando la cuenta tiene clave temporal.
**Verificación:** Playwright: sin sesión → redirige; alumno → no accede a `/admin`; admin → accede. Probado con un usuario temporal que se borra al final.
**Dependencias:** T3. **Alcance:** M (≈5 archivos).

### ✅ Checkpoint A — Cimientos
- [ ] Build, lint, typecheck y tests en verde.
- [ ] Pruebas de RLS: visitante, alumno A, alumno B y admin, todas pasan.
- [ ] Deploy de prueba en Vercel funcionando.
- [ ] Revisión con Lucas antes de seguir.

---

# Fase 2 — Inscripción (M1, viernes 16/10)

### T5. Landing pública
**Descripción:** La portada de la formación, continuación del flyer: foto de la anémona, título, fechas, programa, planes y precios, y llamado a inscribirse.
**Criterios:**
- [ ] Hero con la foto del flyer y el título "Terapia floral — Sistema Bach", legible sobre la foto (capa morada).
- [ ] Sección de los 5 encuentros con fecha y horario (sáb 09:30 a 12:00), el programa, quién la dicta (Victoria Salami / Flor de Luz) y los tres planes con su total y la nota de la seña.
- [ ] Un solo llamado a la acción claro ("Quiero inscribirme") que lleva al formulario; botón de WhatsApp secundario.
- [ ] Metadatos para compartir en WhatsApp (título, descripción y imagen de vista previa).
- [ ] Textos del borrador marcados para que Victoria los corrija.
**Verificación:** Lighthouse móvil con accesibilidad ≥ 95 y rendimiento ≥ 90; revisada a 360, 390 y 768 px; vista previa del link probada pegándolo en WhatsApp.
**Dependencias:** T1, T2, P2. **Alcance:** M (3 a 5 archivos).

### T6. Formulario de inscripción (guardar)
**Descripción:** El formulario de punta a punta: pantalla, validación, guardado y protección contra spam.
**Criterios:**
- [ ] Campos: nombre y apellido, email, WhatsApp, país/ciudad, plan (3 opciones con la seña y el calendario de cuotas que se actualizan al elegir), aceptación de términos.
- [ ] Validación con esquema (zod) en el **servidor** además del navegador; errores claros en español junto a cada campo.
- [ ] Teclado correcto en el celular (email, número de teléfono).
- [ ] Un mismo email no puede inscribirse dos veces (mensaje amable, sin revelar datos de otras personas).
- [ ] Honeypot y límite de intentos por IP.
- [ ] Guarda la inscripción como `pendiente` junto con las cuotas calculadas.
**Verificación:** unit tests del esquema; Playwright de inscripción completa a 390 px; intentar enviar vacío, con email inválido y duplicado; confirmar en la base que el visitante **no puede leer** lo que insertó.
**Dependencias:** T2, T3, T5. **Alcance:** M (4 a 5 archivos).

### T7. Pantalla de confirmación y de pago
**Descripción:** Lo que ve la persona después de enviar el formulario, para que sepa exactamente qué hacer.
**Criterios:**
- [ ] Muestra el plan elegido, **seña a transferir: $ 60.000**, alias `comadre.tierra.mp` con botón "Copiar", titular **Victoria Salami**, y el calendario de cuotas restantes.
- [ ] Botón de WhatsApp a Victoria con un mensaje ya escrito ("Hola Victoria, soy [nombre], me inscribí al plan [plan], te envío el comprobante de la seña").
- [ ] Texto claro: "Tu lugar queda reservado cuando Victoria confirme la seña".
- [ ] Si se recarga la página, la información sigue ahí (no depende de estado temporal).
- [ ] El botón "Copiar" funciona en iPhone y Android.
**Verificación:** Playwright; prueba manual en los dos sistemas; verificar que el alias mostrado coincide exactamente con el del spec.
**Dependencias:** T6. **Alcance:** S (2 a 3 archivos).

### T8. Panel de la docente: inscripciones
**Descripción:** La primera vista de `/admin`: ver y gestionar las inscripciones, simple y cómoda en celular.
**Criterios:**
- [ ] Lista de inscripciones con nombre, plan, estado y fecha; búsqueda por nombre/email; filtro por estado.
- [ ] Detalle de una inscripción: datos, cuotas, notas, y botones para cambiar el estado (`pendiente` → `seña recibida` → `activo` / `baja`).
- [ ] Marcar cuotas como pagadas.
- [ ] Botón "Abrir WhatsApp" con el número del alumno.
- [ ] Exportar a CSV.
- [ ] Usable a 360 px: las filas se muestran como tarjetas, no como tabla cortada.
**Verificación:** Playwright como admin; verificar con un alumno que ve cero inscripciones; revisar a 360 px.
**Dependencias:** T4, T6. **Alcance:** M (4 a 5 archivos).

### ✅ Checkpoint M1 — Se pueden inscribir (vie 16/10)
- [ ] Todo en producción en una URL de Vercel; build/lint/tests en verde.
- [ ] Inscripción real de prueba de punta a punta **desde un iPhone y un Android**.
- [ ] Victoria ve esa inscripción en su panel desde su celular y la borra.
- [ ] Victoria aprueba los textos de la landing.
- [ ] Recién entonces se le pasa el link para que lo publique junto al flyer.

---

# Fase 3 — Aula (M2, jueves 22/10)

### T9. Habilitar alumnos
**Descripción:** Convertir una inscripción en una cuenta de alumno, sin depender de emails.
**Criterios:**
- [ ] Botón "Habilitar alumno" en el detalle de una inscripción: crea el usuario (`service_role` solo en el servidor), genera una contraseña temporal legible, la muestra **una sola vez** y ofrece "Copiar mensaje de bienvenida" (link del aula + email + contraseña temporal).
- [ ] El alumno entra, se le obliga a cambiar la contraseña y llega a su aula.
- [ ] "Restablecer contraseña" genera otra temporal para el mismo alumno.
- [ ] No se puede habilitar dos veces a la misma persona.
- [ ] La clave de servicio **no aparece** en ningún bundle del navegador.
**Verificación:** Playwright del flujo completo con un usuario de prueba; `grep` del build en busca de la clave de servicio (debe dar cero resultados).
**Dependencias:** T4, T8. **Alcance:** M (4 a 5 archivos).

### T10. Aula: pantalla de inicio del alumno
**Descripción:** La primera pantalla que ve un alumno al entrar.
**Criterios:**
- [ ] Saludo con su nombre; tarjeta **"Próximo encuentro"** con fecha, horario y botón **"Entrar a Meet"** (solo si hay un link cargado).
- [ ] Lista de los 5 encuentros: los publicados se pueden abrir; los demás aparecen bloqueados con su fecha, sin revelar el contenido.
- [ ] Acceso rápido a Biblioteca, Examen y Mi perfil (el examen y el diploma aparecen "próximamente" hasta T15/T16).
- [ ] Navegación inferior fija para el pulgar en celular; en pantallas grandes pasa a barra lateral.
- [ ] El cálculo de "próximo encuentro" usa la zona horaria de Buenos Aires.
**Verificación:** unit test del cálculo de próximo encuentro con fechas simuladas (incluido el sábado a las 23:30 y el domingo); Playwright con alumno de prueba; revisar a 360 px.
**Dependencias:** T9. **Alcance:** M (3 a 5 archivos).

### T11. Página de clase
**Descripción:** Ver una clase: el video y su PDF.
**Criterios:**
- [ ] Video de YouTube embebido con `youtube-nocookie.com`, a ancho completo y proporción 16:9, con reproducción en pantalla completa en celular.
- [ ] Botón "Descargar PDF de la clase" con URL firmada de corta duración (no un visor incrustado).
- [ ] Título, fecha y descripción de la clase; botones "anterior / siguiente".
- [ ] Una clase en `borrador` o inexistente devuelve "no disponible" **sin revelar** si existe.
- [ ] Un visitante sin sesión no ve nada.
**Verificación:** Playwright; prueba manual en iPhone (video en pantalla completa y descarga del PDF); comprobar por consulta directa a la base que un alumno no puede leer una clase en borrador.
**Dependencias:** T3, T10. **Alcance:** M (3 a 4 archivos).

### T12. Panel de la docente: gestión de clases
**Descripción:** Que Victoria cargue y publique clases sola, en pocos pasos.
**Criterios:**
- [ ] Crear/editar una clase: orden, título, fecha del encuentro, **link de YouTube** (se valida el formato y se muestra una vista previa), subir el **PDF**, link de Meet del encuentro, descripción.
- [ ] Interruptor Borrador / Publicada con confirmación y vista previa "así lo ve el alumno".
- [ ] Los 5 encuentros ya vienen creados con sus fechas, como borradores vacíos.
- [ ] Mensajes de error comprensibles (por ejemplo, "ese link no parece de YouTube").
- [ ] Subida de PDF con tope de tamaño y tipo validado.
**Verificación:** Playwright; **prueba de usabilidad**: Victoria publica una clase de prueba sin instrucciones y se cronometra (objetivo: menos de 3 minutos).
**Dependencias:** T4, T11. **Alcance:** M (4 a 5 archivos).

### T13. Biblioteca
**Descripción:** El material de estudio, ordenado por categoría, para alumnos y para la docente.
**Criterios:**
- [ ] Cuatro secciones: **Archivos**, **PDF de las clases**, **PDF del cuestionario**, **Gráfico de los 7 grupos emocionales**.
- [ ] El alumno ve el listado, abre o descarga cada archivo; las imágenes (gráfico) se ven a pantalla completa con zoom en el celular y se pueden descargar en alta resolución.
- [ ] La docente sube, renombra, ordena y elimina material desde `/admin` (con confirmación al eliminar).
- [ ] Cargados el cuestionario y el gráfico reales de Victoria.
**Verificación:** Playwright; prueba en iPhone del zoom del gráfico con dos dedos; comprobar que un archivo no se puede abrir sin sesión aunque se conozca la ruta.
**Dependencias:** T3, T10, P2. **Alcance:** M (4 a 5 archivos).

### ✅ Checkpoint M2 — Aula lista (jue 22/10)
- [ ] Build, lint, typecheck y tests en verde.
- [ ] **Pruebas de RLS repetidas con todas las tablas nuevas.**
- [ ] **Ensayo general con Victoria**: ella habilita a un alumno de prueba, se loguea como ese alumno en su celular, ve el próximo encuentro con el link de Meet, abre la biblioteca y sube una clase de prueba sola.
- [ ] Todos los contenidos reales cargados (cuestionario, gráfico, link de Meet).
- [ ] Datos de prueba eliminados.
- [ ] Revisión con Lucas antes del sábado.

---

# Fase 4 — Primera clase real (M3, viernes 30/10)

### T14. Primera clase con Victoria y ajustes
**Descripción:** El primer uso real. Se acompaña a Victoria en el flujo completo: grabar → subir a YouTube → publicar en el aula. Lo que se rompa o confunda se arregla en el momento.
**Criterios:**
- [ ] **Guía de una página para Victoria** (con capturas): cómo grabar, subir a YouTube como no listado, publicar la clase y el PDF, habilitar a un alumno nuevo y restablecer una contraseña.
- [ ] La clase 1 se publica sin ayuda de Lucas.
- [ ] Lista de ajustes pedidos por Victoria y alumnos, priorizada; los de usabilidad se arreglan antes de la clase 2.
- [ ] Revisión de logs de errores en Vercel después del primer día de uso real.
**Verificación:** un alumno real (no Lucas ni Victoria) entra y ve la clase 1 en su celular.
**Dependencias:** T9 a T13, P1. **Alcance:** variable, con foco en pulido.

---

# Fase 5 — Cierre de la formación (M4, antes del 5/12)

### T15. Examen final
**Descripción:** El espacio separado del aula para entregar el examen.
**Criterios:**
- [ ] Sección "Examen final" con consigna (que la docente edita), fecha límite y subida de archivo (PDF, foto o Word, hasta 10 MB).
- [ ] Confirmación de entrega con fecha y hora; el alumno ve su estado (`entregado`, `aprobado`, `a rehacer`) y el comentario de la docente.
- [ ] Si la docente lo marca "a rehacer", el alumno puede volver a subir; el archivo anterior se conserva.
- [ ] La docente ve la lista de entregas, las descarga, las marca y comenta, todo desde el celular si hace falta.
- [ ] Un alumno no puede ver el examen de otro (probado con dos alumnos).
**Verificación:** Playwright con dos alumnos; prueba de subida con una foto de celular grande (se comprime o se rechaza con un mensaje claro).
**Dependencias:** T3, T10. **Alcance:** M (4 a 5 archivos).

### T16. Diploma
**Descripción:** El diploma en PDF, diseñado con la identidad de Flor de Luz, que se emite con un clic cuando el examen está aprobado.
**Criterios:**
- [ ] Diseño A4 horizontal: fondo crema, marco dorado fino, logo, "Certifica que [nombre] ha completado la Formación en Terapia Floral Sistema Bach (+ Sistemas de Diagnóstico)", fecha, firma de Victoria Salami y código de verificación único.
- [ ] La docente lo emite desde el panel solo para alumnos con examen `aprobado`.
- [ ] El alumno lo descarga desde su perfil; el nombre con tildes y la "ñ" se imprimen bien.
- [ ] El código es único y no adivinable.
- [ ] Se aprueba una **prueba impresa** antes de emitir ninguno real.
**Verificación:** unit test de generación del código; renderizar el PDF con nombres largos y con tildes; Victoria aprueba el diseño.
**Dependencias:** T15. **Alcance:** M (3 a 5 archivos).

### T17. Verificación pública del diploma
**Descripción:** Una página simple donde cualquiera ingresa el código y ve si el diploma es auténtico.
**Criterios:**
- [ ] `/verificar/[codigo]` muestra nombre del titular, formación y fecha, **sin ningún otro dato personal**.
- [ ] Un código inexistente da un mensaje neutro y no permite enumerar otros.
- [ ] Límite de intentos por IP.
**Verificación:** Playwright; intentar códigos inválidos y repetidos.
**Dependencias:** T16. **Alcance:** S (2 a 3 archivos).

### ✅ Checkpoint M4 — Cierre
- [ ] Flujo completo con datos de prueba: alumno entrega examen → Victoria lo aprueba → emite el diploma → el alumno lo descarga → el código verifica.
- [ ] Pruebas de RLS actualizadas con examen, diploma y verificación.
- [ ] Datos de prueba eliminados.

---

# Fase 6 — Endurecimiento y entrega

### T18. Pulido, accesibilidad y dispositivos reales
**Criterios:**
- [ ] Lighthouse móvil: accesibilidad ≥ 95, rendimiento ≥ 90, en landing, formulario, aula y biblioteca.
- [ ] Probado en **iPhone (Safari) y Android (Chrome)** reales, a 360, 390 y 768 px, en vertical y horizontal; sin scroll horizontal, sin elementos cortados.
- [ ] Navegación por teclado y foco visible; textos alternativos; contraste AA.
- [ ] Estados vacíos, de carga y de error cuidados (no pantallas en blanco).
- [ ] Página 404 y de error con el estilo de la marca.
**Dependencias:** M4. **Alcance:** M.

### T19. Seguridad final y entrega
**Criterios:**
- [ ] Revisión de seguridad completa (RLS, buckets, `service_role`, validación de entradas, límite de intentos, cabeceras).
- [ ] **Respaldo:** exportación de inscripciones a CSV y copia de la base verificada; procedimiento escrito para restaurar.
- [ ] Credenciales rotadas (no se reutiliza ninguna contraseña de pruebas ni se comparte por chat claves definitivas).
- [ ] README con cómo correr, desplegar, cargar clases y qué hacer si algo falla.
- [ ] Documento breve de privacidad y consentimiento (datos personales de los alumnos) visible en el formulario.
- [ ] Contexto del workspace actualizado (`CLAUDE.md`, `contexto/proyectos.md`) y memoria del proyecto.
**Dependencias:** T18. **Alcance:** S a M.

---

## Definición de "terminado" (aplica a cada tarea)

Además de sus criterios, ninguna tarea se da por cerrada sin: criterios cumplidos · funciona **corriendo** (no solo compilando) · tests nuevos que fallan sin el cambio · lint, tipos y build en verde · sin código muerto ni `console.log` · revisión de seguridad si toca datos o acceso · probada a 360 px · aprobada por Lucas antes de desplegar.

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **Victoria no puede grabar con Meet** (plan gratuito) | **Alto** | P1 esta semana; plan B con OBS o grabación de pantalla; probar antes del 24/10 |
| El aula no llega al 24/10 | Medio | Plan B: las clases se dan igual por Meet y las grabaciones se comparten por link de YouTube; el formulario (lo urgente) sale antes |
| Una regla RLS mal puesta expone clases, PDFs o exámenes | **Alto** | Pruebas de RLS con visitante/alumno A/alumno B/admin en cada checkpoint; buckets privados |
| Fuga de la clave `service_role` | **Alto** | Solo en server actions de `/admin`; `grep` del build; `.env` fuera de git |
| Emails de Supabase limitados (plan gratuito) | Medio | Contraseña temporal por WhatsApp; no se depende del email |
| Diferencias de iPhone/Safari (PDF, video, zoom, teclado) | Medio | Botón de descarga en vez de visor; fuentes ≥ 16 px; pruebas en iPhone real en cada hito |
| El logo no tiene fondo transparente | Bajo | Pedir el original; si no existe, recorte propio; probar sobre crema y morado |
| Zona horaria (Vercel en UTC) | Medio | Fecha y hora siempre con `America/Argentina/Buenos_Aires`; test de borde |
| Supabase gratuito pausa el proyecto tras 7 días sin uso y no hace copias | Medio | Uso semanal durante el curso; exportación a CSV periódica; revisar el plan al cierre |
| Vercel Hobby es "no comercial" | Bajo/Medio | Anotado como decisión abierta (#13); pasar a Pro si fuera necesario |
| Subida larga a YouTube (clases de 2,5 h) y verificación de canal | Medio | La guía lo explica; Victoria verifica su canal por teléfono antes del 24/10 |
| Spam en el formulario público | Bajo | Honeypot + límite por IP + validación en servidor |
| Lecciones de Next 16 olvidadas (`proxy.ts`, `updateTag`, `allowedDevOrigins`, `Suspense` en layout) | Bajo | Aplicadas de entrada en T1 y T4 |
| Victoria se confunde con el panel | Medio | Pantallas mínimas, textos simples, ensayo en M2 con cronómetro, guía de 1 página |
| Datos personales de los alumnos | Medio | Consentimiento en el formulario, acceso solo por rol, nada de datos de pago guardados |

## Paralelización

- **Ahora mismo, en paralelo:** P1, P2 y P3 (Lucas y Victoria) mientras yo hago T1 y T2.
- **Seguros en paralelo:** T5 (landing) con T3 (base) una vez hecho T1; T12 y T13 una vez definido el contrato de datos de T3.
- **Estrictamente secuenciales:** migraciones (T3) → auth (T4) → habilitar alumnos (T9); T15 → T16 → T17.

## Preguntas abiertas

Las bloqueantes (grabación, WhatsApp, Meet, logo, cuestionario/gráfico, textos) están en el **spec, sección *Preguntas abiertas***, con la fecha en que hace falta cada respuesta.
