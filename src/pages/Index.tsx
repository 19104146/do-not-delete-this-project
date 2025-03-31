
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the overview dashboard
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Dashboard...</h1>
        <div className="animate-pulse mt-4 w-16 h-1 bg-primary mx-auto rounded"></div>
      </div>
    </div>
  );
};

export default Index;
