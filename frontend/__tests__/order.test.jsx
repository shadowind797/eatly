import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react';
import api from '../src/api.js';
import {MemoryRouter as Router} from "react-router-dom";
import Order from '../src/pages/Order.jsx';

jest.mock('../src/api');

describe('Order component', () => {
    const cartItem = [{
        "id": 1,
        "item": 1,
        "quantity": 3
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
})
