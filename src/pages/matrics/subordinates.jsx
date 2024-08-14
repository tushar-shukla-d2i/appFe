/**
 * Subordinates users listing screen
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    position: "Developer",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "Designer",
    email: "jane.smith@example.com",
  },
  // Add more team members here
  {
    id: 15,
    name: "Alice Johnson",
    position: "Product Manager",
    email: "alice.johnson@example.com",
  },
];

const Subordinates = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleMemberClick = (id) => {
    navigate(`/user/${id}`); // Navigate to the user detail page
  };

  return (
    <div className="bg-white h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-300 to-blue-300 text-white p-4 flex items-center justify-between shadow-lg">
        <button onClick={handleBackClick} className="text-xl">
          <FaArrowLeft />
        </button>
        <h1 className="text-lg font-semibold">Our Team</h1>
        <div></div> {/* Empty div for spacing */}
      </div>

      {/* Team Members List */}
      <div className="flex flex-wrap p-4 gap-4 overflow-y-auto">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-gray-100 p-4 rounded-lg shadow-lg w-64 cursor-pointer relative hover:bg-gray-200 transition"
            onClick={() => handleMemberClick(member.id)}
          >
            <div className="absolute top-2 right-2 text-xl text-gray-500">
              <FaArrowRight />
            </div>
            <h2 className="text-xl font-bold">{member.name}</h2>
            <p className="text-gray-700">{member.position}</p>
            <p className="text-gray-500">{member.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Subordinates };
