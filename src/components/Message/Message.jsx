import React from "react";

const Message = ({ message, dismissAlert }) => {
  return (
    <div class="alert alert-info alert-dismissible fade show" role="alert">
      {message}
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={dismissAlert}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

export default Message;
