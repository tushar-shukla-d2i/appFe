/**
 * No Records Found Component
 */

import React from "react";
import NoRecordImg from "../assets/no-record.png";

const NoRecordsFound = () => {
  return (
    <>
      <img src={NoRecordImg} className="w-72 h-w-72 mx-auto mt-20" />
      <div className="text-center font-semibold text-xl text-[#188fff] tracking-wider ml-6">
        No Records Found
      </div>
    </>
  );
};

export { NoRecordsFound };
