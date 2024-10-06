# MaxiFrontend - Advanced Software

This repository contains the frontend of the **MaxiClone - Supply Control** application for managing orders, incidents, and returns between stores and central warehouses. The project is developed using **React** with **TypeScript** to create a modular and scalable user interface. The backend is managed by a set of microservices developed in **SpringBoot (Java)**.

## General Description

The application is designed to handle multiple user types (stores, supervisors, warehouse users, administrators) and will allow managing orders, shipments, incidents, and returns with different workflows depending on the user's role.

The system will have modules for:
- Stores (create orders, receive shipments, generate incidents, and returns).
- Warehouses (manage shipments, incidents, and returns).
- Supervisors (approve or reject orders).
- Administrators (manage users and visualize reports).

The frontend is fully interactive, allowing users to work efficiently from any device.

## Project Structure

The project follows a modular and organized structure to facilitate scalability and maintainability of the code, using **Vertical Slices** to group functionalities by module. Each module contains its own pages, components, hooks, services, and types, allowing for easy navigation and code reuse.

```plaintext
src/
├── features/           # Each main module or functionality
│   ├── admin/          # Administration module functionalities
│   │   ├── components/ # Module-specific components for Administration
│   │   ├── hooks/      # Module-specific hooks
│   │   ├── pages/      # Module-specific views
│   │   ├── services/   # API calls related to Administration
│   │   └── types/      # Module-specific types and interfaces
│   ├── warehouse/      # Warehouse functionalities
│   │   ├── components/ 
│   │   ├── hooks/     
│   │   ├── pages/     
│   │   ├── services/  
│   │   └── types/    
│   ├── store/          # Store functionalities
│   │   ├── components/ 
│   │   ├── hooks/     
│   │   ├── pages/     
│   │   ├── services/  
│   │   └── types/    
│   └── supervisor/     # Supervisor functionalities
│       ├── components/ 
│       ├── hooks/     
│       ├── pages/     
│       ├── services/  
│       └── types/    
├── common/             # Reusable code between modules
│   ├── components/     # Global reusable components (e.g. buttons, modal, layouts)
│   ├── hooks/          # Shared hooks (e.g. useAuth, useFetch)
│   ├── services/       # Shared services (e.g. auth, notifications)
│   ├── styles/         # Global styles or themes
│   └── types/          # Shared global types
└── App.tsx             # Main entry point of the application
```

## Requirements

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) >= 18.0.0
- npm >= 8.0.0 or [yarn](https://yarnpkg.com/)

## Installation and Setup

Follow these steps to clone the project and run the development environment locally:

1. Clone this repository:
   ```bash
   git clone https://github.com/erikssonherlo/MaxiClone-Frontend.git
   cd MaxiClone-Frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or with yarn
   yarn dev
   ```

This will start a development server at `http://localhost:3000`.

## Key Features

- **Reusable React Components**: Each part of the interface is divided into reusable and maintainable components.
- **TypeScript**: TypeScript is used to ensure strict typing and reduce errors during development.
- **Dynamic Routing**: Navigation between the different pages of the application using React Router.
- **Intuitive Interface**: A design focused on user experience and ease of use.
- **Notification System**: In-app and email notifications to alert users of important updates.
- **Theme Support**: Users can switch between light and dark mode.

## Available Scripts

- `npm run dev` / `yarn dev`: Starts the development server.
- `npm run build` / `yarn build`: Builds the production version.
- `npm run lint` / `yarn lint`: Runs the linter to check for code errors.
- `npm test` / `yarn test`: Runs unit tests (to be implemented).

## Documentation and API

The frontend consumes APIs from the backend developed in SpringBoot, following a REST pattern. API documentation is available via the Swagger service provided by the backend.

## Testing

Unit and integration tests will be implemented to validate the behavior of components and the interaction with services.

- **Unit Tests**: Validate the correct functionality of individual components and helper functions.
- **Integration Tests**: Validate the interaction between components, pages, and REST services from the backend.

Testing will be set up using **Jest** and **React Testing Library**.

## Contributing

If you wish to contribute to the project, feel free to open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/new-feature`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push the changes to your repository (`git push origin feature/new-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License.

This README provides a comprehensive overview of the project, including its modular organization using vertical slices, installation steps, and details on how to contribute. Let me know if you'd like to tweak anything!