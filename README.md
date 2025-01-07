# GQl-BE 
A Node.js Template for Building GraphQL APIs

## Description

This project serves as a template for creating GraphQL APIs using Node.js. It provides a basic setup to help you quickly start developing your GraphQL server, including environment configuration, development scripts, and a GraphQL playground for testing your queries and mutations.

## Setup

1. Clone the repository.
2. Create a `.env` file in the root directory and add the necessary environment variables (refer to `.env.example` for guidance).
3. Run `npm install` to install dependencies.

## Run

- Start the development server with `npm run dev`.
- Access the GraphQL playground at **http://localhost:${port}/graphql**.

## Troubleshooting

- If you cannot see your query example, try proxying your localhost port through ngrok:
  ```bash
  ngrok http ${port}
  ```
  Replace `${port}` with the port you want to proxy.

## Contributing

- For suggestions or improvements, please submit a pull request.
- For questions, feel free to ask.