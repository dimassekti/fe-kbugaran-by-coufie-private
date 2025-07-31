import React from "react";
import PropTypes from "prop-types";
import HospitalItem from "./HospitalItem";

function HospitalList({ hospitals, onDelete, onEdit }) {
  // Ensure hospitals is always an array
  const hospitalArray = Array.isArray(hospitals) ? hospitals : [];

  if (hospitalArray.length === 0) {
    return <p>No hospitals available.</p>;
  }

  return (
    <div className="hospital-list">
      {hospitalArray.map((hospital) => (
        <HospitalItem
          key={hospital.id}
          hospital={hospital}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

HospitalList.propTypes = {
  hospitals: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

export default HospitalList;
