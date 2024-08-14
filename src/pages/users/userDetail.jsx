/**
 * User detail screen
 */

import React, { useState } from "react";

const UserDetail = ({ employee }) => {
  const [feedback, setFeedback] = useState({
    CodeQuality: {
      CodeReadability: 0,
      CodeMaintainability: 0,
      CodeEfficiency: 0,
      CodeReusability: 0,
      CodeTesting: 0,
    },
    DevelopmentProcess: {
      RequirementUnderstanding: 0,
      TaskCompletion: 0,
      VersionControlUsage: 0,
      Documentation: 0,
      DebuggingSkills: 0,
    },
    BehaviorAndCommunication: {
      TeamCollaboration: 0,
      CommunicationSkills: 0,
      Proactiveness: 0,
      ProblemSolvingAttitude: 0,
      Responsiveness: 0,
    },
    LearningAndGrowth: {
      AdaptabilityToNewTechnologies: 0,
      ContinuousLearning: 0,
      Innovation: 0,
      FeedbackImplementation: 0,
    },
    ProjectManagement: {
      TimeManagement: 0,
      DeadlineAdherence: 0,
      ResourceManagement: 0,
      RiskManagement: 0,
    },
  });

  const [generalComments, setGeneralComments] = useState("");

  const handleInputChange = (section, skill, value) => {
    setFeedback((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [skill]: value,
      },
    }));
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Feedback submitted:", feedback, "Comments:", generalComments);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg">
      <div className="flex items-center mb-6">
        <img
          src={employee?.imageUrl || "/default-avatar.png"} // Placeholder for profile image
          alt={employee?.name}
          className="w-20 h-20 rounded-full border-2 border-blue-500 mr-4"
        />
        <div>
          <h1 className="text-3xl font-bold">{employee?.name}</h1>
          <p className="text-gray-600">{employee?.position}</p>
        </div>
      </div>

      {Object.keys(feedback).map((section) => (
        <div key={section} className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4 border-b-2 border-blue-100 pb-2">
            {section.replace(/([A-Z])/g, " $1")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(feedback[section]).map((skill) => (
              <div key={skill} className="bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  {skill.replace(/([A-Z])/g, " $1")}
                </h3>
                <label className="block mb-2">
                  <span className="text-gray-600">Points:</span>
                  <select
                    className="mt-1 block w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                    value={feedback[section][skill]}
                    onChange={(e) =>
                      handleInputChange(section, skill, e.target.value)
                    }
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4 border-b-2 border-blue-100 pb-2">
          General Comments
        </h2>
        <textarea
          className="mt-1 block w-full p-4 border rounded focus:border-blue-500 focus:outline-none"
          rows="4"
          placeholder="Enter your comments here..."
          value={generalComments}
          onChange={(e) => setGeneralComments(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
      >
        Submit Feedback
      </button>
    </div>
  );
};

export { UserDetail };
