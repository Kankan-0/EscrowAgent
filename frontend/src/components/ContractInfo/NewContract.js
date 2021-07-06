// import { Fragment } from "react";
import React from "react";
const { Fragment } = React;
const NewContract = () => {
  return (
    <Fragment>
      <div>
        <label htmlFor="arbiter">Arbiter Address</label>
        <input type="text" id="arbiter"></input>
      </div>
      <div>
        <label htmlFor="beneficiary">Beneficiary Address</label>
        <input type="text" id="beneficiary"></input>
      </div>
      <div>
        <label htmlFor="amount">Deposit Amount (DAI)</label>
        <input type="text" id="arbiter"></input>
      </div>
      <button type="button">Approve DAI & Deploy Contract</button>
    </Fragment>
  );
};

export default NewContract;
