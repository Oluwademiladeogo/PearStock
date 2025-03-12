import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const loading = true;
const Home: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${import.meta.env.REACT_APP_API_URL}/api/home`)
      .then((response) => {
        const token = response.data?.token;
        token ? navigate("/dashboard") : navigate("/login");
      })
      .catch((error) => {
        console.error(error);
        navigate("/login");
      });
  }, [navigate]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  return null;
};
export default Home;
