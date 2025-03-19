import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import api from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useRouter } from "next/router";

interface DashboardItem {
  title: string;
  description: string;
}

const Dashboard = () => {
  const router = useRouter();
  // Custom hook to handle authentication and hydration state
  const { hydrated, isAuthenticated } = useProtectedRoute();
  const [data, setData] = useState<DashboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data when component mounts and user is authenticated
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/dashboard/");
        if (isMounted) {
          setData(response.data); // Store the fetched dashboard items
        }
        setError(null);
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch data");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false; // Cleanup flag on unmount
    };
  }, [isAuthenticated]);

  // Wait until hydration is completed
  if (!hydrated) {
    return <LoadingSpinner />;
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  // Display spinner or error message if necessary
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow"
      >
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Overview of your inventory and sales
        </p>

        {Array.isArray(data) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-blue-400 to-purple-500 text-white p-6 rounded-lg shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{item.title}</h2>
                  <svg
                    className="w-8 h-8 text-blue-100 opacity-75"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <p className="text-xl font-semibold">{item.description}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          // Message for empty dashboard data
          <div className="min-h-screen w-full bg-gray-100 p-6 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow text-center w-full">
              <h1 className="text-3xl font-bold mb-4">No Data Available</h1>
              <p className="text-gray-600">
                There is currently no data to display.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
