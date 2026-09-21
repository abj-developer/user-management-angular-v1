# AGENTS.md

## Project overview
This repository is an Angular 22 application using the classic NgModule architecture rather than the latest standalone APIs.

Key files:
- src/app/app.module.ts: app setup and module declarations
- src/app/pages/user-management.component.ts: main feature logic
- src/app/services/user-api.service.ts: HTTP service for users and departments
- src/app/models/user.models.ts: shared models
- db.json: mock data for json-server

## Development workflow
1. Install dependencies:
   - npm install
2. Start the mock API:
   - npm run mock-api
3. Start the Angular app in a second terminal:
   - npm start
4. Open the app at http://localhost:4200
5. Mock API is available at http://localhost:3000

## Validation
- Run the production build before declaring work complete:
  - npm run build
- If changing API contracts or UI behavior, verify against the mock backend in db.json and the relevant Angular components.

## Coding conventions
- Prefer the existing NgModule patterns already used in the app.
- Keep component logic in the page/component files and business logic in the service layer.
- Maintain compatibility with the JSON-server API structure.
- Use the existing model names and interfaces from src/app/models/user.models.ts.
- Keep changes minimal, feature-focused, and aligned with the current architecture.

## Important notes
- The app depends on Angular 22 and RxJS 7.
- The user-management feature expects a departmentId relationship between users and departments.
- The mock API routes are defined in README.md and must remain consistent with any backend changes.
