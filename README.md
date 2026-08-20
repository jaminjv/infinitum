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

## 1. La fotografía

El retrato vive en `assets/img/` en tres versiones:

| Archivo | Peso | Para qué sirve |
|---|---|---|
| `jamin.webp` | 50 KB | La que descarga casi todo el mundo |
| `jamin.jpg` | 104 KB | Respaldo para navegadores sin WebP |
| `jamin.png` | 1.8 MB | El original, sin tocar. No se sirve |

El HTML usa `<picture>`, así que el navegador elige solo: pide el WebP y solo cae al
JPEG si no lo soporta. El PNG original se conserva como copia maestra; puedes borrarlo
del repo sin afectar el sitio.

**Si cambias la foto**, sustituye el original y regenera las dos versiones servidas:

```bash
python3 -c "
from PIL import Image
src = Image.open('assets/img/jamin.png').convert('RGB').resize((1000,1000), Image.LANCZOS)
src.save('assets/img/jamin.webp', 'WEBP', quality=88, method=6)
src.save('assets/img/jamin.jpg',  'JPEG', quality=88, optimize=True, progressive=True, subsampling=1)
"
```

El marco es cuadrado y la imagen se recorta con `object-fit: cover`, así que cualquier
proporción funciona sin romper la maquetación; si no es cuadrada, el encuadre se ancla
arriba (`object-position: center 18%`) para no cortar la cara. Un degradado en el borde
inferior funde el retrato con el fondo de la sección, y una capa de color enfría el fondo
cálido del estudio para que case con el azul de la página. Todo eso vive en
`.photo-frame`, en `assets/css/styles.css`.

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

## 5. Publicar en GitHub Pages

El sitio se publica desde la rama `main`, carpeta raíz.

### a) Activar Pages (una sola vez)

1. **Settings → Pages**.
2. *Source*: **Deploy from a branch**.
3. *Branch*: **`main`**, carpeta **`/ (root)`**. Guarda.
4. En uno o dos minutos el sitio queda en **https://jaminjv.github.io/infinitum/**,
   y en `https://jaminvisuals.com` una vez que el DNS apunte (sección 6).

> Si `main` no aparece como rama por defecto, cámbiala en
> **Settings → General → Default branch**.

### b) Primer envío del formulario

Entra al sitio ya publicado y mándate un mensaje de prueba. FormSubmit te enviará un
correo de confirmación: al hacer clic en el enlace quedan habilitados todos los envíos
siguientes. Hazlo tú antes de difundir la página, para no perder el mensaje de un
cliente real.

---

## 6. El dominio: jaminvisuals.com

El archivo `CNAME` en la raíz ya declara el dominio, así que GitHub lo toma solo.
Falta apuntar el DNS desde Hostinger.

### Registros en Hostinger

**Dominios → DNS / Nameservers.** Borra primero cualquier registro `A` o `CNAME` que
ya ocupe `@` o `www`, y crea estos:

| Tipo | Nombre | Valor | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 3600 |
| A | `@` | `185.199.109.153` | 3600 |
| A | `@` | `185.199.110.153` | 3600 |
| A | `@` | `185.199.111.153` | 3600 |
| CNAME | `www` | `jaminjv.github.io` | 3600 |

Opcionalmente, para que el sitio responda también por IPv6:

| Tipo | Nombre | Valor |
|---|---|---|
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

### Después, en GitHub

1. **Settings → Pages → Custom domain**: escribe `jaminvisuals.com` y guarda.
2. Espera a que diga **DNS check successful**. El DNS puede tardar de minutos a 24 h;
   mientras tanto es normal ver errores.
3. Marca **Enforce HTTPS** en cuanto se habilite (el certificado tarda unos minutos
   más en emitirse).

### Orden importante

Entre que el `CNAME` existe y el DNS propaga, `jaminjv.github.io/infinitum` redirige a
`jaminvisuals.com`, que todavía no resuelve. Es decir: **el sitio se ve caído en ese
intervalo**. Por eso conviene crear los registros DNS primero y confirmarlos con:

```bash
dig +short jaminvisuals.com          # debe devolver las cuatro IP 185.199.x.153
dig +short www.jaminvisuals.com      # debe devolver jaminjv.github.io
```

---

## Imagen al compartir el enlace

`assets/img/og-cover.png` (1200×630) es lo que se ve cuando alguien pega el enlace en
WhatsApp, Facebook o LinkedIn. Se genera con Chromium a partir de
`scratchpad/og.html`; si cambias el mensaje principal del sitio, conviene regenerarla
para que ambos digan lo mismo.

## Accesibilidad y rendimiento

- Sin librerías externas: solo una fuente de Google Fonts.
- Respeta `prefers-reduced-motion`: quien tenga las animaciones desactivadas en su
  sistema ve el sitio completo y estático.
- Navegación por teclado con foco visible y menú móvil con `aria-expanded`.
- El formulario valida en el navegador y anuncia el resultado con `aria-live`.
