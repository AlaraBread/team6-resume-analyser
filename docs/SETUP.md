# Project Setup

## Frontend

The frontend is in `/frontend`. It is a [next.js](https://nextjs.org/) project that uses [npm](https://www.npmjs.com/) and [node](https://nodejs.org/en).

1. Please ensure you have [node.js](https://nodejs.org/en) installed on your machine.
2. ```sh
   cd frontend
   ```
3. ```sh
   npm install
   ```

### Formatting

We are using prettier for formatting the frontend.

#### in vscode (reccomended)

If you are using vscode, please install [the prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and set it up to "format on save". You can follow [this guide](https://www.digitalocean.com/community/tutorials/how-to-format-code-with-prettier-in-visual-studio-code) up to and including step 2.

#### from the command line

If you are using another editor that doesnt support prettier, or you can't set it up for some reason, you can also format your code using

(in `frontend`)
```sh
npm run format
```

### Linting

We are using eslint for linting the frontend.

#### in vscode (reccomended)

Please install [the eslint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for vscode.

#### from the command line

If you are using another editor that doesnt support eslint, or you can't set it up for some reason, you can also lint your code using

(in `frontend`)
```sh
npm run lint
```

### Check

To run the same checks that run in ci on your local, you can run

(in `frontend`)
```sh
npm run check
```

## Backend

The backend is in `/backend`. It is an [oak server](https://oakserver.org/) that uses [deno](https://deno.com/).

### Project setup

1. Please ensure you have [deno](https://deno.com/) installed on your machine.
2. ```sh
   cd backend
   ```
3. ```sh
   deno install
   ```
4. Set up the environment variables:

   **Step 4.1:** Create a file named `local.env` inside the `backend` directory. The directory structure should look similar to this:
   ```bash
   .
   ├── api
   ├── in_memory
   ├── local.env
   ├── middleware
   └── util
   ```

   **Step 4.2:** Create an account on [Platform OpenAI](https://platform.openai.com).

   **Step 4.3:** Generate an API token:
   - Go to your Platform OpenAI account settings.
   - Navigate to **Usage**.
   - Confirm under **Credit Grants** an inital free $5.00.
   - Navigate to **API keys**.
   - Select **+ Create new secret key**.
   - Choose **You** as the key owner.
   - Assign a name to your key.
   - Assign a project for your key. **Default project** is fine.
   - Under **Permissions**, select **All**.
   - Click **Create secret key**.

   **Step 4.4:** Copy the generated secret key.

   **Step 4.5:** Add the secret key to your `local.env` file as an environment variable. Use the following format:
   ```env
   OPENAI_API_KEY=your-token-key
   ```
   - Replace `your-token-key` with the actual token key.
   - Do **not** enclose the token key in any kind of quotes.

### Formatting

We are using deno for formatting the backend.

#### in vscode (reccomended)

If you are using vscode, please install the [deno extension for vscode](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno). If you [setup vscode to format on save for the frontend](#in-vscode-reccomended), that should also work here.

#### from the command line

If you are using another editor that doesnt support deno, or you can't set it up for some reason, you can also format your code using

(in `backend`)
```bash
deno fmt
```

### Linting

We are using deno for linting the backend.

#### in vscode (reccomended)

If you have the deno extension installed, you should get linting information in vscode.

#### from the command line

If you are using another editor that doesnt support deno, or you can't set it up for some reason, you can also lint your code using

(in `backend`)
```bash
deno lint
```

### Check

To run the same checks that run in ci on your local, you can run

(in `frontend`)
```sh
deno run check
```

## Pre Commit Hook

If you want a pre commit hook that checks file naming, checks formatting, lints, and runs tests, there is a script in `hooks/pre-commit`. To install it, copy `hooks/pre-commit` to `.git/hooks`.

```sh
cp hooks/pre-commit .git/hooks
```
