import { useState, useEffect } from "react";

const getMaxSize = (width: number, height: number) => {
	const minWindowSize = Math.floor(Math.min(width, height) * 0.8);
	return Math.max(320, minWindowSize);
};

const useDynamicSizing = () => {
	const [size, setSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
		doodleSize: getMaxSize(window.innerWidth, window.innerHeight),
	});

	useEffect(() => {
		const handleResize = () => {
			const doodleSize = getMaxSize(
				window.innerWidth,
				window.innerHeight,
			);
			console.log(
				`Window resized: ${window.innerWidth}x${window.innerHeight}, Doodle size: ${doodleSize}`,
			);
			setSize({
				width: window.innerWidth,
				height: window.innerHeight,
				doodleSize,
			});
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return size;
};

export default useDynamicSizing;
