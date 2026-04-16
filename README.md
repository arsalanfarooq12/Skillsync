This README is designed to serve as the definitive technical manual for your **SkillSync**. It covers the architecture, security layers, and a deep dive into how every function operates.

---

# 180°C SkillSync Backend API (v1.0)

A production-grade, RESTful API built for a skill-swapping marketplace. This backend leverages a "Security-First" approach with dual-token authentication and schema-based validation.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Auth:** JSON Web Tokens (JWT) + HttpOnly Cookies

---

## 🛠️ Core Architectural Patterns

### 1. Global Error Handling

We use a **Universal Error Middleware**. Instead of `try/catch` blocks in every controller, we use a `catchAsync` Higher-Order Function.

- **How it works:** It wraps the controller and catches any rejected Promises, automatically passing the error to `next()`, which is then handled by a centralized `globalErrorHandler`.

### 2. Dual-Token Authentication

- **Access Token:** Short-lived (15m), sent in the JSON body.
- **Refresh Token:** Long-lived (7d), sent via an **HttpOnly cookie**. This prevents XSS attacks from stealing the session.

---

## 📞 API Reference & Functionality

### 🔐 Authentication (`/api/auth`)

| Function   | Method | Description                                                                                                                         |
| :--------- | :----- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `register` | `POST` | Validates input via Zod. Hashes password using bcrypt. Creates a new user in Prisma and returns an Access Token.                    |
| `login`    | `POST` | Verifies credentials. Generates dual tokens. Sets the Refresh Token in a secure cookie.                                             |
| `refresh`  | `POST` | Reads the Refresh Token cookie. If valid, issues a brand new Access Token. This allows the mobile app to stay logged in seamlessly. |
| `logout`   | `POST` | Sends a command to the client to expire and clear the Refresh Token cookie.                                                         |

### 🛠️ Skills Management (`/api/skills`)

| Function       | Method   | Description                                                                                                         |
| :------------- | :------- | :------------------------------------------------------------------------------------------------------------------ |
| `createSkill`  | `POST`   | **Protected.** Validates skill data (title, category). Links the skill to the `req.user.id` extracted from the JWT. |
| `getAllSkills` | `GET`    | Fetches all skills available for trade. Includes the owner's name and bio via Prisma relations.                     |
| `deleteSkill`  | `DELETE` | **Protected.** Verifies that the `userId` of the skill matches the `id` of the requester before allowing deletion.  |

### 🤝 Trades (`/api/trades`)

| Function       | Method  | Description                                                                                                                                |
| :------------- | :------ | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `requestTrade` | `POST`  | **Protected.** Creates a trade record with status `PENDING`. Prevents users from requesting trades with themselves.                        |
| `getMyTrades`  | `GET`   | **Protected.** Uses an `OR` query in Prisma to find all trades where the user is either the **Requester** or the **Provider**.             |
| `updateStatus` | `PATCH` | **Protected.** Allows the **Provider** to update the status to `ACCEPTED` or `REJECTED`. Logic prevents the Requester from self-approving. |

---

## 🛡️ Security Layers

1.  **Rate Limiting:** Prevents brute-force attacks on `/login` and `/register`.
2.  **Helmet:** Secures Express apps by setting various HTTP headers.
3.  **Zod Schemas:** Ensures that `req.body` exactly matches the required types (e.g., valid emails, UUIDs) before the database is even queried.
4.  **CORS:** Configured to only allow requests from the specific mobile app IP/Domain.

---

## 📂 Project Structure

```text
/src
 ├── /controllers    # Logic for each route
 ├── /validations    # Zod schemas (Data Bouncers)
 ├── /middleware     # Auth, Error, and Rate Limiters
 ├── /utils          # AppError class and catchAsync wrapper
 ├── /routes         # Route definitions
 └── /lib            # Prisma client instance
```

## ⚙️ Environment Variables

To run this project, you will need to add the following variables to your `.env` file:

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: For Access Tokens.
- `JWT_REFRESH_SECRET`: For Refresh Tokens.
- `NODE_ENV`: Set to `development` or `production`.
