import type { RefObject } from "react";
import { useEffect } from "react";

const useClickOutside = (
	ref: RefObject<HTMLElement | null>,
	callback: () => void
) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!(event.target instanceof Node)) return;
			if (ref.current && !ref.current.contains(event.target as Node)) {
				callback();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref, callback]);
};

export default useClickOutside;
