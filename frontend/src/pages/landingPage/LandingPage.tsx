import { Button } from "@/components/ui/button";
import NavBar from "./NavBar";
import Card from "./Card";
import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import Footer from "@/utils/Footer";

const LandingPage = () => {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <div className="flex flex-col justify-center items-center bg-gradient-to-b from-white to-gray-100 px-6 py-24 md:h-screen md:px-12 lg:px-20">
          <div className="space-y-2 text-center md:space-y-4">
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
              Welcome to BlogVerse
            </h1>
            <h3 className="text-lg text-gray-500 md:text-xl">
              Your universe of thoughts, one post at a time
            </h3>
            <div className="flex justify-center space-x-4">
              <Button className="py-2 px-6 md:px-8 lg:px-10">
                Start Writing
              </Button>
              <Button
                variant="outline"
                className="bg-white text-black py-2 px-6 hover:bg-gray-200 md:px-8 lg:px-10"
              >
                Explore Posts
              </Button>
            </div>
          </div>
        </div>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-gray-800 mb-8 sm:text-4xl">
              Why Choose BlogVerse?
            </h2>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <Card
                title="Easy to Use"
                description="Intuitive interface for a seamless blogging experience"
                icon="PenBox"
              />
              <Card
                title="Customizable"
                description="Personalize your blog to match your unique style"
                icon="TrendingUp"
              />
              <Card
                title="SEO Optimized"
                description="Reach a wider audience with our SEO-friendly platform"
                icon="Search"
              />
              <Card
                title="Community Driven"
                description="Connect with like-minded bloggers and grow together"
                icon="Users"
              />
            </div>
          </div>
        </section>
        <section className="space-y-4 bg-black p-10">
          <h1 className="font-bold text-white text-center text-2xl ">
            Join the BlogVerse Community
          </h1>
          <p className="text-gray-300 text-center">
            Connect with fellow bloggers, share your stories, and inspire
            others. Start your blogging journey today!
          </p>
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-300 text-black"
            >
              <NavLink to="/login">Log in or Sign Up</NavLink>

              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
};

export default LandingPage;
