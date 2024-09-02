/**
 * Input Component
 */

import React from "react";
import { ErrorMessage, Field } from "formik";

const inputStyle =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5";

const checkboxStyle = "mr-2 text-gray-700 h-4 w-4";

const Input = ({
  id,
  label,
  placeholder,
  type = "text",
  options = [],
  ...rest
}) => {
  const phoneInputProps =
    type === "tel"
      ? {
          maxLength: 10,
          pattern: "[0-9]*",
          onInput: (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          },
        }
      : {};

  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      {type === "select" ? (
        <Field as="select" name={id} id={id} className={inputStyle} {...rest}>
          {options?.map?.((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
      ) : type === "checkbox" ? (
        <div className="flex items-center">
          <Field
            type="checkbox"
            name={id}
            id={id}
            className={checkboxStyle}
            {...rest}
          />
          <span>{placeholder}</span>
        </div>
      ) : (
        <Field
          type={type}
          name={id}
          id={id}
          className={inputStyle}
          placeholder={placeholder}
          {...phoneInputProps}
          {...rest}
        />
      )}
      <ErrorMessage
        name={id}
        component="div"
        className="text-red-600 text-sm mt-2"
      />
    </div>
  );
};

export { Input };
