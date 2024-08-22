import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import api from '../src/api.js';
import {MemoryRouter as Router} from "react-router-dom";
import Restaurant from '../src/components/RestaurantCard.jsx';

jest.mock('../src/api');

describe("Restaurant component", () => {
    const mockRestData = [{"id": 1, "name": "Healthy"},
        {"id": 3, "name": "Supreme"},
        {"id": 2, "name": "Trending"}]
    const item = {
        "id": 2,
        "name": "The Burger King",
        "address": "-",
        "rating": 4.9,
        "category_id": 2,
        "image": "http://127.0.0.1:8000/media/img/rests/mcdonalds.jpg"
    }

    beforeEach(() => {
        api.get.mockImplementation((url) => {
            if (url.includes('api/restaurants/categories/')) {
                return Promise.resolve({data: mockRestData});
            }
            return Promise.reject(new Error('Not found'));
        });
    });

    it('renders without crashing', async () => {
        await act(async () => {
            render(<Router><Restaurant rest={item}/></Router>);
        });
    });

    it('matches the snapshot', async () => {
        let asFragment;
        await act(async () => {
            const rendered = render(<Router><Restaurant rest={item}/></Router>);
            asFragment = rendered.asFragment;
        });

        await waitFor(() => {
            expect(asFragment()).toMatchSnapshot();
        });
        expect(api.get).toHaveBeenCalledWith("api/restaurants/categories/");
    });
});