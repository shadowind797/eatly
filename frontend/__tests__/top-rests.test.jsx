import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import api from '../src/api.js';
import {MemoryRouter as Router} from "react-router-dom";
import TopRests from '../src/components/TopRests.jsx';

jest.mock('../src/api');

describe("Top-Restaurants component", () => {
    beforeEach(() => {
        api.get.mockResolvedValue({
            data: [{
                "id": 2,
                "name": "The Burger King",
                "address": "-",
                "rating": 4.9,
                "category_id": 2,
                "image": "http://127.0.0.1:8000/media/img/rests/mcdonalds.jpg"
            }, {
                "id": 5,
                "name": "Maurice",
                "address": "-",
                "rating": 4.9,
                "category_id": 3,
                "image": "http://127.0.0.1:8000/media/img/rests/mcdonalds.jpg"
            }, {
                "id": 1,
                "name": "The Chicken King",
                "address": "-",
                "rating": 4.8,
                "category_id": 1,
                "image": "http://127.0.0.1:8000/media/img/rests/burgerking.jpg"
            }]
        });
    });

    it('renders without crashing', async () => {
        await act(async () => {
            render(<Router><TopRests/></Router>);
        })
    });

    it('matches the snapshot', async () => {
        let asFragment;
        await act(async () => {
            const rendered = render(<Router><TopRests/></Router>);
            asFragment = rendered.asFragment;
        });

        await waitFor(() => {
            expect(asFragment()).toMatchSnapshot();
        });
    });
})
