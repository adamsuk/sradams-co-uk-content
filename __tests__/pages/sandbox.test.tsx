import React from "react";
import {
  render, screen, fireEvent, waitFor,
} from "@testing-library/react";
import axios from "axios";

import Sandbox from "../../pages/sandbox";

jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>;

const mockPush = jest.fn();
let mockQuery: Record<string, string> = {};

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
    query: mockQuery,
    pathname: "/sandbox",
    isReady: true,
  }),
}));

describe("Sandbox page", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockQuery = {};
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      value: 768,
    });
    mockAxios.get.mockResolvedValue({
      data: [{ url: "test.mp3", title: "Test Podcast" }],
    });
  });

  it("renders without crashing", () => {
    render(<Sandbox />);
    expect(screen.getByRole("heading", { name: "Sandbox" })).toBeInTheDocument();
  });

  it("renders the experiment switcher", () => {
    render(<Sandbox />);
    expect(screen.getByRole("option", { name: "Podcast Player" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Pico8 Game" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Dynamic Quiz" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Calculator" })).toBeInTheDocument();
  });

  it("renders the first sandbox item (Podcast Player) by default", async () => {
    render(<Sandbox />);
    await waitFor(() => {
      expect(screen.getByTestId("podcast-player")).toBeInTheDocument();
    });
  });

  it("navigates to the correct sandbox when component query param is set", () => {
    mockQuery = { component: "calculator" };
    render(<Sandbox />);
    // Calculator renders digit buttons
    expect(screen.getByRole("button", { name: "7" })).toBeInTheDocument();
  });

  it("calls router.push with the slug when an experiment is chosen", () => {
    render(<Sandbox />);
    fireEvent.change(screen.getByLabelText("Experiment"), { target: { value: "calculator" } });
    expect(mockPush).toHaveBeenCalledWith(
      "/sandbox/?component=calculator",
      undefined,
      { shallow: true },
    );
  });
});
