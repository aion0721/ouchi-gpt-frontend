import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import App from "./App";

const mock = new MockAdapter(axios);

describe("App", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("renders ChatAI App header", () => {
    render(<App />);
    const headerElement = screen.getByText(/ChatAI App/i);
    expect(headerElement).toBeInTheDocument();
  });

  it("allows users to send a message and receive a response", async () => {
    mock.onPost("http://rp.local:8080/chat").reply(200, {
      text: "AI response",
    });

    render(<App />);

    const inputElement = screen.getByRole("textbox");
    const sendButton = screen.getByText(/Send/i);

    fireEvent.change(inputElement, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(inputElement).toBeDisabled();
    expect(sendButton).toBeDisabled();
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("AI response")).toBeInTheDocument()
    );

    expect(inputElement).not.toBeDisabled();
    expect(sendButton).not.toBeDisabled();
    expect(inputElement).toHaveValue("");
  });

  it("clears messages when Clear button is clicked", async () => {
    mock.onPost("http://rp.local:8080/chat").reply(200, {
      text: "AI response",
    });

    render(<App />);

    const inputElement = screen.getByRole("textbox");
    const sendButton = screen.getByText(/Send/i);
    const clearButton = screen.getByText(/Clear/i);

    fireEvent.change(inputElement, { target: { value: "Hello" } });
    fireEvent.click(sendButton);
    await waitFor(() =>
      expect(screen.getByText("AI response")).toBeInTheDocument()
    );

    fireEvent.change(inputElement, { target: { value: "How are you?" } });
    fireEvent.click(sendButton);
    await waitFor(() =>
      expect(screen.getByText("AI response")).toBeInTheDocument()
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("How are you?")).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
    expect(screen.queryByText("How are you?")).not.toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    mock.onPost("http://rp.local:8080/chat").reply(500);

    render(<App />);

    const inputElement = screen.getByRole("textbox");
    const sendButton = screen.getByText(/Send/i);

    fireEvent.change(inputElement, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(inputElement).toBeDisabled();
    expect(sendButton).toBeDisabled();
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getByText("Error fetching AI response.")
      ).toBeInTheDocument()
    );

    expect(inputElement).not.toBeDisabled();
    expect(sendButton).not.toBeDisabled();
    expect(inputElement).toHaveValue("");
  });
});
