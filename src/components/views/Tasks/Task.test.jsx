import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
import { Tasks } from "./Tasks";
import { Provider } from "react-redux";
import { setupStore, store } from "../../../store/store";

const server = setupServer(
  rest.get(/task\/$/, (req, res, ctx) => {
    return res(
      ctx.json({
        status_code: 200,
        message: "OK",
        result: [
          {
            _id: "63444cb7e5f425c82e6524f3",
            title: "test task",
            status: "IN PROGRESS",
            importance: "HIGH",
            createdAt: 1665420471223,
            modifiedAt: 1666090062125,
            deletedAt: "",
            deleted: false,
            teamId: "9cdbd108-f924-4383-947d-8f0c651d0dad",
            description: "Editando",
            user: {
              email: "diegocoscolla@gmail.com",
              role: "Team Leader",
              userName: "diegocos",
              teamId: "9cdbd108-f924-4383-947d-8f0c651d0dad",
              userId: "633c5ea1e98eaa5ce73c26d6",
              iat: 1665415793,
              exp: 1665502193,
            },
          },
        ],
      })
    );
  })
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

it("submit filled form is success", async () => {
  const user = userEvent.setup();
  const { baseElement } = render(
    <Provider store={setupStore({})}>
      <MemoryRouter>
        <Tasks />
      </MemoryRouter>
    </Provider>
  );

  expect(await screen.findByText("test task")).toBeInTheDocument();
});
