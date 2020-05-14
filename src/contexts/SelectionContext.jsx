import React, { createContext } from "react";

const SelectionContext = createContext("");
export const withAddToSelection = (Component) => (props) => (
  <SelectionContext.Consumer>
    {(value) => <Component {...props} selection={value} />}
  </SelectionContext.Consumer>
);
export default SelectionContext;
