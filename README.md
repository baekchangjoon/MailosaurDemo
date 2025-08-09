# MailosaurDemo

This repository contains a simple full‑stack prototype demonstrating how to use [Mailosaur](https://mailosaur.com) to test OTP email flows end‑to‑end.

It consists of three projects:

- `backend`: A Spring Boot 3 REST API that generates one‑time passwords, stores them in memory, sends them via Mailosaur's SMTP service, and verifies the code to reveal a dummy password.
- `otp-frontend`: A Vite/React app providing a login form with a “forgot password” modal. It calls the backend API to request an OTP, accepts the code from the user, and displays the password on success.
- `otp-e2e`: A Playwright test suite (TypeScript) that drives the frontend and uses the Mailosaur API to read the OTP email automatically, then fills the code into the UI and asserts that the password appears
## Prerequisites

- Java 17+ and Maven 3.x for the backend.
- Node.js 18+ and npm for the frontend and tests.
  
 ## Running with Docker Compose

If you prefer to run the whole demo without installing Java or Node locally, you can use the provided `docker-compose.yml` to build and start both the backend and frontend together.

1. Make sure Docker and Docker Compose are installed.
2. Export your Mailosaur credentials and test email as environment variables, then run Docker Compose:

```bash
export MAILOSAUR_SMTP_USERNAME=<your server id>
export MAILOSAUR_SMTP_PASSWORD=<your SMTP password>
export MAILOSAUR_SERVER_ID=<your server id>
export MAILOSAUR_API_KEY=<your API key>
export TEST_EMAIL=<your test email>
export MAIL_SUBJECT="[Demo] Your OTP Code"

docker-compose up --build
```

This builds the Spring Boot backend and the Vite frontend and starts them. Once running, visit `http://localhost:5173` to use the demo. The backend API is available at `http://localhost:8080`.

To run the end-to-end tests against the live services, open another terminal and run:

```bash
cd otp-e2e
npm install
npx playwright install --with-deps
npx playwright test --headed
```

The `--headed` flag shows the browser UI during the test.

When you're finished, stop the services with:

```bash
docker-compose down
```

 Mailosaur account with a server created. You will need:
  - SMTP username and password (server ID and SMTP password) for sending emails.
  - API key and server ID for reading emails.
  - A test email address in the form `<anything>@<serverId>.mailosaur.net`.

## Running the backend

The backend uses the Spring `spring-boot-starter-mail` module to send OTP emails through Mailosaur.

1. From the `backend` directory run:

   ```bash
   export MAILOSAUR_SMTP_USERNAME=<your server id>
   export MAILOSAUR_SMTP_PASSWORD=<your smtp password>
   mvn clean spring-boot:run
   ```

   The application will start on port `8080`. The OTP TTL is configured in `application.yml`.

## Running the frontend

1. From the `otp-frontend` directory install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

   By default Vite serves the app on `http://localhost:5173`. The frontend expects the backend API at `/api/otp`. When running locally you can configure Vite's proxy in `vite.config.js` or run both services on the same domain.

## End‑to‑end tests with Playwright

The `otp-e2e` project contains a Playwright test that automates the forgot‑password flow.

1. Copy `.env.example` in `otp-e2e` to `.env` and fill in your details:

   ```
   BASE_URL=http://localhost:5173
   MAILOSAUR_API_KEY=ms_xxxxxxxxxxxxxxxxxxxx
   MAILOSAUR_SERVER_ID=yourServerId
   TEST_EMAIL=test@yourServerId.mailosaur.net
   MAIL_SUBJECT=[Demo] Your OTP Code
   ```

2. Install dependencies and run the tests:

   ```bash
   cd otp-e2e
   npm install
   npx playwright install
   npm test
   ```

   The test will:
   - Navigate to the login page.
   - Trigger the forgot password flow.
   - Wait for an email to arrive in Mailosaur, extract the 6‑digit OTP and enter it.
   - Verify that the revealed password text appears.

Ensure the backend and frontend are running before executing the Playwright tests.

---

This demo illustrates how Mailosaur can simplify testing of email‑based verification flows by providing disposable addresses, SMTP sending and a powerful API for retrieving and asserting email content.
