"use client";

import { useParams } from "next/navigation";
import React from "react";

const ProfileRolePage = () => {
  const params = useParams();

  return <div>ProfileRolePage - {params.role}</div>;
};

export default ProfileRolePage;
