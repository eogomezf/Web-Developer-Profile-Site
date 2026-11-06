# Portafolio de Elvis Gómez Floegel

Sitio estático **bilingüe (ES / EN)** con dos perfiles profesionales — **Soporte TI & Cloud** y **Desarrollo Web & Cloud** — más CV descargables en PDF.

- **URL principal:** `/` → versión en español
- **Versión en inglés:** `/index.en.html`
- **Publicación:** Netlify (sitio estático, sin build)

---

## 1. Estructura del proyecto

```
/
├─ index.html            # Sitio principal en español
├─ index.en.html         # Sitio principal en inglés
├─ gracias.html          # Página de agradecimiento (formulario ES, sin JS)
├─ thanks.html           # Thank-you page (EN form, sin JS)
├─ 404.html              # Página de error
├─ css/styles.css        # Estilos (tokens, layout, responsive, impresión)
├─ js/main.js            # Tabs de perfil, menú móvil, botón arriba, formulario
├─ img/                  # Imágenes, iconos, OG y logotipos de certificaciones
├─ cv/                   # Fuentes HTML imprimibles de los CV en español
├─ docs/cv/              # CV en PDF (ES y EN) para descarga
├─ netlify.toml          # Configuración de Netlify (headers, caché)
├─ robots.txt            # Reglas para buscadores
├─ sitemap.xml           # Sitemap (dominio de Netlify configurado)
├─ site.webmanifest      # PWA básica
└─ README.md             # Este archivo
```

---

## 2. Vista previa en local

Las rutas dentro de las páginas son relativas (`css/styles.css`), así que el sitio
funciona tanto por HTTP como abierto con doble clic (`file://`):

```bash
# Opción 1: Python (sin instalar nada)
python -m http.server 8000

# Opción 2: Netlify CLI (recomendado para probar el formulario)
npx netlify-cli dev
```

Luego abre <http://localhost:8000> (y <http://localhost:8000/index.en.html> para la versión en inglés).

---

## 3. Publicar en Netlify

1. Crea un sitio nuevo en Netlify y conecta el repositorio de GitHub
   (`eogomezf/Web-Developer-Profile-Site`).
2. Netlify detecta `netlify.toml`:
   - `publish = "."` (no hay build command, es HTML/CSS/JS estático).
   - Headers de seguridad, CSP y caché larga para `/img/*`.
3. **Dominio configurado** (`https://loquacious-vacherin-472391.netlify.app`) en:
   - `robots.txt` → `Sitemap:`
   - `sitemap.xml` → los dos `<loc>`
   - `index.html` y `index.en.html` → `<link rel="canonical">`, `hreflang`,
     `og:url`, `og:image` y `twitter:image` (URLs absolutas)
4. Revisa en **Site settings → Forms** que aparezcan los formularios
   `contacto` (ES) y `contact` (EN). Netlify los detecta automáticamente desde
   `data-netlify="true"`.

### Requisitos de la configuración de formularios

El formulario funciona sin JavaScript (POST nativo a `/gracias.html`) y con
JavaScript (envío por `fetch` a `/` y mensaje de estado en pantalla). En Netlify
ambos modos quedan registrados en el panel de Forms.

---

## 4. Contenido y edición

El contenido está en dos archivos que hay que mantener en sincronía:

| Sección | ES | EN |
|---|---|---|
| Hero, menú, footer | `index.html` | `index.en.html` |
| Acerca de, Servicios, Experiencia, Habilidades | `index.html` | `index.en.html` |
| Certificaciones, Proyectos, Educación/Idiomas/CV | `index.html` | `index.en.html` |
| Contacto (form, datos, mapa) | `index.html` | `index.en.html` |

**Reglas de edición:**

- Cada sección con dos perfiles tiene **un par de paneles**:
  `<div class="panel" data-panel="ti">` y `<div class="panel" data-panel="dev">`.
  Al editar uno, editar el par correspondiente en la otra página.
- Los IDs deben coincidir entre pestaña y panel (`#tab-ti` → `aria-controls="panel-ti"`).
  Si agregas una sección nueva, duplica el par de paneles en ambos idiomas y
  agrega el enlace en el menú (ES y EN) y en el footer.
- Si no hay JavaScript, **ambos paneles se muestran** (mejora progresiva). No uses
  `hidden` en el HTML; `main.js` lo aplica al iniciar.

---

## 5. CV en PDF

Los cuatro PDFs viven en `docs/cv/` y se enlazan desde la sección “Educación,
idiomas y CV”:

| Archivo | Contenido | Origen |
|---|---|---|
| `CV-ES-Soporte-TI.pdf` | CV soporte TI en español | Generado desde `cv/cv-es-soporte-ti.html` |
| `CV-EN-IT-Support-Engineer.pdf` | CV soporte TI en inglés | Documento original |
| `CV-ES-Desarrollo-Web.pdf` | CV desarrollo web en español | Generado desde `cv/cv-es-desarrollo-web.html` |
| `CV-EN-Web-Developer.pdf` | CV desarrollo web en inglés | Documento original |

### Regenerar los CV en español

Edita el HTML en `cv/` y ejecuta:

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless=new --no-pdf-header-footer \
  --print-to-pdf="docs/cv/CV-ES-Soporte-TI.pdf" \
  "cv/cv-es-soporte-ti.html"
```

Repite con `cv-es-desarrollo-web.html` → `docs/cv/CV-ES-Desarrollo-Web.pdf`.

> Los PDFs usan Montserrat desde Google Fonts. Si cambias la fuente, verifica que
> los acentos sigan extrayéndose bien (importante para los ATS):
> `pdftotext -enc UTF-8 docs/cv/CV-ES-Soporte-TI.pdf - | grep José`

---

## 6. PENDIENTE antes de publicar

- [x] Dominio de Netlify (`loquacious-vacherin-472391.netlify.app`) aplicado en
      `robots.txt`, `sitemap.xml`, `canonical`, `hreflang`, `og:url` y `og:image`.
- [x] Insignia oficial de AWS SAA: `img/cert-aws-saa.png` (descargada de Credly)
      con enlace personal de verificación
      `credly.com/earner/earned/badge/625f80b6-…`.
- [ ] Insignia oficial de Agile Security: hoy es un placeholder
      (`img/cert-agile-security.svg`) que enlaza a LinkedIn. Cuando tengas la
      imagen y la URL de verificación, reemplazar en `index.html` e
      `index.en.html`.
- [ ] Probar el formulario en Netlify y confirmar que llegan los mensajes al
      correo `elvis.gomez.f@hotmail.com`.
- [ ] Revisar el mapa de Google (hoy usa `maps?q=Managua,Nicaragua&output=embed`);
      si prefieres, reemplázalo por el código de incrustación del negocio.
- [ ] Comprimir `img/csp.png` (≈ 940 KB) a WebP para mejorar el LCP.
- [ ] Ejecutar Lighthouse (desempeño / accesibilidad / SEO) después de publicar.

---

## 7. Notas de accesibilidad y SEO implementados

- `lang` correcto, `hreflang` es/en/x-default y `canonical` por página.
- Navegación por teclado completa en las pestañas (flechas, Inicio/Fin),
  `:focus-visible`, skip-link y landmarks (`header`/`nav`/`main`/`footer`).
- Los paneles sin JavaScript se muestran todos (contenido visible para
  buscadores y lectores de pantalla).
- `alt` descriptivos, `loading="lazy"` y `width`/`height` en las imágenes.
- Datos estructurados JSON-LD `Person` (trabajo, idiomas, formación, redes).
- Botón “volver arriba”, año dinámico del footer y menú móvil accesible.
