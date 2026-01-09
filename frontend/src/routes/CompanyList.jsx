import React, { useState, useEffect } from "react";
import CompanyCard from "./CompanyCard";
import JoblyApi from "../api.js";

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCompanies() {
      setIsLoading(true);
      try {
        const res = await JoblyApi.getCompanies(searchTerm ? { name: searchTerm } : {});
        setCompanies(res);
      } catch (err) {
        setCompanies([]);
      }
      setIsLoading(false);
    }
    getCompanies();
  }, [searchTerm]);

  function handleChange(evt) {
    setSearchTerm(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    setSearchTerm(searchTerm.trim());
  }

  return (
    <div>
      <h2>Companies</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {companies.length === 0 ? (
            <p>No companies found.</p>
          ) : (
            companies.map(c => (
              <CompanyCard key={c.handle} {...c} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CompanyList;
