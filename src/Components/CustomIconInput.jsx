import React from "react";

function CustomIconInput() {
  return (
    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500">
      <PersonStanding className="text-gray-400 mr-2 w-5 h-5" />
      <input
        placeholder="Email"
        type="email"
        className="w-full bg-transparent outline-none border-none focus:ring-0 focus:outline-none text-sm placeholder-gray-400"
      />
    </div>
  );
}

export default CustomIconInput;
