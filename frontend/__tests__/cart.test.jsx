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
        "first_name": ""
    }]
    const addresses = [{
        id: 2,
        house_address: "Mirobod street 12, Tashkent, UZ",
        entrance: "2",
        floor: "4",
        flat: "34"
    }]

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
            if (url.includes('api/address/add/')) {
                return Promise.resolve({status: 201});
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

    it("updates total when coupon applied", async () => {
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
            expect(getByText("-$1.43")[0]).toBeTruthy()
        })
    })

    it("adds new user address", async () => {
        let getByText, getByTestId, asFragment, getByPlaceholderText, queryByTestId
        await act(async () => {
            const rendered = render(<Router><Cart test={true}/></Router>);
            getByText = rendered.getAllByText;
            getByTestId = rendered.getByTestId;
            getByPlaceholderText = rendered.getByPlaceholderText;
            queryByTestId = rendered.queryByTestId;
            asFragment = rendered.asFragment;
        });

        expect(api.get).toHaveBeenCalledWith("api/items/", {"params": {"id": 1}});

        await waitFor(() => getByTestId("minus"))

        fireEvent.click(getByText("Add address")[0])
        fireEvent.change(getByPlaceholderText("Building"), {target: {value: "Mirobod street 12, Tashkent, UZ"}})
        fireEvent.change(getByPlaceholderText("Entrance"), {target: {value: "2"}})
        fireEvent.change(getByPlaceholderText("Floor"), {target: {value: "4"}})
        fireEvent.change(getByPlaceholderText("Flat"), {target: {value: "34"}})

        fireEvent.click(getByText("Add address")[0])

        await waitFor(() => {
            expect(getByText("$12.99")[0]).toBeTruthy()
        })
    })

    it("handles input errors", async () => {
        let getByText, getByTestId, asFragment, getByPlaceholderText, queryByTestId
        await act(async () => {
            const rendered = render(<Router><Cart/></Router>);
            getByText = rendered.getAllByText;
            getByTestId = rendered.getByTestId;
            getByPlaceholderText = rendered.getByPlaceholderText;
            queryByTestId = rendered.queryByTestId;
            asFragment = rendered.asFragment;
        });

        expect(api.get).toHaveBeenCalledWith("api/items/", {"params": {"id": 1}});

        await waitFor(() => getByTestId("minus"))

        fireEvent.click(getByText("Complete order")[0])

        await waitFor(() => expect(getByText("Please enter your name")).toBeTruthy())
        fireEvent.change(getByPlaceholderText("How courier'll call you?"), {target: {value: "Peter"}})

        fireEvent.click(getByText("Complete order")[0])

        await waitFor(() => expect(getByText("Address required")).toBeTruthy())

        const selectComponent = queryByTestId('address-select');
        fireEvent.keyDown(selectComponent.childNodes[1], {key: 'ArrowDown'});
        await waitFor(() => getByText('Mirobod street 12, Tashkent, UZ, 2 ent., 4 floor, flat 34')[0]);
        fireEvent.click(getByText('Mirobod street 12, Tashkent, UZ, 2 ent., 4 floor, flat 34')[0]);
    })
})
