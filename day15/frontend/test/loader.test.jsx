import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loader from "../src/components/Loader/Loader.jsx";

describe("Loader", () => {
  it("renders default title when none is provided", () => {
    render(<Loader />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the spinner element", () => {
    const { container } = render(<Loader />);

    expect(container.querySelector(".loader-spinner")).toBeInTheDocument();
  });

  it("hides the spinner from screen readers", () => {
    const { container } = render(<Loader />);
    const spinner = container.querySelector(".loader-spinner");

    expect(spinner).toHaveAttribute("aria-hidden", "true");
  });
});
