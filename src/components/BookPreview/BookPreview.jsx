import React, { useState } from "react";
import cover from "./../../images/bookcover.png";
import "./BookPreview.css";
import { useEffect } from "react";
import { withAddToSelection } from "./../../contexts/SelectionContext";

const BookPreview = ({ book, selection }) => {
  return (
    <>
      <div className="col-sm-2">
        <img
          className="flexible"
          src={book.image}
          onClick={() => selection.addBook(book)}
          alt={book.title}
        ></img>
      </div>
    </>
  );
};

export default withAddToSelection(BookPreview);
