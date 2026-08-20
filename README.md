# Landing page — Jamin

Landing de una sola página para el servicio **“Tu página web en 1 día por $399”**
(el hosting y el dominio no están incluidos en ese precio), con sección secundaria de
otros servicios, formulario de contacto que llega al correo y CTA directo a WhatsApp.

Sitio estático (HTML + CSS + JS, sin build ni dependencias), listo para GitHub Pages.

```
index.html
robots.txt
.nojekyll
assets/
  css/styles.css
  js/main.js
  img/favicon.svg
  img/og-cover.svg
  img/jamin-placeholder.svg   ← se muestra mientras no exista jamin.png
```

---

## 1. Falta un archivo: tu foto

El diseño espera el retrato en **`assets/img/jamin.png`**. Mientras no exista, se muestra
un marcador de posición con las mismas proporciones.

Para agregarlo, guarda la imagen con ese nombre exacto y súbela al repo
(`git add assets/img/jamin.png`), o arrástrala desde GitHub con
**Add file → Upload files** dentro de la carpeta `assets/img/`.

El marco es cuadrado y la foto se recorta con `object-fit: cover`, así que cualquier
tamaño funciona sin romper la maquetación; si la imagen no es cuadrada, el encuadre se
ancla arriba (`object-position: center 18%`) para no cortar la cara. Un degradado en el
borde inferior funde el retrato con el fondo de la sección, de modo que no se ve un
recuadro pegado. Todo eso vive en `.photo-frame` dentro de `assets/css/styles.css`.

---

## 2. Ver el sitio en local

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

---

## 3. El formulario de contacto

GitHub Pages solo sirve archivos estáticos: no puede enviar correos por sí mismo. El
formulario usa **[FormSubmit](https://formsubmit.co)** (gratis, sin cuenta) para reenviar
los mensajes a `jaminepb@gmail.com`.

**Se activa una sola vez:** la primera vez que alguien envíe el formulario desde el sitio
publicado, FormSubmit te manda un correo de confirmación. Al hacer clic en el enlace, ese
y todos los envíos siguientes llegan a tu bandeja.

> Haz tú mismo el primer envío de prueba en cuanto el sitio esté en línea, para no perder
> el mensaje de un cliente real.

### Ocultar tu correo del código (recomendado)

Hoy el correo se arma en JavaScript (`assets/js/main.js`), lo que frena a los bots más
simples, pero sigue siendo legible para quien mire el código. Para eliminarlo del todo:

1. Entra a [formsubmit.co](https://formsubmit.co) y registra `jaminepb@gmail.com`.
2. Te dan un alias tipo `https://formsubmit.co/ajax/abc123def456`.
3. En `assets/js/main.js` reemplaza:

```js
var FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + EMAIL;
```

por

```js
var FORM_ENDPOINT = 'https://formsubmit.co/ajax/TU_ALIAS';
```

Si el envío falla por cualquier motivo, el formulario muestra un enlace de respaldo a
WhatsApp y al correo, así que ningún contacto se pierde.

---

## 4. Datos de contacto configurados

| Dato | Valor | Dónde cambiarlo |
|---|---|---|
| WhatsApp | `+1 815 908 4163` | `WHATSAPP` en `assets/js/main.js` y los enlaces `wa.me/18159084163` en `index.html` |
| Correo | `jaminepb@gmail.com` | `MAIL_USER` / `MAIL_HOST` en `assets/js/main.js` |

---

## 5. Publicar en GitHub Pages y conectar el dominio de Hostinger

> Estos pasos son para cuando decidas subirlo. Nada de esto está hecho todavía.

### a) Activar GitHub Pages

1. En GitHub: **Settings → Pages**.
2. En *Source* elige **Deploy from a branch**.
3. Branch: la rama que uses (por ejemplo `main`), carpeta `/ (root)`. Guarda.
4. En un par de minutos el sitio vive en `https://jaminjv.github.io/infinitum/`.

### b) Apuntar tu dominio de Hostinger

En el panel de Hostinger, en **Dominios → DNS / Nameservers**, crea estos registros
(borra primero cualquier registro `A` o `CNAME` que choque con `@` o `www`):

| Tipo | Nombre | Valor | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 3600 |
| A | `@` | `185.199.109.153` | 3600 |
| A | `@` | `185.199.110.153` | 3600 |
| A | `@` | `185.199.111.153` | 3600 |
| CNAME | `www` | `jaminjv.github.io` | 3600 |

### c) Decirle a GitHub cuál es el dominio

1. **Settings → Pages → Custom domain**: escribe tu dominio (ej. `tudominio.com`) y guarda.
   Eso crea un archivo `CNAME` en el repo automáticamente.
2. Espera a que aparezca **DNS check successful** (el DNS puede tardar de minutos a 24 h).
3. Marca **Enforce HTTPS** para que el sitio cargue con candado.

> Si prefieres crear el archivo a mano, basta con un `CNAME` en la raíz del repo cuyo
> único contenido sea tu dominio, sin `https://` ni barra final.

---

## Accesibilidad y rendimiento

- Sin librerías externas: solo una fuente de Google Fonts.
- Respeta `prefers-reduced-motion`: quien tenga las animaciones desactivadas en su
  sistema ve el sitio completo y estático.
- Navegación por teclado con foco visible y menú móvil con `aria-expanded`.
- El formulario valida en el navegador y anuncia el resultado con `aria-live`.
