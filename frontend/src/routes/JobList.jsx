import React, { useState, useEffect } from "react";
import JobCard from "./JobCard";
import JoblyApi from "../api";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function getJobs() {
      setIsLoading(true);
      try {
        const res = await JoblyApi.getJobs(searchTerm ? { title: searchTerm } : {});
        setJobs(res);
      } catch (err) {
        setJobs([]);
      }
      setIsLoading(false);
    }
    getJobs();
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
      <h2>Jobs</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {jobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            jobs.map(j => (
              <JobCard
                key={j.id}
                id={j.id}
                title={j.title}
                salary={j.salary}
                equity={j.equity}
                companyName={j.companyName}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default JobList;
