import React from "react";

const Error = (props) => {
  return (
    <div
      className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
      role="alert"
    >
      <p className="font-semibold">{props.infoMessage}</p>
      <p>{props.errorMessage}</p>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <button onClick={props.dismissError}>X</button>
      </span>
    </div>
  );
};

export default Error;
