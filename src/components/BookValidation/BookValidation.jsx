import React from "react";

const BookValidation = ({ confirmSelection }) => {
  return (
    <div className="text-center mt-3">
      <button onClick={confirmSelection} className="btn btn-info btn-lg">
        Confirm Selection
      </button>
    </div>
  );
};

export default BookValidation;
