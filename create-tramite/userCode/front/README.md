<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [front-end](#front-end)
  - [Descripción general](#descripci%C3%B3n-general)
  - [Ejemplo fichero .env (front/.env)](#ejemplo-fichero-env-frontenv)
  - [Pasar a producción](#pasar-a-producci%C3%B3n)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# front-end

## Descripción general

Cada trámite tiene dos bundles (`bundle_estudiantes.js` y `bundle_pas.js`), que se sirven desde el back-end. Existe un único fichero de ``webpack.config.js`` que funciona de la siguiente forma:

- `npm run startPas`: Abre un servidor de desarrollo en el puerto 4000 con el trámite configurado en el fichero `.env (front/.env)` y el perfil pas. Está preparado para conectarse con el servidor en el service configurado en `.env (front/.env)`

- `npm run buildPas`: Genera el bundle en la carpeta `front/build/[nombre-trámite]/bundle_pas.js` con el procediento configurado en el fichero `.env (front/.env)`

- `npm run startEstudiantes`: Abre un servidor de desarrollo en el puerto 4001 con el trámite configurado en el fichero `.env (front/.env)` y el perfil estudiantes. Está preparado para conectarse con el servidor en el service configurado en `.env (front/.env)`

- `npm run buildEstudiantes`: Genera el bundle en la carpeta `front/build/[nombre-trámite]/bundle_estudiantes.js` con el procediento configurado en el fichero `.env (front/.env)`.

En el fichero `.env (front/.env)` se **debe** poner el mismo nombre para los trámites que el que hay en el enum  ``back/enums.js`` y debe existir dicha entrada en el enum. Un ejemplo de configuración del enum es:

```json
exports.tramites = {
    "gestionTitulos": ["gestion-titulos", "Petición de título de grado/máster"],
    "nombreTramite": ["nombre-carpeta", "Nombre extendido procedimiento"]
}
```

## Ejemplo fichero .env (front/.env)
La siguiente configuración sirve para cuando se quiera trabajar con gestionTitulos.
```shell
SERVICE=http://localhost:3000 #back url
TRAMITE=gestionTitulos
#TRAMITE=gestionCertificados
```
## Pasar a producción
El paso a producción es manual, copiando el ``bundle_estudiantes.js`` o el ``bundle_pas.js`` de la carpeta ``front/build/[nombre-trámite]/`` a la carpeta ``back/public/js/[nombre-trámite]/``. Está configurado así para evitar pisar el ``bundle.js`` de producción por error.