import React from "react";

const Filter = ({filter, handleFilterChange}) => {
  return (
    <div>
      filters shown with{" "}
      <input type="text" value={filter} onChange={handleFilterChange} />
    </div>
  );
};

export default Filter;
