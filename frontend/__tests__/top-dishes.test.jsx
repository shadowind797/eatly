import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import api from "../src/api.js";
import { MemoryRouter as Router } from "react-router-dom";
import TopDishes from "../src/components/TopDishes.jsx";

jest.mock("../src/api");

describe("Top-Dishes component", () => {
  beforeEach(() => {
    api.get.mockResolvedValue({
      data: {
        items: [
          {
            id: 27,
            title: "Cookie",
            price: 12.0,
            photo: "/media/img/food/foodimg1.png",
            category: 7,
            rating: 5.0,
            restaurant: 4,
            rest_name: "Mc'Donalds",
          },
          {
            id: 5,
            title: "Swe Dish",
            price: 19.0,
            photo: "/media/img/food/SweDish.png",
            category: 1,
            rating: 4.9,
            restaurant: 3,
            rest_name: "KFC",
          },
          {
            id: 13,
            title: "Steak",
            price: 14.0,
            photo: "/media/img/food/foodimg1.png",
            category: 1,
            rating: 4.9,
            restaurant: 4,
            rest_name: "Mc'Donalds",
          },
          {
            id: 8,
            title: "Cheeseburger",
            price: 14.0,
            photo: "/media/img/food/ChikenHell.png",
            category: 3,
            rating: 4.9,
            restaurant: 4,
            rest_name: "Mc'Donalds",
          },
          {
            id: 1,
            title: "Chicken Hell",
            price: 12.0,
            photo: "/media/img/food/ChikenHell.png",
            category: 2,
            rating: 4.8,
            restaurant: 1,
            rest_name: "The Chicken King",
          },
        ],
        cats: [
          {
            id: 2,
            name: "Asian",
          },
          {
            id: 7,
            name: "Desserts",
          },
          {
            id: 3,
            name: "Fast Food",
          },
          {
            id: 6,
            name: "Fish",
          },
          {
            id: 4,
            name: "Ice",
          },
          {
            id: 1,
            name: "Meat",
          },
          {
            id: 5,
            name: "Salads",
          },
        ],
        in_cart: [
          {
            id: 116,
            item: 5,
            quantity: 1,
          },
          {
            id: 117,
            item: 14,
            quantity: 1,
          },
          {
            id: 118,
            item: 6,
            quantity: 1,
          },
          {
            id: 120,
            item: 10,
            quantity: 1,
          },
          {
            id: 121,
            item: 15,
            quantity: 1,
          },
          {
            id: 122,
            item: 26,
            quantity: 1,
          },
          {
            id: 123,
            item: 11,
            quantity: 1,
          },
          {
            id: 124,
            item: 16,
            quantity: 1,
          },
          {
            id: 125,
            item: 17,
            quantity: 1,
          },
        ],
      },
    });
  });

  it("renders without crashing", async () => {
    await act(async () => {
      render(
        <Router>
          <TopDishes />
        </Router>
      );
    });
  });

  it("matches the snapshot", async () => {
    let asFragment;
    await act(async () => {
      const rendered = render(
        <Router>
          <TopDishes />
        </Router>
      );
      asFragment = rendered.asFragment;
    });

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
