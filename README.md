# User Management Angular App

A modern Angular 22 application for managing users and departments with JWT-based authentication, protected routes, and mock backend support.

This frontend app connects to a distributed microservices-based backend for user management and authentication. It provides a secure interface for login, user CRUD operations, department management, and session handling.

This project is the frontend layer for the backend microservices POC:

- Backend Microservices POC:
  https://github.com/abj-developer/user-management-system

- Live Frontend Demo:
  https://user-management-angular-v1.vercel.app/

- Live Backend API Demo:
  https://abjms.duckdns.org/swagger-ui/index.html

## Features

- JWT login flow with localStorage token storage
- Route guard to protect authenticated pages
- Department management (add, edit, delete)
- User management (add, edit, delete)
- Role-protected access pattern through protected routes
- Loading indicators and toast notifications
- Confirmation dialogs for destructive actions
- Responsive UI for desktop and small screens
- Mock backend using JSON Server

## Tech Stack

- Angular 22
- TypeScript
- RxJS
- JSON Server
- HTML / CSS / Angular Forms

## Prerequisites
- Node.js 22+
- npm
  
## Installation
npm install

## Run
npm start


