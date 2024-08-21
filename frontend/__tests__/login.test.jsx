// Form.test.js
import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import {useState} from 'react';
import api from '../src/api.js';
import {MemoryRouter as Router} from "react-router-dom";
import Form from '../src/components/Form.jsx';

jest.mock('../src/api');

describe('Form component', () => {
    it('renders without crashing', () => {
        render(<Router><Form route="login" method="login"/></Router>);
    });

    it('matches the snapshot', () => {
        const {asFragment} = render(<Router><Form route="login" method="login"/></Router>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('handles form submission', async () => {
        api.post.mockResolvedValue({
            data: {
                access: 'token123',
                refresh: 'token456',
            },
        });

        const {getByText, getByPlaceholderText} = render(
            <Router><Form route="login" method="login"/></Router>
        );

        const passwordInput = getByPlaceholderText('PASSWORD');
        const usernameInput = getByPlaceholderText('USERNAME');
        const submitButton = getByText('Log In');

        fireEvent.change(passwordInput, {target: {value: 'user123'}});
        fireEvent.change(usernameInput, {target: {value: 'pass123'}});
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(window.location.pathname).toBe('/');
        });
    });
    it('handles invalid form submission', async () => {
        const {
            getByText,
            getByPlaceholderText
        } = render(
            <Router><Form route="login" method="login"/></Router>
        );

        const passwordInput = getByPlaceholderText('PASSWORD');
        const submitButton = getByText('Log In');

        fireEvent.change(passwordInput, {target: {value: 'password123'}});
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(getByText('Username is required')
                .textContent).toBe('Username is required')
        });
    });

    it('handles error from API call', async () => {
        api.post.mockRejected({
            response: {
                status: 400,
                data: {
                    detail: "We haven't users with given credentials"
                }
            }
        });

        const {getByText, getByPlaceholderText, getByText: getErrorText} = render(
            <Router><Form route="login" method="login"/></Router>
        );

        const passwordInput = getByPlaceholderText('PASSWORD');
        const password2Input = getByPlaceholderText('USERNAME');
        const submitButton = getByText('Log In');

        fireEvent.change(passwordInput, {target: {value: 'password123'}});
        fireEvent.change(password2Input, {target: {value: 'noname123'}});
        fireEvent.click(submitButton);


        await waitFor(() => {
            expect(getErrorText).toBeInTheDocument('Invalid email address');
        });
    });
});