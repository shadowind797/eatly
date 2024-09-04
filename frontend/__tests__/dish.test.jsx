import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import api from "../src/api.js";
import { MemoryRouter as Router } from "react-router-dom";
import Dish from "../src/components/Dish.jsx";

jest.mock("../src/api");

describe("Dish component", () => {
  const item = {
    id: 1,
    title: "Chicken Hell",
    description: "-",
    price: 12.0,
    photo: "http://127.0.0.1:8000/media/img/food/ChikenHell.png",
    category: 2,
    rating: 4.8,
  };

  beforeEach(() => {
    api.post.mockImplementation((url) => {
      if (url.includes("api/items/cart/add")) {
        return Promise.resolve({ status: 201, data: {} });
      }
      return Promise.reject(new Error("Not found"));
    });
  });

  it("renders without crashing", async () => {
    await act(async () => {
      render(
        <Router>
          <Dish item={item} category="Fast Food" inCart={true} />
        </Router>
      );
    });
  });

  it("matches the snapshot", async () => {
    let asFragment;
    await act(async () => {
      const rendered = render(
        <Router>
          <Dish item={item} category="Fast Food" inCart={true} />
        </Router>
      );
      asFragment = rendered.asFragment;
    });

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it("pushes item in cart", async () => {
    let getByTestId;
    await act(async () => {
      ({ getByTestId } = render(
        <Router>
          <Dish item={item} category="Fast Food" inCart={true} />
        </Router>
      ));
    });

    await waitFor(() => {
      const addToCartButton = getByTestId("add-to-cart-button");
      expect(addToCartButton).toBeTruthy();
    });

    await act(async () => {
      fireEvent.click(getByTestId("add-to-cart-button"));
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("api/items/cart/add", {
        item: 1,
        quantity: 1,
      });
    });
  });
});
