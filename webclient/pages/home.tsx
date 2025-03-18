import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return null;
};

export default Home;
