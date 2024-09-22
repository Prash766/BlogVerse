import { GithubIcon, Linkedin,  } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 BlogVerse. All rights reserved.
        </p>

        <nav className="sm:ml-auto items-center flex gap-4 sm:gap-6">
          <Link to="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>

          <Link to="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>

          <div
            className="flex gap-2 items-center text-xs  underline-offset-4"
          >
            <Link  to="https://github.com/Prash766">
            <GithubIcon className="mr-1" /> 
            </Link>
            <Link to='www.linkedin.com/in/prashant-shukla766'>
            <Linkedin className="mr-1" /> 
            </Link>
            Made by Prashant
          </div>
        </nav>
      </footer>
    </>
  );
};

export default Footer;
