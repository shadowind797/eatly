import React from "react";
import {act, screen, render, waitFor} from "@testing-library/react";
import {userEvent} from "@testing-library/user-event"
import {MemoryRouter as Router} from "react-router-dom";

import Form from "../src/components/Form.jsx"

let container = null;
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    if (container.parentNode) {
        container.parentNode.removeChild(container);
    }
    container = null;
});

test("Tests signup form", async () => {
    render(
        <Router><Form route="/api/user/register/" method="register"/></Router>
        , container);

    const usernameInput = screen.getByPlaceholderText("USERNAME");
    const passwordInput = screen.getByPlaceholderText("PASSWORD");
    const emailInput = screen.getByPlaceholderText("EMAIL");
    const phoneInput = screen.getByPlaceholderText("PHONE (OPTIONAL)");
    const repeatPassInput = screen.getByPlaceholderText("REPEAT PASSWORD");

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(passwordInput, "testpassword");
    await userEvent.type(emailInput, "testuser@example.com");
    await userEvent.type(phoneInput, "+1234567890");
    await userEvent.type(repeatPassInput, "testpassword");

    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("testpassword");
    expect(emailInput.value).toBe("testuser@example.com");
    expect(phoneInput.value).toBe("+1234567890");
    expect(repeatPassInput.value).toBe("testpassword");

    const button = document.getElementById("action").querySelector("button");
    userEvent.click(button)

    waitFor(() => {
        expect(button.textContent).toBe("Trying to Sign Up...");
    });

    const error = document.getElementsByClassName("auth-error")[0];

    act(async () => {
        await userEvent.type(emailInput, "test");
        userEvent.click(button)
        waitFor(() => {
            expect(error.textContent).toBe("Invalid email address");
        });
    })
});

test("Tests login form", async () => {
    render(
        <Router><Form route="/api/token/" method="login"/></Router>, container);

    const usernameInput = screen.getByPlaceholderText("USERNAME");
    const passwordInput = screen.getByPlaceholderText("PASSWORD");

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(passwordInput, "testpassword");

    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("testpassword");

    const button = document.getElementById("action").querySelector("button");
    userEvent.click(button);

    waitFor(() => {
        expect(button.textContent).toBe("Trying to Log In...");
    });
})
