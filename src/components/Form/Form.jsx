import React from "react";
import "./Form.css";

const Form = ({ booksearch, addBook }) => {
  return (
    <>
      <h3 className="mt-5 text-info">Search book using title or Author..</h3>
      <div className="mt-1">
        <input
          className="form-control form-control-lg"
          type="text"
          placeholder="ex : Ken Follet"
          value={booksearch}
          onChange={(e) => addBook(e.currentTarget.value)}
        ></input>
      </div>
    </>
  );
};

export default Form;
