import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import api from "../src/api.js";
import { MemoryRouter as Router } from "react-router-dom";
import TopRests from "../src/components/TopRests.jsx";

jest.mock("../src/api");

describe("Top-Restaurants component", () => {
  beforeEach(() => {
    api.get.mockResolvedValue({
      data: {
        items: [
          {
            id: 2,
            name: "The Burger King",
            address: "Podshobog ko'chasi 23, Тоshkent, Toshkent, Uzbekistan",
            rating: 4.9,
            category_id: 2,
            image: "/media/img/rests/mcdonalds.jpg",
            items_count: 2,
          },
          {
            id: 5,
            name: "Maurice",
            address: "Bobur ko'chasi 34, Tashkent, Uzbekistan",
            rating: 4.9,
            category_id: 3,
            image: "/media/img/rests/mcdonalds.jpg",
            items_count: 3,
          },
          {
            id: 1,
            name: "The Chicken King",
            address: "59, Buyuk Ipak Yo'li 60, Тоshkent, Toshkent, Uzbekistan",
            rating: 4.8,
            category_id: 1,
            image: "/media/img/rests/burgerking.jpg",
            items_count: 3,
          },
        ],
        cats: [
          {
            id: 1,
            name: "Healthy",
          },
          {
            id: 3,
            name: "Supreme",
          },
          {
            id: 2,
            name: "Trending",
          },
        ],
      },
    });
  });

  it("renders without crashing", async () => {
    await act(async () => {
      render(
        <Router>
          <TopRests />
        </Router>
      );
    });
  });

  it("matches the snapshot", async () => {
    let asFragment;
    await act(async () => {
      const rendered = render(
        <Router>
          <TopRests />
        </Router>
      );
      asFragment = rendered.asFragment;
    });

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
