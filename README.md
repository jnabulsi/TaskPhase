# TaskPhase

TaskPhase is a local-first task board application built as a learning-focused project to explore more complex frontend interactions, predictable state management, and automated testing.

The project is inspired by tools like Trello and was designed to go beyond simple CRUD-style interfaces by focusing on user-driven interactions such as drag-and-drop and stateful UI behaviour.

A live version is available at https://taskphase.xyz.

## Motivation

I built TaskPhase to gain hands-on experience with:
- Managing complex UI interactions such as task and column reordering
- Designing a clear and predictable state model for a non-trivial frontend application
- Writing meaningful unit tests for stateful frontend logic
- Structuring a project so it can be iterated on rather than treated as a one-off demo

## Features

- Drag-and-drop task and column reordering
- Multiple boards with configurable columns
- Tag-based task organisation
- Local-first data persistence using browser storage
- Import and export of boards as JSON
- Responsive interface suitable for desktop and mobile use

## Tech stack

- Frontend: Vue 3
- State management: Pinia
- UI: Vuetify
- Routing: Vue Router
- Testing: Vitest
- Drag and drop: vuedraggable

## Future direction

The current implementation is single-user and local-first. A future goal for the project is to introduce a hosted backend to support collaborative boards, shared persistence, and multi-user state.
