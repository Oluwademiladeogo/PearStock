import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";

// Home page redirects to dashboard if authenticated or to login otherwise
const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Check for authentication token in cookies
    const token = Cookies.get("token");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return null; // No UI required
};

export default Home;
