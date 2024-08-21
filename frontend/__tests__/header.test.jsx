import React from 'react';
import {render, waitFor, act} from '@testing-library/react';
import api from '../src/api.js';
import {MemoryRouter as Router} from "react-router-dom";
import Header from '../src/components/BaseHeader.jsx';

jest.mock('../src/api');

describe('Header component', () => {
    beforeEach(() => {
        api.get.mockResolvedValue({
            data: [
                {
                    pageName: "admin",
                    slug: "/admin/",
                    name: "Admin"
                },
                {
                    pageName: "manage",
                    slug: "/manage/",
                    name: "Manage"
                },
                {
                    pageName: "orders",
                    slug: "/orders/",
                    name: "Orders"
                }
            ]
        });
    });

    it("renders correctly", async () => {
        await act(async () => {
            render(<Router><Header page="home"/></Router>);
        });
    });

    it('matches the snapshot', async () => {
        let asFragment;
        await act(async () => {
            const rendered = render(<Router><Header page="home"/></Router>);
            asFragment = rendered.asFragment;
        });

        await waitFor(() => {
            expect(asFragment()).toMatchSnapshot();
        });
    });
});