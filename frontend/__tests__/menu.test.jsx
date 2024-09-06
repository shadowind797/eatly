import { render, fireEvent, waitFor } from "@testing-library/react";
import api from "../src/api.js";
import { MemoryRouter as Router } from "react-router-dom";
import Menu from "../src/pages/Menu.jsx";

jest.mock("../src/components/TopDishes.jsx", () => () => (
  <div data-testid="mock-dishes" />
));
jest.mock("../src/components/TopRests.jsx", () => () => (
  <div data-testid="mock-rests" />
));
jest.mock("../src/api");

describe("Menu component", () => {
  beforeEach(() => {
    api.get.mockImplementation((url) => {
      if (url.includes("api/items/search")) {
        return Promise.resolve({
          status: 200,
          data: {
            items: [
              {
                id: 16,
                title: "Double cheeseburger",
                price: 15.0,
                photo: "/media/img/food/foodimg1.png",
                category: 2,
                rating: 3.9,
                restaurant: 4,
                rest_name: "Mc'Donalds",
              },
              {
                id: 22,
                title: "Double chikenburger",
                price: 32.0,
                photo: "/media/img/food/foodimg1.png",
                category: 4,
                rating: 4.8,
                restaurant: 7,
                rest_name: "#Farsh",
              },
            ],
            cats: [
              {
                id: 2,
                name: "Asian",
              },
              {
                id: 4,
                name: "Ice",
              },
            ],
            in_cart: [
              {
                id: 130,
                item: 22,
                quantity: 1,
              },
            ],
          },
        });
      }
      return Promise.reject(new Error("Not found"));
    });

    api.post.mockImplementation((url) => {
      if (url.includes("api/items/search/filters/")) {
        return Promise.resolve({
          status: 200,
          data: {
            items: [
              {
                id: 16,
                title: "Double cheeseburger",
                price: 15.0,
                photo: "/media/img/food/foodimg1.png",
                category: 2,
                rating: 3.9,
                restaurant: 4,
                rest_name: "Mc'Donalds",
              },
              {
                id: 22,
                title: "Double chikenburger",
                price: 32.0,
                photo: "/media/img/food/foodimg1.png",
                category: 4,
                rating: 4.8,
                restaurant: 7,
                rest_name: "#Farsh",
              },
            ],
            cats: [
              {
                id: 2,
                name: "Asian",
              },
              {
                id: 4,
                name: "Ice",
              },
            ],
            in_cart: [
              {
                id: 130,
                item: 22,
                quantity: 1,
              },
            ],
          },
        });
      }
      return Promise.reject(new Error("Not found"));
    });
  });

  it("renders without crashing", () => {
    render(
      <Router>
        <Menu />
      </Router>
    );
  });

  it("matches the snapshot", () => {
    const { asFragment } = render(
      <Router>
        <Menu />
      </Router>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("searches dishes", async () => {
    const { getByTestId } = render(
      <Router>
        <Menu />
      </Router>
    );

    const searchInput = getByTestId("search-input");
    const searchButton = getByTestId("search-btn");

    fireEvent.change(searchInput, { target: { value: "burger" } });
    fireEvent.click(searchButton);

    await waitFor(async () => {
      expect(api.get).toHaveBeenCalledWith("api/items/search", {
        params: { search: "burger", search_mode: "food" },
      });
    });
  });

  it("searches rests", async () => {
    const { getByTestId } = render(
      <Router>
        <Menu />
      </Router>
    );

    const searchInput = getByTestId("search-input");
    const searchButton = getByTestId("search-btn");
    const SMRests = getByTestId("SM-rests");

    fireEvent.change(searchInput, { target: { value: "burger" } });
    fireEvent.click(SMRests);
    fireEvent.click(searchButton);

    await waitFor(async () => {
      expect(api.get).toHaveBeenCalledWith("api/items/search", {
        params: { search: "burger", search_mode: "rests" },
      });
    });
  });

  it("searches dishes by 2-word search", async () => {
    const { getByTestId } = render(
      <Router>
        <Menu />
      </Router>
    );

    const searchInput = getByTestId("search-input");
    const searchButton = getByTestId("search-btn");

    fireEvent.change(searchInput, { target: { value: "burger chicken" } });
    fireEvent.click(searchButton);

    await waitFor(async () => {
      expect(api.get).toHaveBeenCalledWith("api/items/search", {
        params: {
          search: "burger",
          also: "chicken",
          search_mode: "food",
        },
      });
    });
  });

  it("filters food by main filter", async () => {
    const { getByTestId } = render(
      <Router>
        <Menu />
      </Router>
    );

    const FF_FilterBtn = getByTestId("FF_FilterBtn");
    const filter = getByTestId("filter-btn");

    fireEvent.click(FF_FilterBtn);
    fireEvent.click(filter);

    await waitFor(async () => {
      expect(api.post).toHaveBeenCalledWith("api/items/search/filters/", {
        filters: { category: "Fast Food", cost: [15, 25] },
      });
    });
  });

  it("filters food by secondary filter", async () => {
    const { queryByTestId, getByTestId, getByText } = render(
      <Router>
        <Menu />
      </Router>
    );

    const filter = getByTestId("filter-btn");
    const selectComponent = queryByTestId("filter-select");

    fireEvent.keyDown(selectComponent.childNodes[1], { key: "ArrowDown" });
    await waitFor(() => getByText("Desserts"));
    fireEvent.click(getByText("Desserts"));

    fireEvent.click(filter);

    await waitFor(async () => {
      expect(api.post).toHaveBeenCalledWith("api/items/search/filters/", {
        filters: { category: "Desserts", cost: [15, 25] },
      });
    });
  });

  it("sorts food", async () => {
    const { queryByTestId, getByTestId, getByText, queryAllByTestId } = render(
      <Router>
        <Menu />
      </Router>
    );

    const filter = getByTestId("filter-btn");
    const selectComponent = queryByTestId("sort-select");
    const sideSelectComponent = queryByTestId("sortside-select");

    fireEvent.keyDown(selectComponent.childNodes[1], { key: "ArrowDown" });
    await waitFor(() => getByText("Cost"));
    fireEvent.click(getByText("Cost"));

    fireEvent.keyDown(sideSelectComponent.childNodes[1], { key: "ArrowDown" });
    await waitFor(() => getByText("Ascending"));
    fireEvent.click(getByText("Ascending"));

    fireEvent.click(filter);

    await waitFor(async () => {
      expect(api.post).toHaveBeenCalledWith("api/items/search/filters/", {
        filters: { category: "", cost: [15, 25] },
      });
    });

    const itemCost = queryAllByTestId("item-cost")[0];
    expect(itemCost.textContent).toBe("15.99");
  });

  it("filters by cost", async () => {
    const { getByTestId } = render(
      <Router>
        <Menu />
      </Router>
    );

    const costInput = getByTestId("cost-input");
    const filter = getByTestId("filter-btn");

    fireEvent.change(costInput, { target: { value: 30 } });
    fireEvent.click(filter);

    await waitFor(() => {
      expect(api.post).toHaveBeenLastCalledWith("api/items/search/filters/", {
        filters: { category: "", cost: [25, 35] },
      });
    });
  });
});
