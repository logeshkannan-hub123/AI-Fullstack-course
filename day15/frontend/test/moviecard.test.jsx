import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import MovieCard from "../src/components/MovieCard/MovieCard.jsx";

const mockMovie = {
  MovieTitle: "Inception",
  Director: "Christopher Nolan",
  Starring: ["Leonardo DiCaprio", "Tom Hardy"],
  Language: "English",
  Release_Date: "2010-07-16",
  Quality: "WEB-DL 4K",
  Genres: ["Sci-Fi", "Thriller"],
};

describe("MovieCard", () => {
  it("renders the movie's details", () => {
    render(<MovieCard movie={mockMovie} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("Christopher Nolan")).toBeInTheDocument();
    expect(screen.getByText("Leonardo DiCaprio, Tom Hardy")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
  });

  it("renders the quality and genre tags", () => {
    render(<MovieCard movie={mockMovie} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("WEB-DL 4K")).toBeInTheDocument();
    expect(screen.getByText("Sci-Fi")).toBeInTheDocument();
    expect(screen.getByText("Thriller")).toBeInTheDocument();
  });

  it("calls onEdit with the movie when Edit is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(<MovieCard movie={mockMovie} onEdit={onEdit} onDelete={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(onEdit).toHaveBeenCalledWith(mockMovie);
  });

  it("calls onDelete with the movie when Delete is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<MovieCard movie={mockMovie} onEdit={vi.fn()} onDelete={onDelete} />);
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledWith(mockMovie);
  });

  it("shows a dash for the year when Release_Date is missing", () => {
    const movieWithoutDate = { ...mockMovie, Release_Date: undefined };

    render(<MovieCard movie={movieWithoutDate} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders without crashing when Starring and Genres are missing", () => {
    const minimalMovie = {
      MovieTitle: "Untitled",
      Director: "Unknown",
      Language: "English",
      Quality: "HDRip",
      Release_Date: "2020-01-01",
    };

    render(<MovieCard movie={minimalMovie} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Untitled")).toBeInTheDocument();
  });
});
