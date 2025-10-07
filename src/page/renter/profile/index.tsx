import HeaderLite from "@/components/headerLite";
import AccountSidebar from "./components/side-bar";
import { Outlet } from "react-router-dom";

function Profile() {
  return (
    <>
      <HeaderLite />

      <div className="bg-slate-50">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <AccountSidebar />

          <main aria-label="Nội dung tài khoản" className="min-h-[100vh] mt-5">
            <div className="rounded-2xl bg-slate-100 p-1">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Profile;
