import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import api from '../src/api.js';
import {MemoryRouter as Router} from "react-router-dom";
import DishInCart from '../src/components/Cart/CartItem.jsx';

jest.mock('../src/api');

describe("DishInCart component", () => {
    const item = [{
        "id": 1,
        "title": "Chicken Hell",
        "description": "-",
        "price": 12.0,
        "photo": "http://127.0.0.1:8000/media/img/food/ChikenHell.png",
        "category": 2,
        "rating": 4.8
    }]

    beforeEach(() => {
        api.get.mockImplementation((url) => {
            if (url.includes('api/items/')) {
                return Promise.resolve({status: 200, data: item});
            }
            return Promise.reject(new Error('Not found'));
        });
        api.post.mockImplementation((url) => {
            if (url.includes("api/items/cart/add")) {
                return Promise.resolve({status: 201, data: {}});
            }
            return Promise.reject(new Error('Not found'));
        });
        api.delete.mockImplementation((url) => {
            if (url.includes("api/items/cart/delete")) {
                return Promise.resolve({status: 202});
            }
            return Promise.reject(new Error('Not found'));
        });
    });

    it('renders without crashing', async () => {
        await act(async () => {
            render(<Router><DishInCart cartItem={{id: 1, item: 1, quantity: 3}} onChange={() => {
            }}/></Router>);
        });
    });

    it('matches the snapshot', async () => {
        let asFragment, getByTestId, debug;
        await act(async () => {
            const rendered = render(<Router><DishInCart cartItem={{id: 1, item: 1, quantity: 3}} onChange={() => {
            }}/></Router>);
            asFragment = rendered.asFragment;
            getByTestId = rendered.getByTestId;
        });

        expect(api.get).toHaveBeenCalledWith("api/items/", {"params": {"id": 1}});

        await waitFor(() => getByTestId("cross"));

        expect(asFragment()).toMatchSnapshot();
    })

    it('calls the onChange function when the PLUS/MINUS button is clicked', async () => {
        const mockChange = jest.fn();
        let getByTestId, asFragment;
        await act(async () => {
            const rendered = render(<Router><DishInCart cartItem={{id: 1, item: 1, quantity: 3}} onChange={mockChange}/></Router>);
            getByTestId = rendered.getByTestId;
            asFragment = rendered.asFragment;
        });

        expect(api.get).toHaveBeenCalledWith("api/items/", {"params": {"id": 1}});

        await waitFor(() => getByTestId("plus"));

        const plusButton = getByTestId("plus");
        const minusButton = getByTestId("minus");
        const crossButton = getByTestId("cross");

        fireEvent.click(plusButton);
        fireEvent.click(minusButton);
        fireEvent.click(crossButton)

        await waitFor(() => expect(mockChange).toHaveBeenCalledTimes(3));

        expect(asFragment()).toMatchSnapshot();
    });
});