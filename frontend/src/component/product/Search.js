import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import "./search.css";

const Search = () => {
  const [Keyword, setKeyword] = useState('');
 const history = useNavigate()
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (Keyword.trim()) {
    history(`/products/${Keyword}`)
    } else {
     history("/products");
    }
  };

// console.log(Keyword);

  return (
    <Fragment>
      <MetaData title="Search a product --ECOMMERCE" />
       <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;
