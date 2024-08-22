import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import {MemoryRouter as Router} from "react-router-dom";
import MenuItemsList from '../src/components/Menu/Items.jsx';

describe("Menu-Items-List component", () => {
    it('renders without crashing', () => {
        render(<Router><MenuItemsList type="items" items={[]}/></Router>);
    });

    it('matches the snapshot', () => {
        const {asFragment} = render(<Router><MenuItemsList type="items" items={[{"not_found": "no items"}]}/></Router>);
        expect(asFragment()).toMatchSnapshot();
    });
})
