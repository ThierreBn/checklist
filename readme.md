# Checklist

A simple checklist application built with JavaScript.

The project is currently being developed as a full-stack application, with a Node.js backend and a frontend built with HTML, CSS, and JavaScript.

# Features

- Create tasks
- List tasks
- Update tasks
- Delete tasks
- Set task title
- Set task description
- Set due date
- Set task priority
- Mark tasks as completed

# Technologies

## Backend

- JavaScript
- Node.js
- Native HTTP module

## Frontend

- HTML
- CSS
- JavaScript

# API

## GET /tasks

Returns all tasks.

## POST /tasks

Creates a new task.

A task requires:

- title
- description
- dueDate
- priority

The completed status is initially set to false.

## PATCH /tasks/:id

Updates one or more properties of an existing task.

The available priority values are:

- low
- medium
- high

The API also validates the task due date.

## DELETE /tasks/:id

Deletes one task

# Project Structure

The project is divided into two main parts:

- backend
- frontend

The backend contains the Node.js API.

The frontend contains the user interface of the checklist.

# Running the Project

## Backend

Open the terminal inside the backend folder and run:

node src/index.js

The server will run on port 3000.

# Current Status

The backend currently supports:

- GET /tasks
- POST /tasks
- PATCH /tasks/:id
- DELETE /tasks/:id

The project is still under development.

# Future Improvements

- Connect the frontend to the backend
- Add a database
- Add automated tests
- Improve validation
- Add authentication
- Deploy the application
