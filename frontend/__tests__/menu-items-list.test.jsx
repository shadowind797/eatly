import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import {MemoryRouter as Router} from "react-router-dom";
import MenuItemsList from '../src/components/Menu/Items.jsx';

describe("Menu-Items-List component", () => {
    it('renders without crashing', () => {
        render(<Router><MenuItemsList type="items" items={[]}/></Router>);
    });

    it('matches the snapshot when no items found', () => {
        const {asFragment} = render(<Router><MenuItemsList type="items" items={[{"not_found": "no items"}]}/></Router>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('matches the snapshot when dishes found', () => {
        const dishes = [
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

        const {asFragment} = render(<Router><MenuItemsList type="items" items={dishes}/></Router>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('matches the snapshot when restaurants found', () => {
        const rests = [
            {
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

        const {asFragment} = render(<Router><MenuItemsList type="rests" items={rests}/></Router>);
        expect(asFragment()).toMatchSnapshot();
    });
})
