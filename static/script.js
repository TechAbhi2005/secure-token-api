
"use strict";

const LOGIN_URL = "/login";
const REGISTER_URL = "/register";
const PROTECTED_URL = "/protected";

let accessToken = null;
let currentUsername = "";

const $ = (id) => document.getElementById(id);

const mainLayout = $("main-layout");
const loginForm = $("login-form");
const registerForm = $("register-form");

const loginSection = $("login-section");
const registerSection = $("register-section");
const dashboard = $("dashboard");

const loginButton = $("login-button");
const registerButton = $("register-button");
const protectedButton = $("protected-button");

const loginMessage = $("login-message");
const registerMessage = $("register-message");

const tokenDisplay = $("token-display");
const tokenExpiry = $("token-expiry");
const protectedResult = $("protected-result");
const activityList = $("activity-list");

const statAuthStatus = $("stat-auth-status");
const statExpiry = $("stat-expiry");
const statApiStatus = $("stat-api-status");

function showMessage(element, message, isError = false) {
    element.textContent = message;
    element.className = "message";

    if (message) {
        element.classList.add(isError ? "error" : "success");
    }
}

function addActivity(message) {
    const item = document.createElement("li");

    item.textContent =
        `${new Date().toLocaleTimeString()} — ${message}`;

    activityList.prepend(item);

    // Keep only the latest eight activity entries.
    while (activityList.children.length > 8) {
        activityList.lastElementChild.remove();
    }
}

function showResult(data, isError = false) {
    protectedResult.textContent =
        typeof data === "string"
            ? data
            : JSON.stringify(data, null, 2);

    protectedResult.classList.remove("hidden");
    protectedResult.classList.toggle("error-result", isError);
}

function setBusy(button, busy, normalText, busyText) {
    button.disabled = busy;

    const label = button.querySelector("span");

    if (label) {
        label.textContent = busy ? busyText : normalText;
    }
}

function decodeTokenExpiry(token) {
    try {
        const payloadPart = token.split(".")[1];

        const normalized = payloadPart
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const payload = JSON.parse(atob(normalized));

        if (!payload.exp) {
            return "Expiry is not included in this token.";
        }

        return "Expires: " +
            new Date(payload.exp * 1000).toLocaleString();
    } catch {
        return "Token expiry could not be displayed.";
    }
}

function clearSession() {
    accessToken = null;
    currentUsername = "";

    tokenDisplay.value = "";
    tokenExpiry.textContent = "No active token";
    $("user-label").textContent = "";

    statAuthStatus.textContent = "Signed out";
    statExpiry.textContent = "No active token";
    statApiStatus.textContent = "Ready";
}

function showLogin() {
    loginSection.classList.remove("hidden");
    registerSection.classList.add("hidden");
    dashboard.classList.add("hidden");

    mainLayout.classList.remove("dashboard-mode");

    showMessage(loginMessage, "");
    showMessage(registerMessage, "");
}

function showDashboard() {
    loginSection.classList.add("hidden");
    registerSection.classList.add("hidden");
    dashboard.classList.remove("hidden");

    mainLayout.classList.add("dashboard-mode");
}

// Switch to registration.
$("show-register-button").addEventListener("click", () => {
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
    dashboard.classList.add("hidden");

    mainLayout.classList.remove("dashboard-mode");

    showMessage(loginMessage, "");
    showMessage(registerMessage, "");
});

// Switch back to login.
$("show-login-button").addEventListener("click", () => {
    showLogin();
});

// Register a new user.
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = $("register-username").value.trim();
    const password = $("register-password").value;

    if (!username || !password) {
        showMessage(
            registerMessage,
            "Please enter both a username and password.",
            true
        );
        return;
    }

    showMessage(registerMessage, "");

    setBusy(
        registerButton,
        true,
        "Create secure account",
        "Creating account..."
    );

    try {
        const response = await fetch(REGISTER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.msg ||
                data.message ||
                `Registration failed (${response.status})`
            );
        }

        showMessage(
            registerMessage,
            "Account created successfully! You can now log in."
        );

        addActivity(`Account registered: ${username}`);
        registerForm.reset();

    } catch (error) {
        showMessage(registerMessage, error.message, true);
        addActivity("Account registration failed.");
    } finally {
        setBusy(
            registerButton,
            false,
            "Create secure account",
            "Creating account..."
        );
    }
});

// Log in and receive a JWT.
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = $("username").value.trim();
    const password = $("password").value;

    showMessage(loginMessage, "");

    setBusy(
        loginButton,
        true,
        "Authenticate securely",
        "Authenticating..."
    );

    try {
        const response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.msg ||
                data.message ||
                `Login failed (${response.status})`
            );
        }

        const token = data.access_token || data.token;

        if (!token) {
            throw new Error(
                "The server did not return an access token."
            );
        }

        accessToken = token;
        currentUsername = username;

        tokenDisplay.value = accessToken;
        $("user-label").textContent = currentUsername;

        tokenExpiry.textContent = decodeTokenExpiry(accessToken);

        statAuthStatus.textContent = "Active";
        statExpiry.textContent = data.expires_in
            ? `Expires in ${data.expires_in}`
            : "Expiry is managed by the server";

        statApiStatus.textContent = "Ready";

        protectedResult.textContent = "";
        protectedResult.classList.add("hidden");
        protectedResult.classList.remove("error-result");

        showDashboard();

        loginForm.reset();

        addActivity("Login successful — JWT received.");
        addActivity("Security dashboard opened.");

    } catch (error) {
        showMessage(loginMessage, error.message, true);
        addActivity("Login failed.");
    } finally {
        setBusy(
            loginButton,
            false,
            "Authenticate securely",
            "Authenticating..."
        );
    }
});

// Test the protected Flask endpoint.
protectedButton.addEventListener("click", async () => {
    if (!accessToken) {
        showResult("Please log in again to continue.", true);
        return;
    }

    setBusy(
        protectedButton,
        true,
        "Test protected endpoint",
        "Verifying token..."
    );

    try {
        const response = await fetch(PROTECTED_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        const data = await response.json().catch(() => ({}));

        showResult(data, !response.ok);

        statApiStatus.textContent = response.ok
            ? "Verified"
            : "Rejected";

        if (response.ok) {
            addActivity(
                "Protected endpoint accessed successfully."
            );
        } else {
            addActivity(
                `Protected request rejected: HTTP ${response.status}.`
            );

            if (response.status === 401) {
                clearSession();

                showResult(
                    "Your token is invalid or expired. Please log in again.",
                    true
                );

                addActivity("Session cleared after authentication failure.");
                showLogin();
                showMessage(
                    loginMessage,
                    "Your session expired or became invalid. Please log in again.",
                    true
                );
            }
        }
    } catch {
        showResult(
            "Unable to contact the server. Check that Flask is running.",
            true
        );

        statApiStatus.textContent = "Unavailable";
        addActivity("Could not connect to the protected endpoint.");
    } finally {
        setBusy(
            protectedButton,
            false,
            "Test protected endpoint",
            "Verifying token..."
        );
    }
});

// Copy the JWT token.
$("copy-token").addEventListener("click", async () => {
    if (!accessToken) {
        showResult("Please log in first.", true);
        return;
    }

    try {
        await navigator.clipboard.writeText(accessToken);
        addActivity("JWT copied to clipboard.");
    } catch {
        showResult(
            "Clipboard access is unavailable. Select the token and copy it manually.",
            true
        );
    }
});

// Log out and clear the browser's in-memory token.
$("logout-button").addEventListener("click", () => {
    clearSession();

    loginForm.reset();
    registerForm.reset();

    protectedResult.textContent = "";
    protectedResult.classList.add("hidden");
    protectedResult.classList.remove("error-result");

    showLogin();

    showMessage(
        loginMessage,
        "You have logged out successfully."
    );

    addActivity("Logged out — browser token cleared.");
});

// Show or hide password fields.
document.querySelectorAll(".eye-button").forEach((button) => {
    button.addEventListener("click", () => {
        const input = $(button.dataset.target);

        if (!input) {
            return;
        }

        input.type = input.type === "password"
            ? "text"
            : "password";
    });
});

// Generate subtle animated background particles.
const particleContainer = $("particles");

for (let i = 0; i < 24; i++) {
    const particle = document.createElement("span");

    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration =
        `${10 + Math.random() * 16}s`;
    particle.style.animationDelay =
        `${-Math.random() * 20}s`;
    particle.style.opacity =
        `${0.2 + Math.random() * 0.6}`;

    particleContainer.appendChild(particle);
}