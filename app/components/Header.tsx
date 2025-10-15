import { Link, useSearchParams } from "react-router";
import { ModeToggle } from "./mode-toggle";

function Header() {
  const [searchParams] = useSearchParams();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 px-4 w-full">
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between gap-2 py-2 md:py-3">
          <div className="flex-shrink-0">
            <Link
              to={{ pathname: "/", search: searchParams.toString() }}
              className="w-[45px] font-semibold text-[12px] h-[45px] rounded-full bg-background-primary flex items-center justify-center"
            >
              <img
                src="/m3terhead.webp"
                alt="M3terhead"
                className="w-[40px] h-[40px]"
              />
            </Link>
          </div>

          <div></div>

          <div className="flex-shrink-0 ml-auto md:ml-4">
            <ModeToggle />
          </div>
        </div>
        <div className="h-[1.5px] w-[95%] mx-auto bg-background-secondary"></div>
      </div>
    </header>
  );
}

export default Header;
