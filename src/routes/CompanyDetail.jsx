import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "../api.js";
import JobCard from "./JobCard";

function CompanyDetail() {
  const { handle } = useParams();
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCompany() {
      setIsLoading(true);
      try {
        const res = await JoblyApi.getCompany(handle);
        setCompany(res);
      } catch (err) {
        setCompany(null);
      }
      setIsLoading(false);
    }
    getCompany();
  }, [handle]);

  if (isLoading) return <p>Loading...</p>;
  if (!company) return <p>Company not found.</p>;

  return (
    <div>
      <h2>{company.name}</h2>
      {company.logoUrl && <img src={company.logoUrl} alt={company.name} style={{height:50}} />}
      <p>{company.description}</p>
      <h3>Jobs at {company.name}</h3>
      {company.jobs && company.jobs.length > 0 ? (
        <div>
          {company.jobs.map(job => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              salary={job.salary}
              equity={job.equity}
            />
          ))}
        </div>
      ) : (
        <p>No jobs listed for this company.</p>
      )}
    </div>
  );
}

export default CompanyDetail;
