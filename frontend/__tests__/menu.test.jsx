import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import api from '../src/api.js';
import {MemoryRouter as Router} from "react-router-dom";
import Menu from '../src/pages/Menu.jsx';

jest.mock('../src/components/TopDishes.jsx', () => () => <div data-testid="mock-dishes"/>);
jest.mock('../src/components/TopRests.jsx', () => () => <div data-testid="mock-rests"/>);
jest.mock('../src/api');

describe('Menu component', () => {
    api.get.mockImplementation((url) => {
        if (url.includes('api/items/search')) {
            return Promise.resolve({
                status: 200, data: [
                    {
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
        }
        return Promise.reject(new Error('Not found'));
    });

    it('renders without crashing', () => {
        render(<Router><Menu/></Router>);
    });

    it('matches the snapshot', () => {
        const {asFragment} = render(<Router><Menu/></Router>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('searches dishes', async () => {
        const {
            getByTestId
        } = render(<Router><Menu/></Router>);

        const searchInput = getByTestId("search-input");
        const searchButton = getByTestId("search-btn");

        fireEvent.change(searchInput, {target: {value: 'burger'}});
        fireEvent.click(searchButton)

        await waitFor(async () => {
            expect(api.get).toHaveBeenCalledWith("api/items/search", {params: {search: "burger", search_mode: "food"}})
        })
    })

    it('searches rests', async () => {
        const {
            getByTestId
        } = render(<Router><Menu/></Router>);

        const searchInput = getByTestId("search-input");
        const searchButton = getByTestId("search-btn");
        const SMRests = getByTestId("SM-rests")

        fireEvent.change(searchInput, {target: {value: 'burger'}});
        fireEvent.click(SMRests)
        fireEvent.click(searchButton)

        await waitFor(async () => {
            expect(api.get).toHaveBeenCalledWith("api/items/search", {params: {search: "burger", search_mode: "rests"}})
        })
    })
})
