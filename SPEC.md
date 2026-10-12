# Spec: Plataforma de la Formación en Terapia Floral Sistema Bach

> Estado: **v2, pendiente de aprobación final** — 2026-10-11. Incorpora la respuesta sobre la seña, el alias de cobro, la marca *Flor de Luz* y el requisito de uso móvil. El plan de ejecución está en `tasks/plan.md` y `tasks/todo.md`.

**Cliente:** Victoria Salami (marca **Flor de Luz**). Proyecto familiar, sin cobro por el desarrollo. Aun así se construye con estándar de cliente real: hay alumnas pagando y datos personales de por medio.

## Objetivo

Una plataforma web privada donde la docente publica las clases grabadas (de sus encuentros en vivo por Meet) con su PDF, ofrece una biblioteca de material de estudio, recibe el examen final y emite el diploma. Además, un formulario público de inscripción con elección de forma de pago.

**Usuarios:**
- **Docente (admin):** una persona. Sube clases, material y diplomas; aprueba inscripciones; corrige exámenes.
- **Alumno:** grupo chico y cerrado (decenas, no miles). Ve las clases, descarga material, sube el examen, descarga el diploma.
- **Interesado:** persona sin cuenta que completa el formulario de inscripción.

**Datos de la formación**
- Nombre: *Formación en Terapia Floral Sistema Bach (+ Sistemas de Diagnóstico)*
- 5 encuentros online por Meet, **sábados 09:30 a 12:00**, duración 3 meses:
  1. 24/10/2026 · 2. 31/10/2026 · 3. 14/11/2026 · 4. 28/11/2026 · 5. 12/12/2026
- **Inscripción = seña del 20% del monto inicial (ARS 300.000) = ARS 60.000, igual para los tres planes.** La seña se descuenta del total del plan elegido.
- **Cobro:** transferencia al alias **`comadre.tierra.mp`**, titular **Victoria Salami**.

> **Cómo se muestran los precios (2026-10-12):** los planes se presentan **tal cual los definió Victoria**: pago único $300.000 · 2 pagos de $170.000 · 5 pagos de $80.000 (uno por encuentro). La seña de $60.000 se muestra aparte como "se descuenta de tu plan", y el calendario de abajo es el detalle de lo que queda por pagar.

| Plan | Cuotas | Total del plan | Seña | Saldo después de la seña |
|---|---|---|---|---|
| Pago único | 1 × ARS 300.000 | 300.000 | 60.000 | **240.000** en 1 pago |
| 2 pagos | 2 × ARS 170.000 | 340.000 | 60.000 | **280.000**: cuota 1 = 110.000, cuota 2 = 170.000 |
| Por encuentro | 5 × ARS 80.000 | 400.000 | 60.000 | **340.000**: encuentro 1 = 20.000, encuentros 2 a 5 = 80.000 c/u |

> **Regla de descuento (supuesto a confirmar con Victoria):** la seña se resta de las primeras cuotas en orden, hasta agotarse. Es una sola función (`calcularCuotas`) con tests, así que si Victoria prefiere otra regla (por ejemplo, restarla de la última cuota) es un cambio de una línea. Precios y seña viven en una tabla configurable, no fijos en el código.

### Decisiones ya tomadas (2026-10-11)

| Tema | Decisión |
|---|---|
| Pagos | **Fuera de la plataforma.** El formulario registra el plan elegido y muestra cómo pagar la seña; la docente cobra por su cuenta. La plataforma **no procesa ni guarda datos de pago**. |
| Grabación y videos | **Las clases se graban con Fathom** (decidido 2026-10-12). La docente pega en el aula el **link de la grabación**. Si es de YouTube (no listado) se reproduce **dentro** de la página; si es de Fathom u otro servicio, se abre con un botón "Ver la clase" en una pestaña nueva. Así funciona con cualquiera de los dos, y no dependemos de si Fathom permite descargar el MP4 en su plan gratuito (no pude confirmarlo; se prueba con Victoria). |
| Repositorio | `github.com/lucasmaciasrivera831-design/taller-flores-de-bach`. Hosting: **Vercel** por ahora. |
| Acceso | **Email + contraseña**, cuenta habilitada por la docente tras recibir la seña. |
| Liberación | **Manual por clase.** La docente decide cuándo se abre cada clase; el estado de pago es solo informativo para ella. |
| Dispositivos | **Mobile-first.** Todo (formulario, aula, biblioteca, examen, panel de la docente) tiene que funcionar bien en el navegador del celular, sin app. |
| Marca | **Flor de Luz**: morado profundo y dorado del logo, crema y flor morada del flyer (ver *Estilo y diseño*). |
| Costo | Sin cobro por el desarrollo. Costos recurrentes a cargo de Victoria solo si hacen falta (ver Preguntas abiertas). |
| Cuentas del alumno | Las crea la docente con una **contraseña temporal** que se comparte por WhatsApp. No depende del email de Supabase, que en el plan gratuito tiene un límite de envíos muy bajo. |

## Funcionalidades y criterios de aceptación

### F1. Formulario de inscripción (público)
Campos: nombre y apellido, email, WhatsApp, país/ciudad, plan de pago (3 opciones), aceptación de términos.
- [ ] Al elegir un plan se muestra seña (ARS 60.000) y saldo calculados, y el calendario de cuotas.
- [ ] Al enviar, se guarda la inscripción con estado `pendiente` y se muestra una pantalla con la seña a transferir, el alias `comadre.tierra.mp` (botón "copiar"), el titular Victoria Salami y un botón de WhatsApp para mandar el comprobante.
- [ ] Se usa con una sola mano en un celular de 360 px de ancho: campos grandes, teclado correcto (email, teléfono), sin zoom involuntario.
- [ ] Validación de email y teléfono; mensajes de error claros en español; sin duplicar inscripciones del mismo email.
- [ ] Anti-spam (honeypot + límite por IP).

### F2. Panel de la docente (`/admin`)
- [ ] Lista de inscripciones con plan, estado (`pendiente` / `seña recibida` / `activo` / `baja`) y notas.
- [ ] Botón "Habilitar alumno": crea la cuenta con una contraseña temporal que se muestra una sola vez, con un botón "copiar mensaje de bienvenida" listo para pegar en WhatsApp. El alumno debe cambiarla en su primer ingreso.
- [ ] Botón "Restablecer contraseña" de un alumno.
- [ ] Exportar inscripciones a CSV (respaldo).
- [ ] Marcar cuotas como pagadas (informativo, no bloquea el acceso).
- [ ] CRUD de clases: título, fecha del encuentro, link de YouTube, PDF de la clase, estado `borrador` / `publicada`.
- [ ] CRUD de material de la biblioteca (categoría, título, archivo).
- [ ] Ver exámenes entregados, descargarlos, marcar `aprobado` / `a rehacer` con comentario.
- [ ] Emitir diploma de un alumno aprobado.

### F3. Aula tipo Classroom (alumno)
- [ ] Login, recuperación de contraseña, sesión persistente.
- [ ] Tarjeta "Próximo encuentro" con fecha, horario (sábado 09:30 a 12:00) y **botón para entrar a Meet** (el link lo carga la docente y solo lo ven los alumnos habilitados).
- [ ] Lista de los 5 encuentros con fecha; las no publicadas aparecen bloqueadas con su fecha.
- [ ] Página de clase: video embebido de YouTube + PDF de la clase descargable.
- [ ] Un alumno **nunca** ve clases en `borrador` ni material de otros; un visitante sin sesión no ve nada del aula (verificado por RLS, no solo por la interfaz).

### F4. Biblioteca
Categorías: **Archivos**, **PDF de las clases**, **PDF del cuestionario**, **Gráfico de los 7 grupos emocionales** (para el diagnóstico con péndulos).
- [ ] Listado por categoría, descarga y vista previa de PDF/imagen.
- [ ] El gráfico de los 7 grupos se puede ver en pantalla completa y descargar en buena resolución.

### F5. Examen final (aparte del aula)
- [ ] Sección separada, visible solo para alumnos habilitados.
- [ ] Subida de un archivo (PDF/DOC/DOCX/imagen, máx. a definir) con confirmación de entrega.
- [ ] El alumno ve el estado: `entregado` / `aprobado` / `a rehacer` y puede volver a subir si la docente lo pide.
- [ ] Fecha límite configurable por la docente.

### F6. Diploma
- [ ] PDF horizontal A4 con el logo de Flor de Luz, nombre del alumno, nombre de la formación, fecha de emisión, firma de **Victoria Salami** y código de verificación único.
- [ ] Se habilita solo con examen `aprobado`; el alumno lo descarga desde su perfil.
- [ ] Página pública de verificación por código (opcional, ver Preguntas abiertas).

## Estilo y diseño (propuesta a validar)

**Material recibido (2026-10-11), en `C:\Users\Equipo\Documentos\Flores de Bach`:**
- **Logo "Flor de Luz":** flor de loto lineal blanca sobre un círculo morado profundo, con una media luna blanca arriba y un borde dorado; el nombre va en dorado, en una tipografía redondeada con carácter. Es un JPEG de 500 px **con fondo blanco**: sirve para empezar, pero para el diploma y los fondos de color hace falta una versión con transparencia o vectorial (ver Preguntas abiertas).
- **Flyer del curso:** foto de una anémona morada a pantalla completa, texto en crema, titular en sans muy grueso ("Terapia floral") y "Sistema Bach" en una caligrafía de pincel, etiqueta crema con texto rojo oscuro ("INSCRIPCIONES ABIERTAS"), filetes finos arriba y abajo.

**Dirección:** la plataforma continúa el flyer. Elegante, floral y cálida, con la sobriedad del logo. Transmite cuidado y confianza, no "tecnología".

- **Paleta (tokens CSS), aproximada a ojo del material; se ajusta tomando muestras del archivo original en la tarea 1:**
  - Morado profundo `#5B3A7E` (primario, tomado del círculo del logo)
  - Dorado `#B8893A` (detalles, títulos de marca, diploma; tomado del logo)
  - Morado flor `#8A5FC4` (acento, de los pétalos del flyer)
  - Crema `#FBF3E8` (fondo claro, del texto del flyer)
  - Rojo vino `#8E2A1E` (llamadas a la acción puntuales, de la etiqueta del flyer)
  - Tinta `#2A1E36` (texto), un morado casi negro en lugar de negro puro
  - Contraste AA verificado en cada par texto/fondo; el dorado sobre crema **no** se usa para texto chico.
- **Tipografía:** titulares en sans geométrica gruesa (tipo *Outfit* o *Poppins*, como el flyer), cuerpo en sans legible (*Nunito Sans*), y una caligrafía de pincel (*Caveat Brush* o similar) **solo** para acentos como "Sistema Bach". Una sola caligrafía, usada con moderación.
- **Imaginería:** la foto de la anémona del flyer en la portada y en el encabezado del aula, con una capa morada para que el texto se lea. Sin fotos de stock genéricas.
- **Componentes:** tarjetas con bordes redondeados, mucho aire, botones grandes (mínimo 48 px de alto) para el dedo. Mobile-first: se diseña primero a 360 px y después se amplía.
- **Gráfico de los 7 grupos emocionales:** se muestra tal cual lo entrega Victoria; no se rediseña sin su aval.
- **Diploma:** A4 horizontal, fondo crema, marco fino dorado, logo de Flor de Luz arriba, nombre del alumno en grande, firma de Victoria Salami y código de verificación.
- **Pendiente:** versión del logo con fondo transparente (o vectorial).

## Tech stack

| Capa | Elección |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Estilos | CSS Modules + variables CSS (tokens), como en ElOutletDelPrecio |
| Backend / DB / Auth / Storage | Supabase (Postgres + RLS + Auth + Storage), proyecto nuevo y propio |
| Deploy | Vercel con deploy automático desde GitHub (`main`) |
| Diploma PDF | `@react-pdf/renderer` (genera el PDF en el servidor) |
| Emails | Supabase Auth para invitación/reseteo; el resto fuera de alcance v1 |

Dependencias nuevas fuera de esta lista: **preguntar antes**.

## Comandos

```
Dev:        npm run dev
Build:      npm run build
Lint:       npm run lint
Typecheck:  npx tsc --noEmit
Tests:      npm test                       # Vitest (unitarios)
E2E:        npx playwright test            # flujos críticos
Migraciones: npx supabase db push          # tras revisar el SQL
```

## Estructura del proyecto

```
formacion-terapia-floral/        # repo git propio
├── SPEC.md                      # este documento
├── tasks/                       # plan.md y todo.md (fase Plan)
├── src/
│   ├── app/
│   │   ├── (publico)/           # landing de la formación, inscripción, verificación de diploma
│   │   ├── (aula)/              # clases, biblioteca, examen, perfil — requiere sesión
│   │   └── admin/               # panel de la docente — requiere rol admin
│   ├── components/              # UI reutilizable
│   ├── lib/                     # supabase client, precios/cuotas, validaciones
│   └── styles/                  # tokens.css y globales
├── supabase/migrations/         # SQL versionado (tablas + políticas RLS)
├── tests/                       # unitarios
└── e2e/                         # Playwright
```

## Modelo de datos (borrador)

`planes` (id, nombre, cuotas, monto_cuota, total) · `inscripciones` (id, datos personales, plan_id, estado, notas, created_at) · `perfiles` (user_id, rol `admin|alumno`, inscripcion_id) · `clases` (id, orden, titulo, fecha, youtube_url, pdf_path, estado) · `material` (id, categoria, titulo, archivo_path, orden) · `cuotas` (inscripcion_id, numero, monto, pagada) · `examenes` (id, user_id, archivo_path, estado, comentario, entregado_en) · `diplomas` (id, user_id, codigo, emitido_en).

Archivos en Supabase Storage con **buckets privados** y URLs firmadas de corta duración.

## Estilo de código

TypeScript estricto, componentes de servidor por defecto, textos de interfaz en español rioplatense.

```tsx
// src/lib/planes.ts — la lógica de plata vive en un solo lugar y es testeable
export type Plan = { cuotas: number; montoCuota: number };

const PRECIO_BASE = 300_000; // pago único; la seña es el 20% de este monto
export const SENA = PRECIO_BASE * 0.2; // 60.000 para todos los planes

export const total = (p: Plan) => p.cuotas * p.montoCuota;

// La seña se descuenta de las primeras cuotas, en orden, hasta agotarse.
export function calcularCuotas(p: Plan): number[] {
  let porDescontar = SENA;
  return Array.from({ length: p.cuotas }, () => {
    const descuento = Math.min(porDescontar, p.montoCuota);
    porDescontar -= descuento;
    return p.montoCuota - descuento;
  });
}
// pago único → [240000] · 2 pagos → [110000, 170000] · por encuentro → [20000, 80000, 80000, 80000, 80000]
```

Convenciones: archivos en `kebab-case`, componentes en `PascalCase`, nada de `any`, validación de entradas con un esquema (zod) en cada formulario y endpoint.

## Estrategia de pruebas

- **Unitarias (Vitest):** cálculo de seña/saldo/cuotas, validación del formulario, generación del código de diploma.
- **Seguridad/RLS:** probar con dos alumnos y un visitante que cada uno ve solo lo suyo y nada del aula sin sesión.
- **E2E (Playwright):** (1) inscripción completa, (2) docente habilita alumno, (3) alumno entra y ve una clase publicada pero no un borrador, (4) alumno sube examen, (5) docente aprueba y se descarga el diploma.
- **Manual antes de entregar:** celular real (iOS y Android), lectura del PDF del diploma impreso, Lighthouse accesibilidad ≥ 95.
- Un bug corregido = un test que lo cubre.

## Límites

**Siempre**
- Correr lint, typecheck y tests antes de cada commit.
- RLS activado en toda tabla; buckets privados.
- Validar toda entrada en el servidor, no solo en el navegador.
- Textos en español, accesibles (contraste AA, foco visible, etiquetas en formularios).

**Preguntar antes**
- Agregar dependencias, cambiar el esquema de la base de datos, tocar el modelo de precios.
- Cualquier cambio de costo (planes de Supabase/Vercel, dominio).
- Publicar material de la docente o datos de alumnos en cualquier lugar.

**Nunca**
- Procesar, pedir ni guardar datos de tarjeta o cuentas bancarias de alumnos.
- Commitear claves (`.env`, service role de Supabase).
- Exponer el `service_role` al navegador.
- Dejar un bucket público con material de la formación.
- Borrar datos de alumnos sin confirmación de la docente.

## Hitos (el calendario manda)

El flyer ya dice "Inscripciones abiertas", así que el formulario es lo más urgente, y el aula puede esperar a que exista la primera grabación (después del 24/10).

| Hito | Fecha objetivo | Incluye |
|---|---|---|
| **M1 — Se pueden inscribir** | **vie 16/10** | Landing + F1 formulario + F2 mínimo (la docente ve y gestiona las inscripciones), en producción |
| **M2 — Aula lista para el primer encuentro** | **jue 22/10** | Habilitar alumnos, login, "Próximo encuentro" con link de Meet, aula, páginas de clase, biblioteca con el cuestionario y el gráfico, ensayo con Victoria |
| **M3 — Primera clase publicada** | **dom 25/10 a vie 30/10** | Panel completo para subir clases y material; primera clase subida por Victoria sin ayuda |
| **M4 — Cierre de la formación** | **antes del 5/12** (el último encuentro es el 12/12) | F5 examen, F6 diploma y verificación, probados con datos de prueba |

## Criterios de éxito

- La docente publica una clase nueva (video + PDF) en menos de 3 minutos sin ayuda.
- Un interesado completa la inscripción desde el celular en menos de 2 minutos.
- **Todo el recorrido (inscribirse, entrar, ver una clase, abrir la biblioteca, subir el examen) funciona en Chrome de Android y Safari de iPhone**, probado en dispositivos reales y a 360, 390 y 768 px, sin scroll horizontal ni elementos cortados.
- Ningún visitante sin sesión puede leer clases, PDFs ni exámenes (probado).
- El diploma sale impreso y legible, con código verificable.
- Lighthouse: accesibilidad ≥ 95 y rendimiento ≥ 90 en móvil.

## Preguntas abiertas

**Respondidas el 2026-10-11:** seña (20% de 300.000 = 60.000, igual en los tres planes), alias de cobro (`comadre.tierra.mp`, Victoria Salami), logo y flyer (recibidos), uso en celular (requisito), costo del desarrollo (sin cobro).

**Bloqueantes: hay que resolverlas con Victoria antes de la fecha indicada**

1. **Prueba de Fathom con Victoria (antes del sábado 24/10).** Las clases se graban con Fathom, que graba Meet sin necesitar un plan pago de Google. Falta verificar con una reunión de prueba de 2 minutos: que Fathom entre solo a la reunión, que genere la grabación, **qué tipo de link da** (si se puede compartir con alumnos sin que tengan cuenta de Fathom) y si permite **descargar el video**. Según eso se decide si el aula usa el link de Fathom directamente o si se sube a YouTube.
2. **Número de WhatsApp de Victoria** para el botón del formulario (antes de M1).
3. **Link de Meet** de los encuentros (¿uno fijo para todos o uno por clase?) (antes de M2).
4. **Versión del logo sin fondo blanco** (PNG transparente o vectorial) (antes de M1; si no existe, la genero yo a partir del JPEG).
5. **Cuestionario (PDF) y gráfico de los 7 grupos emocionales**: ¿ya existen como archivo? (antes de M2).
6. **Textos de la landing**: descripción de la formación, programa por encuentro, a quién va dirigida, qué incluye y condiciones (antes de M1; con el flyer armo un borrador y ella lo corrige).

**No bloqueantes: tienen un valor por defecto**

7. **Regla de descuento de la seña** (supuesto: se resta de las primeras cuotas en orden). Se confirma con Victoria; cambiarla es una línea.
8. **Duración del acceso** al aula después del 12/12. Por defecto: se mantiene hasta que ella decida.
9. **Examen final**: fecha límite y formato esperado. Por defecto: PDF, foto o Word, hasta 10 MB.
10. **Dominio propio** (p. ej. `floresdeluz.com.ar`). Por defecto: `*.vercel.app` al principio. Un dominio tiene costo anual y lo paga Victoria.
11. **YouTube no listado**: cualquiera con el link puede ver el video. Se acepta por ser un grupo chico; el link nunca aparece en una página pública.
12. **Verificación pública del diploma** por código. Por defecto: sí, es una página muy simple.
13. **Plan de hosting**: el plan gratuito de Vercel (Hobby) es para uso no comercial, y el curso es comercial. Opciones: seguir en Hobby al arrancar (como las otras tiendas de la agencia) o pasar a Pro (USD 20 al mes) si Vercel lo exigiera. Supabase gratuito pausa el proyecto tras 7 días sin actividad, cosa que no pasa con el curso en marcha pero sí en las semanas posteriores.
