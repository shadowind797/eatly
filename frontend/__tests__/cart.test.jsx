import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import api from '../src/api.js';
import {MemoryRouter as Router} from "react-router-dom";
import Cart from '../src/pages/Cart.jsx';
import DishInCart from "../src/components/Cart/CartItem.jsx";

jest.mock('../src/api');

describe('Cart component', () => {
    const cartItem = [{
        "id": 1,
        "item": 1,
        "quantity": 3
    }]
    const item = [{
        "id": 1,
        "title": "Chicken Hell",
        "description": "-",
        "price": 12.0,
        "photo": "http://127.0.0.1:8000/media/img/food/ChikenHell.png",
        "category": 2,
        "rating": 4.8
    }]
    const user = [{
        "id": 1,
        "username": "shadowind",
        "email": "shadowind797@gmail.com",
        "phone": "+375666999",
        "status": 1,
        "is_banned": false,
        "ban_reason": "",
        "first_name": "Peter"
    }]
    const addresses = [
        {
            "id": 1,
            "house_address": "gfdgsf",
            "entrance": "fdgsd",
            "floor": "sdfgdf",
            "flat": "gsd"
        }, {"id": 2, "house_address": "wasdas", "entrance": "34", "floor": "34", "flat": "4"}]

    beforeEach(() => {
        api.get.mockImplementation((url) => {
            if (url.includes('api/items/cart/')) {
                return Promise.resolve({status: 200, data: cartItem});
            }
            if (url.includes('api/items/')) {
                return Promise.resolve({status: 200, data: item});
            }
            if (url.includes('api/user/')) {
                return Promise.resolve({status: 200, data: user});
            }
            if (url.includes('api/address/')) {
                return Promise.resolve({status: 200, data: addresses});
            }
            return Promise.reject(new Error('Not found'));
        });
        api.post.mockImplementation((url, data) => {
            if (url.includes("api/items/cart/add")) {
                return Promise.resolve({status: 201, data: {}});
            } else if (url.includes('api/items/')) {
                return Promise.resolve({status: 200, data: {total: 12.99}});
            }
            if (url.includes('api/coupon/')) {
                return Promise.resolve({status: 200, data: {value: 0.9}});
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
            render(<Router><Cart/></Router>);
        });
    })

    it('matches the snapshot', async () => {
        let asFragment, getByTestId, getByText
        await act(async () => {
            const rendered = render(<Router><Cart/></Router>);
            asFragment = rendered.asFragment;
            getByTestId = rendered.getByTestId;
            getByText = rendered.getAllByText;
        });

        expect(api.get).toHaveBeenCalledWith("api/items/", {"params": {"id": 1}});

        await waitFor(() => getByTestId("minus"))

        expect(asFragment()).toMatchSnapshot();

        await waitFor(() => {
            expect(getByText("$12.99")[0]).toBeTruthy();
        });
    })

    it("updates total when quantity changed", async () => {
        let getByText, getByTestId, asFragment
        await act(async () => {
            const rendered = render(<Router><Cart/></Router>);
            getByText = rendered.getAllByText;
            getByTestId = rendered.getByTestId;
            asFragment = rendered.asFragment;
        });

        expect(api.get).toHaveBeenCalledWith("api/items/", {"params": {"id": 1}});

        await waitFor(() => getByTestId("minus"))

        fireEvent.click(getByTestId("minus"));
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("api/items/cart/")
        })

        fireEvent.click(getByTestId("plus"));
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("api/items/cart/")
        })
    })

    it("updates total when coupon applied changed", async () => {
        let getByText, getByTestId, asFragment, getByPlaceholderText
        await act(async () => {
            const rendered = render(<Router><Cart/></Router>);
            getByText = rendered.getAllByText;
            getByTestId = rendered.getByTestId;
            getByPlaceholderText = rendered.getByPlaceholderText;
            asFragment = rendered.asFragment;
        });

        expect(api.get).toHaveBeenCalledWith("api/items/", {"params": {"id": 1}});

        await waitFor(() => getByTestId("minus"))

        fireEvent.change(getByPlaceholderText("Apply Coupon"), {target: {value: "TESTCOUPON"}})

        fireEvent.click(getByText("Apply")[0]);
        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("api/coupon/", {
                "data": {"method": "apply", "title": "TESTCOUPON"}
            })
        })
    })
})
