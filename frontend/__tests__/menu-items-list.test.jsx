import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import MenuItemsList from "../src/components/Menu/Items.jsx";

describe("Menu-Items-List component", () => {
  it("renders without crashing", () => {
    render(
      <Router>
        <MenuItemsList type="items" items={[]} cats={[]} />
      </Router>
    );
  });

  it("matches the snapshot when no items found", () => {
    const { asFragment } = render(
      <Router>
        <MenuItemsList
          type="items"
          items={[{ not_found: "no items" }]}
          cats={[]}
        />
      </Router>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches the snapshot when dishes found", () => {
    const dishes = [
      {
        id: 8,
        title: "Cheeseburger",
        description: "-",
        price: 14.0,
        photo: "http://127.0.0.1:8000/media/img/food/ChikenHell.png",
        category: 3,
        rating: 4.9,
      },
      {
        id: 1,
        title: "Chicken Hell",
        description: "-",
        price: 12.0,
        photo: "http://127.0.0.1:8000/media/img/food/ChikenHell.png",
        category: 2,
        rating: 4.8,
      },
    ];

    const { asFragment } = render(
      <Router>
        <MenuItemsList
          type="items"
          items={dishes}
          cats={[
            {
              id: 2,
              name: "Asian",
            },
            {
              id: 4,
              name: "Ice",
            },
          ]}
          inCartItems={[
            {
              id: 130,
              item: 22,
              quantity: 1,
            },
          ]}
        />
      </Router>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches the snapshot when restaurants found", () => {
    const rests = [
      {
        id: 2,
        name: "The Burger King",
        address: "-",
        rating: 4.9,
        category_id: 2,
        image: "http://127.0.0.1:8000/media/img/rests/mcdonalds.jpg",
      },
    ];

    const { asFragment } = render(
      <Router>
        <MenuItemsList
          type="rests"
          items={rests}
          cats={[{ id: 2, name: "Supreme" }]}
        />
      </Router>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
