import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import api from '../src/api.js';
import {MemoryRouter as Router} from "react-router-dom";
import TopDishes from '../src/components/TopDishes.jsx';

jest.mock('../src/api');

describe("Top-Dishes component", () => {
    beforeEach(() => {
        api.get.mockResolvedValue({
            data: [{
                "id": 27,
                "title": "Cookie",
                "description": "-",
                "price": 12.0,
                "photo": "http://127.0.0.1:8000/media/img/food/foodimg1.png",
                "category": 7,
                "rating": 5.0
            }, {
                "id": 5,
                "title": "Swe Dish",
                "description": "-",
                "price": 19.0,
                "photo": "http://127.0.0.1:8000/media/img/food/SweDish.png",
                "category": 1,
                "rating": 4.9
            }, {
                "id": 13,
                "title": "Steak",
                "description": "-",
                "price": 14.0,
                "photo": "http://127.0.0.1:8000/media/img/food/foodimg1.png",
                "category": 1,
                "rating": 4.9
            }, {
                "id": 8,
                "title": "Cheeseburger",
                "description": "-",
                "price": 14.0,
                "photo": "http://127.0.0.1:8000/media/img/food/ChikenHell.png",
                "category": 3,
                "rating": 4.9
            }, {
                "id": 1,
                "title": "Chicken Hell",
                "description": "-",
                "price": 12.0,
                "photo": "http://127.0.0.1:8000/media/img/food/ChikenHell.png",
                "category": 2,
                "rating": 4.8
            }]
        });
    });

    it('renders without crashing', async () => {
        await act(async () => {
            render(<Router><TopDishes/></Router>);
        })
    });

    it('matches the snapshot', async () => {
        let asFragment;
        await act(async () => {
            const rendered = render(<Router><TopDishes/></Router>);
            asFragment = rendered.asFragment;
        });

        await waitFor(() => {
            expect(asFragment()).toMatchSnapshot();
        });
    });
})
