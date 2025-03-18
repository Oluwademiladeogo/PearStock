import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import api from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useRouter } from "next/router";

const Dashboard = () => {
  const router = useRouter();
  const { hydrated, isAuthenticated } = useProtectedRoute();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/dashboard/");
        if (isMounted) {
          setData(response.data);
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
      isMounted = false;
    };
  }, [isAuthenticated]);

  if (!hydrated) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

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
            data.map((item, index) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-blue-100 p-4 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-700">{item.description}</p>
              </motion.div>
        </div>

            ))
          ) : (
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
