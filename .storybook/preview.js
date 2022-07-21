import React from "react";
import { MemoryRouter } from "react-router";
import { addDecorator } from "@storybook/react";
import GlobalStyle from "../src/style/GlobalStyle";
import { action } from "@storybook/addon-actions";
import { FavoriteProvider } from "../src/contexts/FavoriteContext";

addDecorator((storyFn) => (
  <MemoryRouter initialEntries={["/", "posts"]}>{storyFn()}</MemoryRouter>
));

const mockApi = {
  get: async () => {
    action("api.get")();
    return { data: [] };
  },
};

addDecorator((storyFn) => (
  <FavoriteProvider api={mockApi}>{storyFn()}</FavoriteProvider>
));

addDecorator((storyFn) => (
  <>
    <GlobalStyle />
    {storyFn()}
  </>
));
