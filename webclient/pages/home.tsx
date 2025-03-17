import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Home: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/home/`)
      .then((response) => {
        const token = response.data?.token;
        token ? router.push("/dashboard") : router.push("/login");
      })
      .catch((error) => {
        console.error(error);
        router.push("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

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
