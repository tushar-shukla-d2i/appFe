// Header.jsx
import React from "react";
import d2iLogo from "../assets/d2i_logo.jpg";

const Header = () => {
  return (
    <header className="bg-[#0375a7] text-white py-4">
      <div className="flex items-center justify-center">
        <img
          src={d2iLogo}
          alt="logo"
          className="rounded-full h-16 w-16 mr-4"
        />
        <h1 className="text-lg font-bold tracking-wider	">
          Innovating Tomorrow, Today
        </h1>
      </div>
    </header>
  );
};

export { Header };
