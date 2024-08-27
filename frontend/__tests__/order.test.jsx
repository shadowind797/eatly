import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import api from '../src/api.js';
import {MemoryRouter as Router} from "react-router-dom";
import Order from '../src/pages/Order.jsx';
import Cart from "../src/pages/Cart.jsx";

jest.mock('../src/api');

describe('Order component', () => {
    const payments = [
        {
            "id": 1,
            "number": "3245 3425 3452 3452",
            "date_to": "12/42",
            "active": false,
            "name": "gfgwsreg re gegwwr",
            "owner": 1
        }, {
            "id": 2,
            "number": "3245 3425 3452 5435",
            "date_to": "12/42",
            "active": false,
            "name": "gfgwsreg re gegwwr",
            "owner": 1
        }, {
            "id": 3,
            "number": "3245 3425 3453 5444",
            "date_to": "12/42",
            "active": false,
            "name": "gfgwsreg re gegwwr",
            "owner": 1
        }, {
            "id": 4,
            "number": "1231 2312 3312 3123",
            "date_to": "12/32",
            "active": false,
            "name": "sdgverdger ergdg",
            "owner": 1
        }, {
            "id": 5,
            "number": "4353 4534 5345 3453",
            "date_to": "12/34",
            "active": false,
            "name": "gbsdf gth th",
            "owner": 1
        }, {
            "id": 6,
            "number": "2342 3423 4243 2442",
            "date_to": "12/45",
            "active": false,
            "name": "sdgdfsfd fgvdsfgs",
            "owner": 1
        }]
    const item = [{"id": 16, "status": 1, "total": 27.49, "payment": null, "address": 2}]
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
            if (url.includes('api/address')) {
                return Promise.resolve({status: 200, data: addresses});
            }
            if (url.includes('api/order/')) {
                return Promise.resolve({status: 200, data: item});
            }
            if (url.includes('api/user/')) {
                return Promise.resolve({status: 200, data: user});
            }
            if (url.includes('api/payment/')) {
                return Promise.resolve({status: 200, data: payments});
            }
            return Promise.reject(new Error('Not found'));
        });

        api.post.mockImplementation((url) => {
            if (url.includes('api/order/add/')) {
                return Promise.resolve({status: 205});
            }
            if (url.includes('api/payment/add/')) {
                return Promise.resolve({status: 201});
            }
            return Promise.reject(new Error('Not found'));
        });

        api.delete.mockImplementation((url) => {
            if (url.includes('api/items/cart/delete')) {
                return Promise.resolve({status: 202});
            }
            return Promise.reject(new Error('Not found'));
        })
    })

    it("renders without crashing", async () => {
        await act(async () => {
            render(<Router><Order/></Router>);
        })
    })

    it("matches the snapshot", async () => {
        let asFragment
        await act(async () => {
            const rendered = render(<Router><Order/></Router>);
            asFragment = rendered.asFragment
        })

        expect(asFragment()).toMatchSnapshot();
    })

    it("switches payment mode and selects payment card", async () => {
        let getByText, getByTestId, asFragment
        await act(async () => {
            const rendered = render(<Router><Order/></Router>);
            getByText = rendered.getByText
            getByTestId = rendered.getByTestId
            asFragment = rendered.asFragment
        })

        const card = getByTestId('web-card');
        const paymentSelect = getByTestId('payment-select');
        fireEvent.click(card);

        fireEvent.keyDown(paymentSelect.childNodes[1], {key: 'ArrowDown'});
        await waitFor(() => getByText('**** **** **** 3452'));
        fireEvent.click(getByText('**** **** **** 3452'));

        expect(asFragment()).toMatchSnapshot();
    })

    it("adds new user payment method", async () => {
        let getByText, getByTestId, asFragment, getByPlaceholderText, queryByTestId;

        await act(async () => {
            const rendered = render(<Router><Order/></Router>);
            getByText = rendered.getByText;
            getByTestId = rendered.getByTestId;
            getByPlaceholderText = rendered.getByPlaceholderText;
            queryByTestId = rendered.queryByTestId;
            asFragment = rendered.asFragment;
        })

        await waitFor(() => getByTestId('web-card'));

        const card = getByTestId('web-card');
        fireEvent.click(card);

        const addPaymentCardButton = getByText(/Add payment card/i);
        fireEvent.click(addPaymentCardButton);

        await waitFor(() => getByPlaceholderText('MM'));

        await act(async () => {
            fireEvent.change(getByPlaceholderText("XXXX XXXX XXXX XXXX"), {target: {value: "4334 5345 3543 9999"}});
            fireEvent.change(getByPlaceholderText("CVV/CVC"), {target: {value: "245"}});
            fireEvent.change(getByPlaceholderText("MM"), {target: {value: "04"}});
            fireEvent.change(getByPlaceholderText("YY"), {target: {value: "28"}});
            fireEvent.change(getByPlaceholderText("OWNER NAME"), {target: {value: "NONAME NONAME"}});

            fireEvent.click(getByText(/Add card/i));
        });

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("api/payment/add/", {
                "number": "4334 5345 3543 9999",
                "cvv": "245",
                "date_to": "04/28",
                "name": "NONAME NONAME"
            })
        })
    });
})
