import { Outlet } from "react-router";
import Header from "~/components/Header";

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default Layout;
