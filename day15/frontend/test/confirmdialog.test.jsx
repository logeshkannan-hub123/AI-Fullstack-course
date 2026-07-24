import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import ConfirmDialog from "../src/components/ConfirmDialog/ConfirmDialog";

describe("ConfirmDialog", () => {
  it("renders the message passed in", () => {
    render(<ConfirmDialog message="Delete this Movie?" />);

    expect(screen.getByText("Delete this Movie?"));
  });

  it("renders default title when none is provided", () => {
    render(<ConfirmDialog />);

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("calls onConfirm when the confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(<ConfirmDialog onConfirm={onConfirm} />);
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when clicking the backdrop", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    const { container } = render(<ConfirmDialog onCancel={onCancel} />);
    await user.click(container.querySelector(".dialog-backdrop"));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
