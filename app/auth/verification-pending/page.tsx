import { Navbar } from "@/components/home/navbar";
import React from "react";

const VerificationPending = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-xl rounded-md p-4 border text-align space-y-2">
          <p>Your Verification is Pending.</p>
          <p>We will respond shortly.</p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
