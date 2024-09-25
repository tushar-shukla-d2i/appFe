/**
 * Error Msg Component
 */

import React from "react";
import { ErrorMessage } from "formik";

const ErrorMsg = ({ id }) => {
  return (
    <ErrorMessage
      name={id}
      component="div"
      className="text-red-600 text-sm mt-2"
    />
  );
};

export { ErrorMsg };
