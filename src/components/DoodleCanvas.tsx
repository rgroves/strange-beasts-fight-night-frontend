import { type ChangeEvent, useRef, useState } from "react";
import {
	ReactSketchCanvas,
	type CanvasRef,
	type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import useDynamicSizing from "../hooks/useDynamicSizing";

interface DoodleCanvasProps {
	onExport: (dataUri: string, monsterDescription: string) => Promise<void>;
}

export default function DoodleCanvas({ onExport }: DoodleCanvasProps) {
	const canvasRef = useRef<ReactSketchCanvasRef>(null);
	const { doodleSize } = useDynamicSizing();
	const [description, setDescription] = useState("");

	const [eraseMode, setEraseMode] = useState(false);
	const [strokeColor, setStrokeColor] = useState("#000000");

	const [strokeWidth, setStrokeWidth] = useState(5);
	const [eraserWidth, setEraserWidth] = useState(10);

	const handleEraserClick = () => {
		setEraseMode(true);
		canvasRef.current?.eraseMode(true);
	};

	const handlePenClick = () => {
		setEraseMode(false);
		canvasRef.current?.eraseMode(false);
	};

	const handleStrokeWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
		setStrokeWidth(+event.target.value);
	};

	const handleEraserWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEraserWidth(+event.target.value);
	};

	const handleUndoClick = () => {
		canvasRef.current?.undo();
	};

	const handleRedoClick = () => {
		canvasRef.current?.redo();
	};

	const handleClearClick = () => {
		canvasRef.current?.clearCanvas();
	};

	const handleResetClick = () => {
		canvasRef.current?.resetCanvas();
	};

	const handleStrokeColorChange = (event: ChangeEvent<HTMLInputElement>) => {
		setStrokeColor(event.target.value);
	};

	const saveHandler = async () => {
		if (!canvasRef.current) {
			return;
		}
		if (description.trim() === "") {
			alert("Please enter a description.");
			return;
		}

		(canvasRef.current as CanvasRef)
			.exportImage("png", { width: 1024, height: 1024 })
			.then((dataUri) => {
				console.log(dataUri);
				onExport(dataUri, description);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	return (
		<div className="card">
			<h2>Draw Your Beast</h2>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "1rem",
				}}
			>
				<p
					style={{
						maxWidth: "70ch",
						alignSelf: "center",
						textWrap: "balance",
					}}
				>
					Just needs to be a simple doodle, it doesn't have to be
					fancy. Do be sure to provide a creative, imaginative
					description of your beast in the text area below the
					drawing.
				</p>
				<div
					style={{
						margin: "0 auto",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: ".5rem",
						}}
					>
						<div
							style={{
								display: "flex",
								gap: "1rem",
								alignItems: "center",
							}}
						>
							<button
								type="button"
								disabled={!eraseMode}
								onClick={handlePenClick}
							>
								Pen
							</button>
							<label htmlFor="strokeWidth">Stroke width</label>
							<input
								disabled={eraseMode}
								type="range"
								min="1"
								max="20"
								step="1"
								id="strokeWidth"
								value={strokeWidth}
								onChange={handleStrokeWidthChange}
							/>
							<label htmlFor="color">Stroke color</label>
							<input
								id="color"
								type="color"
								value={strokeColor}
								onChange={handleStrokeColorChange}
							/>
						</div>

						<div
							style={{
								display: "flex",
								gap: "1rem",
								alignItems: "center",
							}}
						>
							<button
								type="button"
								disabled={eraseMode}
								onClick={handleEraserClick}
							>
								Eraser
							</button>
							<label htmlFor="eraserWidth">Eraser width</label>
							<input
								disabled={!eraseMode}
								type="range"
								min="1"
								max="20"
								step="1"
								id="eraserWidth"
								value={eraserWidth}
								onChange={handleEraserWidthChange}
							/>
						</div>

						<div
							style={{
								display: "flex",
								gap: "1rem",
								alignItems: "center",
								justifyContent: "space-around",
							}}
						>
							<button type="button" onClick={handleUndoClick}>
								Undo
							</button>
							<button type="button" onClick={handleRedoClick}>
								Redo
							</button>
							<button type="button" onClick={handleClearClick}>
								Clear
							</button>
							<button type="button" onClick={handleResetClick}>
								Reset
							</button>
						</div>
					</div>
				</div>

				<ReactSketchCanvas
					style={{ alignSelf: "center" }}
					ref={canvasRef}
					strokeColor={strokeColor}
					strokeWidth={strokeWidth}
					eraserWidth={eraserWidth}
					width={`${doodleSize}px`}
					height={`${doodleSize}px`}
				/>

				<div>
					<label htmlFor="description">Monster Description:</label>
					<textarea
						style={{ width: "100%" }}
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={5}
					/>
				</div>

				<button type="button" onClick={saveHandler}>
					Save
				</button>
			</div>
		</div>
	);
}
