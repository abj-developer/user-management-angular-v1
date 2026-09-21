# APP-1 — User Management (NgModule Revision)

This version intentionally uses the classic Angular NgModule architecture so that old Angular concepts can be revised before moving to modern Angular 22 standalone APIs.

## Concepts in this app
- AppModule / NgModule
- Components and templates
- Interpolation
- Property binding
- Event binding
- Two-way binding with ngModel
- *ngIf / *ngFor
- Services
- Dependency Injection
- HttpClient
- Observables / subscribe
- Reactive Forms
- CRUD
- User -> Department relationship

## Run
Terminal 1:
```bash
npm install
npm run mock-api
```

Terminal 2:
```bash
npm start
```

App: http://localhost:4200
Mock API: http://localhost:3000

## API collections
- GET /departments
- POST /departments
- GET /users?departmentId=1
- POST /users
- PUT /users/:id
- DELETE /users/:id
