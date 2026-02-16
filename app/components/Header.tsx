import { Link, useSearchParams } from "react-router";
import { ModeToggle } from "./mode-toggle";

function Header() {
  const [searchParams] = useSearchParams();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 px-4 w-full">
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between gap-2 py-2 md:py-3">
          <div className="shrink-0">
            <Link
              to={{ pathname: "/", search: searchParams.toString() }}
              className="w-11.5 font-semibold text-[12px] h-11.5 rounded-full bg-background-primary flex items-center justify-center"
            >
              <img
                src="/m3terhead.webp"
                alt="M3terhead"
                className="w-10 h-10"
              />
            </Link>
          </div>

          <div className="flex space-x-2 items-center h-11.5">
            {/*<Link to="/sign-in" className="flex justify-center items-center font-semibold bg-icon text-black dark:text-white h-10 w-35 rounded-3xl hover:bg-icon/80 active:bg-icon/70">
              Sign In
            </Link>*/}
            <div className="shrink-0 ml-auto md:ml-4">
              <ModeToggle />
            </div>
          </div>
        </div>
        <div className="h-[1.5px] w-[95%] mx-auto bg-background-secondary"></div>
      </div>
    </header>
  );
}

export default Header;
