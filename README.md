# MaxiFrontend - Software Avanzado

Este repositorio contiene el frontend de la aplicación **MaxiClone - Control de Suministros**  para la gestión de pedidos, incidencias y devoluciones entre tiendas y bodegas centrales. El proyecto está desarrollado utilizando **React** con **TypeScript** para crear una interfaz de usuario modular y escalable. El backend será manejado por un conjunto de microservicios desarrollados en **SpringBoot (Java)**.

## Descripción General

La aplicación está diseñada para manejar múltiples tipos de usuarios (tiendas, supervisores, usuarios de bodegas, administradores) y permitirá gestionar pedidos, envíos, incidencias y devoluciones, con diferentes flujos de trabajo según el rol del usuario. 

El sistema contará con módulos para:
- Tiendas (crear pedidos, recibir envíos, generar incidencias y devoluciones).
- Bodegas (gestionar envíos, incidencias y devoluciones).
- Supervisores (aprobar o rechazar pedidos).
- Administradores (gestión de usuarios y visualización de reportes).

El frontend es completamente interactivo, permitiendo a los usuarios trabajar eficientemente desde cualquier dispositivo.

## Estructura del Proyecto

El proyecto sigue una estructura modular y organizada para facilitar la escalabilidad y mantenibilidad del código:

```plaintext
src/
├── components/          # Componentes reutilizables
├── pages/               # Vistas para cada página
├── services/            # Lógica de servicios y llamadas a APIs
├── hooks/               # Hooks personalizados
├── utils/               # Utilidades y funciones auxiliares
├── types/               # Definición de tipos e interfaces de TypeScript
├── assets/              # Recursos como imágenes, íconos y estilos
└── App.tsx              # Componente raíz
```

## Requerimientos

Asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) >= 18.0.0
- npm >= 8.0.0 o [yarn](https://yarnpkg.com/)

## Instalación y Configuración

Sigue estos pasos para clonar el proyecto y ejecutar el entorno de desarrollo en local:

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/control-suministros-frontend.git
   cd control-suministros-frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o con yarn
   yarn install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o con yarn
   yarn dev
   ```

Esto levantará un servidor de desarrollo en `http://localhost:3000`.

## Características Principales

- **Componentes React reutilizables**: Cada parte de la interfaz está dividida en componentes reutilizables y fáciles de mantener.
- **TypeScript**: Utilizamos TypeScript para garantizar una tipificación estricta y reducir errores en tiempo de desarrollo.
- **Rutas dinámicas**: Navegación entre las diferentes páginas de la aplicación con React Router.
- **Interfaz intuitiva**: Diseño centrado en la usabilidad y experiencia del usuario.
- **Sistema de notificaciones**: Notificaciones en pantalla y mediante correo electrónico para alertar a los usuarios sobre actualizaciones importantes.
- **Soporte para temas**: Se puede cambiar entre modo claro y oscuro.

## Scripts Disponibles

- `npm run dev` / `yarn dev`: Inicia el servidor de desarrollo.
- `npm run build` / `yarn build`: Genera la versión de producción.
- `npm run lint` / `yarn lint`: Ejecuta el linter para revisar errores en el código.
- `npm test` / `yarn test`: Corre las pruebas unitarias (a implementar).

## Documentación y API

El frontend consume las APIs del backend desarrollado en SpringBoot, siguiendo un patrón REST. La documentación de las APIs puede encontrarse en el servicio de Swagger proporcionado por el backend.

## Pruebas

Se implementarán pruebas unitarias e integración para validar el comportamiento de los componentes y la interacción con los servicios.

- **Unitarias**: Validar el correcto funcionamiento de los componentes individuales y las funciones auxiliares.
- **Integración**: Validar la interacción entre componentes, páginas y los servicios REST del backend.


## Contribuciones

Si deseas contribuir al proyecto, puedes abrir un issue o realizar un pull request.

1. Haz un fork del repositorio.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-feature`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva feature'`).
4. Sube los cambios a tu repositorio (`git push origin feature/nueva-feature`).
5. Crea un nuevo Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT.
```

Este archivo README proporciona una descripción general del proyecto, su estructura, y cómo configurarlo. Además, incluye instrucciones para contribuir y documentar las pruebas. ¿Te gustaría añadir algún detalle adicional?