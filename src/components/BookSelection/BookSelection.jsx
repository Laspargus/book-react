import React from "react";
import "./BookSelection.css";

const BookSelection = ({ bookSelection, deleteBook }) => {
  const shortid = require("shortid");

  return (
    <>
      <div className="howtoremove mt-3 mb-3">
        <small>Click on a book to remove from selection</small>
      </div>
      <div className="row">
        {bookSelection.map((book, index) => (
          <div key={shortid.generate()} className="col-md-2">
            <img
              src={book.image}
              alt={book.title}
              onClick={() => deleteBook(book)}
            ></img>
          </div>
        ))}
      </div>
    </>
  );
};

export default BookSelection;
