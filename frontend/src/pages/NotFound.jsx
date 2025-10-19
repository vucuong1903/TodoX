import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-sltate-50">
      <img src="404_NotFound.png" alt="not found" className="max-w-full mb-6 w-96" />
      <p className="text-xl font-semibold">không có trang này</p>
      <a href="/" className="inline-block px-6 py-3 mt-6 font-medium text-white transition shadow-md bg-primary rounded-2xl hover:bg-primary-dark">Quay về</a>
    </div>

  );
}
export default NotFound;