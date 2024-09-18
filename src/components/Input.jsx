/**
 * Input Component
 */

import React from "react";
import { Field } from "formik";

import { ErrorMsg } from "./ErrorMsg";

const checkboxStyle = "mr-2 text-gray-700 h-4 w-4";

const Input = ({
  id,
  label,
  placeholder,
  type = "text",
  options = [],
  disabled = false,
  ...rest
}) => {
  const inputStyle = `${
    disabled ? "bg-neutral-100" : "bg-[#fcfcfd]"
  } border border-gray-300 ${
    disabled ? "text-gray-400" : "text-gray-900"
  } placeholder-gray-600 disabled:placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
    disabled ? "cursor-not-allowed" : ""
  }`;

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
        className={`block mb-2 text-sm font-medium ${
          disabled ? "text-gray-400" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      {type === "select" ? (
        <Field
          as="select"
          name={id}
          id={id}
          className={inputStyle}
          disabled={disabled}
          {...rest}
        >
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
            disabled={disabled}
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
          disabled={disabled}
          {...phoneInputProps}
          {...rest}
        />
      )}
      <ErrorMsg id={id} />
    </div>
  );
};

export { Input };
