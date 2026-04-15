# vanilla

Frontend desarrollado con HTML, CSS y JavaScript puro, sin frameworks ni dependencias externas. Forma parte de un proyecto comparativo que implementa la misma interfaz de usuario tanto en Vanilla JS como en React, conectándose a un backend compartido.

## Estructura

```
vanilla/
├── static/        # Archivos estáticos (CSS, JS del cliente)
└── views/         # Archivos HTML (vistas)
```

## Tecnologías

- HTML
- CSS
- JavaScript (sin frameworks)

## Uso

Este frontend está pensado para usarse junto al backend disponible en [vanilla-vs-react](https://github.com/cannedcoke/vanilla-vs-react). Asegurate de tener el servidor corriendo antes de abrir la aplicación.

1. Clona el repositorio:

```bash
git clone https://github.com/cannedcoke/vanilla.git
```

2. Levantá el backend desde el repositorio `vanilla-vs-react`.

3. Abrí el archivo HTML correspondiente desde la carpeta `views/` en tu navegador, o servilo con cualquier servidor estático.

## Relación con otros repositorios

Este proyecto es parte de un conjunto de tres repositorios:

- [vanilla](https://github.com/cannedcoke/vanilla) — este repositorio, frontend en Vanilla JS
- [react/front-react](https://github.com/cannedcoke/react/tree/main/front-react) — la misma interfaz implementada en React
- [vanilla-vs-react](https://github.com/cannedcoke/vanilla-vs-react) — el backend compartido en Node.js