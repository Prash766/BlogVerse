import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Loader, PenSquare, UserPlus } from "lucide-react";
import Footer from "@/utils/Footer";
import { useState } from "react";
import { axiosClient } from "@/axios/axios";
import { SignupType } from "@prash766/common-app";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userInfo } from "@/atoms/user";

export default function Singup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setUserInfo = useSetRecoilState(userInfo);
  const navigate = useNavigate();

  async function handleSignUp(e: React.MouseEvent) {
    setIsLoading(true);
    const data: SignupType = {
      email,
      password,
      FullName: fullName,
    };
    e.preventDefault();
    const response = await axiosClient.post("/user/signup", data);
    console.log(response);
    if (response.status === 201) {
      setIsLoading(false);
      toast.success("User Signed Up");
      setUserInfo(response.data.user);
      navigate("/home", { replace: true });
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link to="/" className="flex items-center justify-center">
          <PenSquare className="h-6 w-6 mr-2" />
          <span className="font-bold text-2xl">BlogVerse</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Join BlogVerse</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Create your account and start blogging
            </p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="Enter Your Name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              onClick={(e) => handleSignUp(e)}
              className="w-full"
              type="submit"
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
