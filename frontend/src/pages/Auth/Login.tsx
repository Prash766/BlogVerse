import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { PenSquare, Loader, LogInIcon } from "lucide-react";
import Footer from "@/utils/Footer";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { isAuthenticated, userInfo } from "@/atoms/user";
import { axiosClient } from "@/axios/axios";
import { SigninType } from "@prash766/common-app";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setAuthState = useSetRecoilState(isAuthenticated);
  const setUserInfo = useSetRecoilState(userInfo);
  const navigate = useNavigate();

  async function handleLogin(e: React.MouseEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    const data: SigninType = {
      email,
      password,
    };
  
    try {
      const response = await axiosClient.post("/user/login", data);
  
      if (response.status === 200) {
        toast.success("Logged In");
        setAuthState(true);
        setUserInfo(response.data.user);
        navigate("/home", { replace: true });
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data.message === "invalid Password") {
            toast.error("Enter Correct Password");
          } else {
            toast.error("Something went wrong");
          }
        } else {
          toast.error(`Error: ${error.response.status} - ${error.response.statusText}`);
        }
      } else {
        toast.error("Network error or server issue");
      }
    } finally {
      setIsLoading(false); 
    }
  }
  

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <NavLink to="/" className="flex items-center justify-center">
          <PenSquare className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold md:text-2xl lg:text-2xl">
            BlogVerse
          </h1>
        </NavLink>
      </header>

      <main className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Log in to your BlogVerse account
            </p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                required
              />
            </div>
            <Button
              onClick={(e) => handleLogin(e)}
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <LogInIcon className="mr-2 h-4 w-4" />
                  Log In
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link to="#" className="text-sm text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
