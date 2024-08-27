import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import api from '../src/api.js';
import {MemoryRouter as Router} from "react-router-dom";
import Dish from '../src/components/Dish.jsx';

jest.mock('../src/api');

describe("Dish component", () => {
    const mockDishData = [{"id": 2, "name": "Asian"},
        {"id": 7, "name": "Desserts"}, {"id": 3, "name": "Fast Food"}, {"id": 6, "name": "Fish"},
        {"id": 4, "name": "Ice"}, {"id": 1, "name": "Meat"}, {"id": 5, "name": "Salads"}]
    const mockInCartData = {"is_in_cart": false}
    const item = {
        "id": 1,
        "title": "Chicken Hell",
        "description": "-",
        "price": 12.0,
        "photo": "http://127.0.0.1:8000/media/img/food/ChikenHell.png",
        "category": 2,
        "rating": 4.8
    }

    beforeEach(() => {
        api.get.mockImplementation((url) => {
            if (url.includes('api/items/category/')) {
                return Promise.resolve({data: mockDishData});
            }
            if (url.includes('api/items/cart/check')) {
                return Promise.resolve({status: 204, data: mockInCartData});
            }
            return Promise.reject(new Error('Not found'));
        });
        api.post.mockImplementation((url) => {
            if (url.includes("api/items/cart/add")) {
                return Promise.resolve({status: 201, data: {}});
            }
            return Promise.reject(new Error('Not found'));
        });
    });

    it('renders without crashing', async () => {
        await act(async () => {
            render(<Router><Dish item={item}/></Router>);
        });
    });

    it('matches the snapshot', async () => {
        let asFragment;
        await act(async () => {
            const rendered = render(<Router><Dish item={item}/></Router>);
            asFragment = rendered.asFragment;
        });

        await waitFor(() => {
            expect(asFragment()).toMatchSnapshot();
        });
        expect(api.get).toHaveBeenCalledWith("api/items/cart/check", {
            "params": {
                "item": 1,
                "extra": {}
            }
        });
    });

    it("pushes item in cart", async () => {
        let getByTestId;
        await act(async () => {
            ({getByTestId} = render(<Router><Dish item={item}/></Router>));
        });

        await waitFor(() => {
            const addToCartButton = getByTestId("add-to-cart-button");
            expect(addToCartButton).toBeTruthy();
        });

        await act(async () => {
            fireEvent.click(getByTestId("add-to-cart-button"));
        });

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("api/items/cart/add", {"item": 1, "quantity": 1});
            expect(api.get).toHaveBeenCalledWith("api/items/cart/check", {
                "params": {
                    "item": 1,
                    "extra": "true"
                }
            });
        });
    });
});