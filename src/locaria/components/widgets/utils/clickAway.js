import React, {useEffect, useRef} from "react";


function ClickAwayActual(wrapperRef,update) {

	useEffect(() => {
		function handleClickOutside(event) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				update();
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	});

}

export default function ClickAway({children,update}) {
	const wrapperRef = useRef(null);
	ClickAwayActual(wrapperRef,update);
	return <div ref={wrapperRef}>{children}</div>;
}