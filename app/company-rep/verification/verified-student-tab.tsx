import React from "react";

interface VerifiedStudentTabProps {
  active: boolean;
}

const VerifiedStudentTab = ({ active }: VerifiedStudentTabProps) => {
  return <div>VerifiedStudentTab - {active}</div>;
};

export default VerifiedStudentTab;
