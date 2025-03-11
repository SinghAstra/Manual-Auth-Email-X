import React from "react";

interface VerificationRequestTabProps {
  active: boolean;
}

const VerificationRequestTab = ({ active }: VerificationRequestTabProps) => {
  return <div>VerificationRequestTab - {active}</div>;
};

export default VerificationRequestTab;
