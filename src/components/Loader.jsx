/**
 * Loader Component
 */

import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center flex-1 mt-14">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
};

export { Loader };
