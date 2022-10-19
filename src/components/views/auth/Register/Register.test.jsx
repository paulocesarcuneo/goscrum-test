import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Register } from "./Register";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";

const server = setupServer(
  rest.get(/auth\/data$/, (req, res, ctx) => {
    return res(
      ctx.json({
        result: {
          continente: ["America", "Europa", "Otro"],
          registro: ["Otro", "Latam", "Brasil", "America del Norte"],
          Rol: ["Team Member", "Team Leader"],
        },
      })
    );
  }),
  rest.post(`http://localhost:8000/auth/register`, async (req, res, ctx) => {
    const body = await req.json();
    console.log(body);
    return res(ctx.status(200), ctx.json({}));
  })
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

it("fetch role options", async () => {
  render(<Register />, { wrapper: MemoryRouter });
  expect(
    screen.getByRole("option", { name: "Seleccionar rol..." })
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("option", { name: "Europa" })
  ).toBeInTheDocument();
});

it("submit empty field shows required fields", async () => {
  const component = render(<Register />, { wrapper: MemoryRouter });
  const button = screen.getByRole("button");
  fireEvent.click(button);
  const errorMessages = await component.findAllByText("* Campo obligatorio");
  expect(errorMessages.length).toBe(5);
  expect(errorMessages[0]).toBeInTheDocument();
});

it("submit filled form is success", async () => {
  const user = userEvent.setup();
  const { baseElement } = render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/registered/:teamID" element={<div>Test Success</div>} />
      </Routes>
    </MemoryRouter>
  );

  expect(
    await screen.findByRole("option", { name: "Team Leader" })
  ).toBeInTheDocument();

  await user.type(
    baseElement.querySelector(`input[name="userName"]`),
    "nombre"
  );
  await user.type(
    baseElement.querySelector(`input[name="password"]`),
    "123456789"
  );
  await user.type(
    screen.getByLabelText("Email", { selector: "input" }),
    "test@mail.com"
  );
  await user.selectOptions(
    screen.getByRole("combobox", { name: "Continente" }),
    ["Otro"]
  );
  await user.selectOptions(screen.getByRole("combobox", { name: "Role" }), [
    "Team Leader",
  ]);
  await user.click(screen.getByRole("button", { name: "Enviar" }));

  expect(await screen.findByText("Test Success")).toBeInTheDocument();

  // screen.debug();
});
