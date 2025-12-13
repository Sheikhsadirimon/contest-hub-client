import React from "react";
import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";

const Loading = () => {
  return (
    <div className="min-h-screen flex justify-center text-primary items-center">
      <Helix size="85" speed="2.5" color="green" />
    </div>
  );
};

export default Loading;
