import { render, fireEvent, waitFor, act } from "@testing-library/react";
import api from "../src/api.js";
import { MemoryRouter as Router } from "react-router-dom";
import ProfileContentProfile from "../src/components/Profile/PContent";

jest.mock("../src/api.js");

describe("Profile component -> Profile", () => {
  const user = {
    id: 1,
    username: "shadowind",
    email: "shadowind797@gmail.com",
    phone: "+375666999",
    status: 1,
    is_banned: false,
    ban_reason: "",
    first_name: "Peter",
  };

  const orders = {
    orders: [
      {
        id: 46,
        status: 2,
        total: 64.86,
        payment: null,
        address: 11,
        created: "04.09 09:19",
        rest: "Mc'Donalds",
        items_count: 4,
      },
      {
        id: 45,
        status: 2,
        total: 24.19,
        payment: 2,
        address: 10,
        created: "03.09 11:50",
        rest: "Evos",
        items_count: 1,
      },
      {
        id: 44,
        status: 2,
        total: 20.89,
        payment: null,
        address: 13,
        created: "03.09 11:46",
        rest: "#Farsh",
        items_count: 1,
      },
    ],
    statuses: [
      {
        id: 5,
        name: "Canceled",
      },
      {
        id: 4,
        name: "Completed",
      },
      {
        id: 3,
        name: "Delivery",
      },
      {
        id: 2,
        name: "In progress",
      },
      {
        id: 1,
        name: "Staged",
      },
    ],
  };

  beforeEach(() => {
    api.post.mockImplementation((url) => {
      if (url.includes("api/password/change/")) {
        return Promise.resolve({
          status: 200,
        });
      }
      return Promise.reject(new Error("Not found"));
    });
  });

  it("renders without crashing", () => {
    render(
      <Router>
        <ProfileContentProfile
          user={user}
          orders={orders.orders}
          osl={orders.statuses}
        />
      </Router>
    );
  });

  it("matches the snapshot", () => {
    const { asFragment } = render(
      <Router>
        <ProfileContentProfile
          user={user}
          orders={orders.orders}
          osl={orders.statuses}
        />
      </Router>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("sends email to change password", async () => {
    const { getByText } = render(
      <Router>
        <ProfileContentProfile
          user={user}
          orders={orders.orders}
          osl={orders.statuses}
        />
      </Router>
    );

    await act(async () => {
      fireEvent.click(getByText("Change password"));
      waitFor(() => getByText("Send email"));
    });

    await act(async () => {
      fireEvent.click(getByText("Send email"));
    });

    expect(api.post).toHaveBeenCalledWith("api/password/change/", {
      method: "send_email",
    });
  });
});
