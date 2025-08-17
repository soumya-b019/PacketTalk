import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const logout = useAuthStore((state) => state.logout);
  const authUser = useAuthStore((state) => state.authUser);

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">PacketTalk</h1>
            </Link>
          </div>

          {authUser && (
            <div className="flex items-center gap-4">
              <Link
                to={"/settings"}
                className={`flex
              btn btn-sm gap-2 transition-colors              `}
              >
                <Button variant="outline">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </Link>

              <>
                <Link to={"/profile"} className={`flex btn btn-sm gap-2`}>
                  <Button variant="outline">
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </Link>

                <Button onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
