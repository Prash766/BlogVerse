import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, NavLink } from "react-router-dom"
import { PenSquare, LogIn } from "lucide-react"
import Footer from "@/utils/Footer"

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link to='#' className="flex items-center justify-center" >
          <PenSquare className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold md:text-2xl lg:text-2xl">

          <NavLink to='/'>BlogVerse</NavLink>
            </h1>
         
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400">Log in to your BlogVerse account</p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button className="w-full" type="submit">
              <LogIn className="mr-2 h-4 w-4" /> Log In
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link to='#' className="text-sm text-primary hover:underline" >
              Forgot your password?
            </Link>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to='/signup' className="text-primary hover:underline" >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}