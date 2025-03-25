# EcommerceProject

This project is a simple e-commerce application built with Angular. It includes features such as product listings, a shopping cart, a checkout process, and order management. Users can browse products, add them to their cart, proceed to checkout, and place orders.

## Running the Application

To start the Angular development server, run:

```bash
npm start
```

This will start the server and you can access the application at `http://localhost:4200/`.

To start the JSON server for the backend, run:

```bash
npm run server
```

This will start the JSON server and you can access the backend at `http://localhost:3000/`.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.


## Notable Features

- **Lazy Loading**: The application uses lazy loading for components to improve performance.
- **Responsive Design**: The application is designed to be responsive and works well on different screen sizes.
- **Icon Integration**: The application uses `lucide-angular` for icons, providing a modern and consistent look.

## Challenges Faced

- **Routing Issues**: Initially, there were issues with routing not working correctly. This was resolved by ensuring proper configuration of the `RouterModule` and importing it correctly in the `AppComponent`.
- **State Management**: Managing the state of the shopping cart was challenging. This was solved by using a service (`CartService`) and `rxjs` to handle state changes and subscriptions.

## Future Improvements

- **Enhanced State Management**: Implement a more robust state management solution like NgRx for better scalability.
- **Unit and E2E Tests**: Increase the coverage of unit and end-to-end tests to ensure the application is thoroughly tested.
- **Performance Optimization**: Further optimize the application for performance, including lazy loading more modules and optimizing the build process.
- **User Authentication**: Add user authentication and authorization features to enhance security and user experience.
