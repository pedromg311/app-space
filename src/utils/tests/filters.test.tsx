import React from "react";
import { isValidIdsList } from "../_filters.utils";

describe("[Utils] Filters", () => {
  test("if returns true on empty string", async () => {
    const isValid = isValidIdsList("");

    expect(isValid).toBeTruthy();
  });

  test("if returns true with string of correct ids", async () => {
    const isValid = isValidIdsList("10,25");

    expect(isValid).toBeTruthy();
  });

  test("if returns true with only one id", async () => {
    const isValid = isValidIdsList("58");

    expect(isValid).toBeTruthy();
  });

  test("if returns true with white space at the edges", async () => {
    const isValid = isValidIdsList(" 58,85 ");

    expect(isValid).toBeTruthy();
  });

  test("if returns false with white space between values", async () => {
    let isValid = isValidIdsList("58 85");
    expect(isValid).toBeFalsy();

    isValid = isValidIdsList("84, 71");
    expect(isValid).toBeFalsy();
  });

  test("if returns false with with ids of strings", async () => {
    const isValid = isValidIdsList("58s, 98ej");
    expect(isValid).toBeFalsy();
  });
});

export {};
