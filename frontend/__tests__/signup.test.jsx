import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import api from '../src/api.js';
import {MemoryRouter as Router} from "react-router-dom";
import Form from '../src/components/Form.jsx';

jest.mock('../src/api');

describe('Signup form component', () => {
    it('renders without crashing', async () => {
        await act(async () => {
            render(<Router><Form route="signup" method="register"/></Router>);
        });
    });

    it('matches the snapshot', async () => {
        let container;
        await act(async () => {
            ({container} = render(<Router><Form route="signup" method="register"/></Router>));
        });
        expect(container).toMatchSnapshot();
    });

    it('handles form submission', async () => {
        api.post.mockResolvedValue({
            status: 200,
        });

        let getByText, getByPlaceholderText;
        await act(async () => {
            ({getByText, getByPlaceholderText} = render(
                <Router><Form route="signup" method="register"/></Router>
            ));
        });

        const passwordInput = getByPlaceholderText('PASSWORD');
        const usernameInput = getByPlaceholderText('USERNAME');
        const emailInput = getByPlaceholderText('EMAIL');
        const pass2Input = getByPlaceholderText('REPEAT PASSWORD');
        const submitButton = getByText('Sign Up');

        await act(async () => {
            fireEvent.change(passwordInput, {target: {value: 'user123'}});
            fireEvent.change(usernameInput, {target: {value: 'pass123'}});
            fireEvent.change(emailInput, {target: {value: 'test@eatly.com'}});
            fireEvent.change(pass2Input, {target: {value: 'user123'}});
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(api.post).toHaveBeenCalled();
        });
    });

    it('handles invalid form submission', async () => {
        let getByText, getByPlaceholderText;
        await act(async () => {
            ({getByText, getByPlaceholderText} = render(
                <Router><Form route="signup" method="register"/></Router>
            ));
        });

        const passwordInput = getByPlaceholderText('PASSWORD');
        const pass2Input = getByPlaceholderText('REPEAT PASSWORD');
        const submitButton = getByText('Sign Up');

        await act(async () => {
            fireEvent.change(passwordInput, {target: {value: 'password123'}});
            fireEvent.change(pass2Input, {target: {value: 'pass'}});
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(getByText("Passwords aren't match").textContent).toBe("Passwords aren't match");
        });
    });

    it('handles error from API call', async () => {
        api.post.mockRejectedValue({
            response: {
                status: 400,
                data: {
                    username: ["User already exists"]
                }
            }
        });

        let getByText, getByPlaceholderText;
        await act(async () => {
            ({getByText, getByPlaceholderText} = render(
                <Router><Form route="signup" method="register"/></Router>
            ));
        });

        const passwordInput = getByPlaceholderText('PASSWORD');
        const usernameInput = getByPlaceholderText('USERNAME');
        const emailInput = getByPlaceholderText('EMAIL');
        const pass2Input = getByPlaceholderText('REPEAT PASSWORD');
        const submitButton = getByText('Sign Up');

        await act(async () => {
            fireEvent.change(passwordInput, {target: {value: 'user123'}});
            fireEvent.change(usernameInput, {target: {value: 'pass123'}});
            fireEvent.change(emailInput, {target: {value: 'test@eatly.com'}});
            fireEvent.change(pass2Input, {target: {value: 'user123'}});
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(getByText("User already exists").textContent).toBe("User already exists");
        });
    });
});