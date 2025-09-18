import { ModeToggle } from "./mode-toggle";

function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 px-4 ">
      <div className="mx-auto">
        <div className="flex items-center justify-between gap-2 py-2 md:py-3">
          <div className="flex-shrink-0">
            <div></div>
          </div>

          <div></div>

          <div className="flex-shrink-0 ml-auto md:ml-4">
            <ModeToggle />
          </div>
        </div>
        <div className="h-[1.5px] w-[95%] place-self-center bg-[var(--background-secondary)]"></div>
      </div>
    </header>
  );
}

export default Header;
