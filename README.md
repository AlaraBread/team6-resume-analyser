# Resume Analyser

This is team 6's resume analyser. It's goal is to provide useful feedback on resumes using a large language model.

## Team

| name            | discord handle    |
| --------------- | ----------------- |
| Julia Torres    | alarabread        |
| Aidan Krenz     | \_aidan.\_        |
| Dylan Dunsheath | rockingwarrlor99  |
| Angelo Sticca   | gianzero          |
| Carlos Sarzo    | cpsycle           |
| Stephen Ordway  | resources_limited |

[Link to trello board](https://trello.com/invite/b/6716e246c3501b9906d3881f/ATTIa10680a5cdbda5c1ebf0682e0042d0b654BE61E0/team6)

## Setup

See [SETUP.md](docs/SETUP.md)

## Frontend

The frontend is in `/frontend`. It is a next.js project that uses npm and node.

### To run locally

(in `/frontend`)
```sh
npm run dev
```

### To test locally

(in `/frontend`)
```sh
npm run test
```

## Backend

The backend is in `/backend`. It is an [oak server](https://oakserver.org/) that uses [deno](https://deno.com/).

### Running locally

(in `/backend`)
```sh
deno run dev
```

### Testing locally

(in `/backend`)
```sh
deno task test
```
