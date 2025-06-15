# Plug-N-Auth
<img src="https://cdn.simpleicons.org/javascript" width="30" height="30" /> &nbsp;<img src="https://cdn.simpleicons.org/nodedotjs" width="30" height="30" /> &nbsp;<img src="https://cdn.simpleicons.org/express" width="30" height="30" /> &nbsp;<img src="https://cdn.simpleicons.org/mongodb" width="30" height="30" /> &nbsp;<img src="https://cdn.simpleicons.org/jsonwebtokens" width="30" height="30" />


## Overview
**Plug-N-Auth** is an _“almost”_ stateless **Authentication API** designed to help developers integrate secure user authentication without reinventing the wheel. Instead of building an entire authentication system from scratch, Plug-N-Auth offers a simple, drop-in solution via RESTful endpoints.

The API supports essential authentication flows such as user registration, login, data updates, and account deletion — all powered by secure and scalable technology like **JWT**, **Argon2**, and **MongoDB**. The system is designed with **modularity**, **security**, and **ease of use** in mind.

### Why “almost” stateless?

While Plug-N-Auth uses **JWTs** (JSON Web Tokens) to maintain stateless sessions, it includes a version check stored in the database. When a JWT is sent, the system verifies that its version matches the one stored for the user. This ensures tokens can be invalidated making the system secure — but not entirely stateless.

---

### Core Concepts

#### User Identity: `userEmail + serviceName`

**Plug-N-Auth** uses the combination of `userEmail` and `serviceName` to uniquely identify users. This allows the same email to be used across multiple apps or services without conflict — enabling true **multi-service support**.

For example:

- `alice@example.com` under `service1` and `service2` will be treated as **two separate accounts**.

This also means developers can build different products using **Plug-N-Auth** as a shared auth layer, with scoped identities per service.

### Passing `serviceName` Implicitly

To improve user experience, Developers can allow the `serviceName` to be passed implicitly in the request body rather than taking an input from user.

---

## ✅ Why Use Plug-N-Auth?

- ⚡ **Quick integration** – Set up auth in minutes via REST APIs.

- 🛡️ **Secure by default** – JWT-based auth, Argon2 password hashing, versioned token invalidation.

- 🔄 **Multi-service support** – Easily isolate user sessions between products or services.

- 🧩 **Modular** – Use only the endpoints you need.

- 💬 **Clear feedback** – All endpoints provide structured success/error messages.

## Endpoints
Plug-N-Auth exposes a set of RESTful endpoints that allow you to perform essential authentication-related operations — like signing up, logging in, updating user details, and deleting accounts.

Each endpoint is designed to be **minimal**, **stateless**, and **predictable**. Most requests involve sending the required fields via JSON in the request body. Endpoints that involve user-specific actions (like updating data) require a valid **JWT token** passed in the `Authorization` header as a Bearer token.

### 🚀 Usage Pattern

- Use `POST` for creating resources (sign-up, login).

- Use `GET` for fetching the authenticated user's status.

- Use `PUT` for updates (email, password, or other fields).

- Use `DELETE` to permanently remove the user.

| **Purpose**             | **Method** | **Endpoint**           | **Parameters**                                                            | **Notes**                                    |
| ----------------------- | ---------- | ---------------------- | ------------------------------------------------------------------------- | -------------------------------------------- |
| **Log in a user**       | `POST`     | `/user/v1/login`       | `{ userEmail, password, serviceName }`                                    | Returns JWT token if credentials are valid   |
| **Register a new user** | `POST`     | `/user/v1/signup`      | `{ userEmail, password, serviceName }`Optional: `{ firstName, lastName }` | Creates user and returns JWT token           |
| **Get user status**     | `GET`      | `/user/v1/status`      | JWT passed as Bearer Token                                                | Validates token and returns user status      |
| **Update user fields**  | `PUT`      | `/user/v1/update`      | Body: `{ fieldToUpdate }`, `{ password }`JWT in Bearer Token              | Cannot update password or email here         |
| **Update email**        | `PUT`      | `/user/v1/updateEmail` | `{ newUserEmail, password }`JWT in Bearer Token                           | Use only for email change                    |
| **Update password**     | `PUT`      | `/user/v1/updatePass`  | `{ oldPassword, newPassword, confNewPassword }`JWT in Bearer Token        | Use only for password change                 |
| **Delete user account** | `DELETE`   | `/user/v1/deleteUser`  | `{ password }`JWT in Bearer Token                                         | Irreversible – permanently deletes user data |

Below given is an example of how to hit a endpoint using `JavaScript`:
```js
async function update(body, token){

    let response = await fetch("https://plug-n-auth.onrender.com/user/v1/update",{
        method: "put",
        headers: {
            "Authorization": `Bearer ${ token }`, //JWT sent as bearer token
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    try{
        let jsonResponse = await response.json();
        console.log(jsonResponse);
    }
    catch(error){
        console.log(error);
    }
}

update(body, token);
```

These endpoints form the core of **Plug-N-Auth’s** functionality. You can interact with any of them using standard `HTTP` requests from your frontend, as demonstrated above.

To learn more about the required fields, optional parameters, and their specific formats for each endpoint, head over to the **Fields** section.

## Fields
Each endpoint expects specific fields in the request body or headers. This section outlines all the fields used across **Plug-N-Auth**, along with their purpose, type, and additional notes.

### Commonly Used Fields

| Field Name        | Type   | Required                    | Description                                                            |
| ----------------- | ------ | --------------------------- | ---------------------------------------------------------------------- |
| `userEmail`       | String | ✅ Yes                       | The user’s unique email. Paired with `serviceName` to identify a user. |
| `password`        | String | ✅ Yes                       | The user’s plain-text password (hashed on backend using Argon2).       |
| `serviceName`     | String | ✅ Yes                       | Identifies the app/service the user is signing into.                   |
| `firstName`       | String | ❌ No                        | Optional field to store user’s first name.                             |
| `lastName`        | String | ❌ No                        | Optional field to store user’s last name.                              |
| `newUserEmail`    | String | ✅ Yes (for email update)    | The new email address for the user.                                    |
| `oldPassword`     | String | ✅ Yes (for password update) | The current password before change.                                    |
| `newPassword`     | String | ✅ Yes (for password update) | The new password user wants to set.                                    |
| `confNewPassword` | String | ✅ Yes (for password update) | Confirmation of new password to avoid mismatches.                      |
| `Authorization`   | String | ✅ Yes (header)              | Bearer token (JWT) required for secured endpoints.                     |

---

### ℹ️ Field Behavior Notes

- **`userEmail + serviceName`**: This combination ensures the same email can be used for different services independently (like `plug-n-auth@xyz.com` for `service1` and `service2`).

- **`serviceName` is mandatory** and passed implicitly by the client. It helps isolate users per project.

- **JWT versioning** is used for stateless auth. Any sensitive update invalidates old tokens by changing the version in DB.

- All passwords are stored hashed using **Argon2**.

 Bearer tokens must be included in the `Authorization` header as:
 ```makefile
 Authorization: Bearer <your-token-here>
```

## Additional Information
### 🔐 Token Handling

- All tokens are **JWTs** (JSON Web Tokens) signed using a secure secret.

- Each token includes a `version` field. If the user's version changes (due to email/password update or critical info change), **previous tokens become invalid**, ensuring better security.


---

### 📦 Statelessness & DB Design

- **Plug-N-Auth is _almost_ stateless**: the server doesn't store sessions; instead, each JWT includes necessary identity claims and is verified on each request.

- The database stores a versioned user feild. Only minimal data is retained, with sensitive fields (like passwords) always hashed.

---

### ⏳ Token Expiry

- JWTs issued by **Plug-N-Auth** have a default expiry of **30 minutes**.

- After expiry, the client must log in again to obtain a new token.

---

### ❗ Error Handling

- Meaningful error Handling is performed to ensure seamless User Experience.

- All errors are handled and returned as a `JSON` response with meaningful messages.

- HTTP status codes are meaningful (e.g., `401 Unauthorized`, `400 Bad Request`, `500 Internal Server Error`).

---

### 🔨 Tools Used
- [Postman ↗](https://www.postman.com/)

- [ChatGPT ↗](https://chatgpt.com/)

- [Microsoft Copilot ↗](https://copilot.microsoft.com/)


### 🤝🏼 Connect with Me

Still have questions or Issues or want to collaborate ? Feel free to reach out !

- [Github ↗](https://github.com/nexus949)

- [Website ↗](https://nexus949.github.io/portfolio_website)

I’d love to hear your feedback — or just say hi 👋
