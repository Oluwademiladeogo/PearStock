import type { AppProps } from 'next/app';
import Sidebar from '../src/components/SideBar/SideBar';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const hideSidebar =
    router.pathname === "/login" ||
    router.pathname === "/logout" ||
    router.pathname === "/signup" ||
    router.pathname === "/forgot-password" ||
    router.pathname === "/verify-otp";

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />}
      <div className={`flex-1 p-4 ${hideSidebar ? "w-full" : ""}`}>
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;