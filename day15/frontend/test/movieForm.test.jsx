import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import MovieForm from "../src/components/MovieForm/MovieForm.jsx";

describe("MovieForm", () => {
  it("renders all form fields with their labels", () => {
    render(<MovieForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText("Movie Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Director")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Starring (comma separated)"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Quality")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Genres (comma separated)"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Language")).toBeInTheDocument();
    expect(screen.getByLabelText("Rating (0-10)")).toBeInTheDocument();
    expect(screen.getByLabelText("Release Date")).toBeInTheDocument();
  });

  it("renders the default submit button label", () => {
    render(<MovieForm onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Save Movie" }),
    ).toBeInTheDocument();
  });

  it("renders a custom submit label when provided", () => {
    render(<MovieForm onSubmit={vi.fn()} submitLabel="Update Movie" />);

    expect(
      screen.getByRole("button", { name: "Update Movie" }),
    ).toBeInTheDocument();
  });

  it("shows the server error message when provided", () => {
    render(<MovieForm onSubmit={vi.fn()} serverError="Title already exists" />);

    expect(screen.getByText("Title already exists")).toBeInTheDocument();
  });

  it("disables the submit button and shows Saving... while submitting", () => {
    render(<MovieForm onSubmit={vi.fn()} submitting={true} />);

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
  });

  it("shows validation errors and does not call onSubmit when required fields are empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<MovieForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Save Movie" }));

    expect(
      await screen.findByText("Movie name is required"),
    ).toBeInTheDocument();
    expect(screen.getByText("Director is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows an error when rating is out of range", async () => {
    const user = userEvent.setup();

    render(<MovieForm onSubmit={vi.fn()} />);
    await user.type(screen.getByLabelText("Rating (0-10)"), "15");
    await user.click(screen.getByRole("button", { name: "Save Movie" }));

    expect(
      await screen.findByText("Rating must be between 0 and 10"),
    ).toBeInTheDocument();
  });

  it("calls onSubmit with correctly formatted data when the form is valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<MovieForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Movie Name"), "Inception");
    await user.type(screen.getByLabelText("Director"), "Christopher Nolan");
    await user.type(
      screen.getByLabelText("Starring (comma separated)"),
      "Leonardo DiCaprio, Tom Hardy",
    );
    await user.type(
      screen.getByLabelText("Genres (comma separated)"),
      "Sci-Fi, Thriller",
    );
    await user.type(screen.getByLabelText("Language"), "English");
    await user.type(screen.getByLabelText("Rating (0-10)"), "8.5");
    fireEvent.change(screen.getByLabelText("Release Date"), {
      target: { value: "2010-07-16" },
    });

    await user.click(screen.getByRole("button", { name: "Save Movie" }));

    expect(onSubmit).toHaveBeenCalledWith({
      MovieTitle: "Inception",
      Director: "Christopher Nolan",
      Starring: ["Leonardo DiCaprio", "Tom Hardy"],
      Quality: "WEB-DL 4K",
      Genres: ["Sci-Fi", "Thriller"],
      Language: "English",
      Movie_Rating: 8.5,
      Release_Date: "2010-07-16",
    });
  });

  it("pre-fills fields from initialValues (edit mode)", () => {
    render(
      <MovieForm
        onSubmit={vi.fn()}
        initialValues={{
          MovieTitle: "The Matrix",
          Director: "Wachowskis",
          Starring: "Keanu Reeves",
          Quality: "BluRay 1080p",
          Genres: "Sci-Fi",
          Language: "English",
          Movie_Rating: "9",
          Release_Date: "1999-03-31",
        }}
      />,
    );

    expect(screen.getByLabelText("Movie Name")).toHaveValue("The Matrix");
    expect(screen.getByLabelText("Director")).toHaveValue("Wachowskis");
    expect(screen.getByLabelText("Quality")).toHaveValue("BluRay 1080p");
    expect(screen.getByLabelText("Rating (0-10)")).toHaveValue(9);
  });
});
