import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../src/components/Navbar/Navbar.jsx";
import { useAuth } from "../src/hooks/useAuth.js";

vi.mock("../src/hooks/useAuth.js");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  );
}

describe("Navbar", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders only the brand link when not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });

    renderNavbar();

    expect(screen.getByText("🎬 CineVault")).toBeInTheDocument();
    expect(screen.queryByText("Movies")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Logout" }),
    ).not.toBeInTheDocument();
  });

  it("renders nav links and username when authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { username: "logesh" },
      logout: vi.fn(),
    });

    renderNavbar();

    expect(screen.getByText("Movies")).toBeInTheDocument();
    expect(screen.getByText("Add Movie")).toBeInTheDocument();
    expect(screen.getByText("Hi, logesh")).toBeInTheDocument();
  });

  it("calls logout and navigates to /login when Logout is clicked", async () => {
    const user = userEvent.setup();
    const logout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { username: "logesh" },
      logout,
    });

    renderNavbar();
    await user.click(screen.getByRole("button", { name: "Logout" }));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
