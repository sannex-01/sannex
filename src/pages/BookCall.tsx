import { useEffect } from "react";

const BookCall = () => {
  useEffect(() => {
    // Redirect to Calendly immediately
    window.location.href = "https://calendly.com/sannex/book-free-consultation";
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">Redirecting to Calendly...</p>
      </div>
    </div>
  );
};

export default BookCall;
