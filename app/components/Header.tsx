import { Link } from "react-router";
import { ModeToggle } from "./mode-toggle";

function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 px-4 w-full">
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between gap-2 py-2 md:py-3">
          <div className="flex-shrink-0">
            <Link
              to={"/"}
              className="w-[75px] font-semibold text-[12px] h-[30px] rounded-[20px] bg-[var(--background-primary)] flex items-center justify-center"
            >
              SWITCH
            </Link>
          </div>

          <div></div>

          <div className="flex-shrink-0 ml-auto md:ml-4">
            <ModeToggle />
          </div>
        </div>
        <div className="h-[1.5px] w-[95%] mx-auto bg-[var(--background-secondary)]"></div>
      </div>
    </header>
  );
}

export default Header;
