import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear cookies
    Cookies.remove("token");
    Cookies.remove("user");

    // Redirect to login page
    router.push("/login");
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "2em",
        fontWeight: "bold",
        color: "#333",
      }}
    >
      Logging out...
    </div>
  );
};

export default Logout;
