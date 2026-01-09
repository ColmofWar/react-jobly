import React, { useContext, useState, useEffect } from "react";
import JoblyApi from "../api";
import UserContext from "../UserContext";


function JobCard({ id, title, salary, equity, companyName }) {
  const { currentUser } = useContext(UserContext);
  const alreadyApplied = currentUser && currentUser.applications && currentUser.applications.includes(id);
  const [applied, setApplied] = useState(alreadyApplied);

  useEffect(() => {
    setApplied(alreadyApplied);
  }, [alreadyApplied]);

  async function handleApply(evt) {
    evt.preventDefault();
    if (!currentUser || applied) return;
    try {
      await JoblyApi.applyToJob(currentUser.username, id);
      setApplied(true);
    } catch (err) {
      console.error("Error applying to job:", err);
    }
  }

  return (
    <div className="JobCard">
      <div className="JobCard-details">
        <h4>{title}</h4>
        {companyName && <p><b>Company:</b> {companyName}</p>}
        <p><b>Salary:</b> {salary ? `$${salary}` : "N/A"}</p>
        <p><b>Equity:</b> {equity ? equity : "0"}</p>
      </div>
      <div className="JobCard-action">
        <button className="apply-btn" onClick={handleApply} disabled={applied}>
          {applied ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
}

export default JobCard;
