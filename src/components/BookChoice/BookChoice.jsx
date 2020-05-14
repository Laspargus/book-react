import React, { useState, useEffect } from "react";
import BookPreview from "./../BookPreview/BookPreview";
const BookChoice = ({ bookList }) => {
  const shortid = require("shortid");
  return (
    <>
      <div className="howtoremove mt-3 mb-1">
        <small>Click on a book to add it to your selection</small>
      </div>
      <div className="mt-5 row">
        {bookList.map((book, index) => (
          <BookPreview book={book} key={shortid.generate()} />
        ))}
      </div>
    </>
  );
};

export default BookChoice;
