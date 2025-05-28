import { type ChangeEvent, useRef, useState } from "react";
import {
	ReactSketchCanvas,
	type CanvasRef,
	type ReactSketchCanvasRef,
} from "react-sketch-canvas";

interface DoodleCanvasProps {
	onExport: (dataUri: string, monsterDescription: string) => Promise<void>;
}

export default function DoodleCanvas({ onExport }: DoodleCanvasProps) {
	const canvasRef = useRef<ReactSketchCanvasRef>(null);
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

	return (
		<div>
			<h1>Tools</h1>
			<div className="d-flex gap-2 align-items-center ">
				<button
					type="button"
					className="btn btn-sm btn-outline-primary"
					disabled={!eraseMode}
					onClick={handlePenClick}
				>
					Pen
				</button>
				<button
					type="button"
					className="btn btn-sm btn-outline-primary"
					disabled={eraseMode}
					onClick={handleEraserClick}
				>
					Eraser
				</button>
				<label htmlFor="strokeWidth" className="form-label">
					Stroke width
				</label>
				<input
					disabled={eraseMode}
					type="range"
					className="form-range"
					min="1"
					max="20"
					step="1"
					id="strokeWidth"
					value={strokeWidth}
					onChange={handleStrokeWidthChange}
				/>
				<label htmlFor="color">Stroke color</label>
				<input
					type="color"
					value={strokeColor}
					onChange={handleStrokeColorChange}
				/>
				<label htmlFor="eraserWidth" className="form-label">
					Eraser width
				</label>
				<input
					disabled={!eraseMode}
					type="range"
					className="form-range"
					min="1"
					max="20"
					step="1"
					id="eraserWidth"
					value={eraserWidth}
					onChange={handleEraserWidthChange}
				/>
				<button
					type="button"
					className="btn btn-sm btn-outline-primary"
					onClick={handleUndoClick}
				>
					Undo
				</button>
				<button
					type="button"
					className="btn btn-sm btn-outline-primary"
					onClick={handleRedoClick}
				>
					Redo
				</button>
				<button
					type="button"
					className="btn btn-sm btn-outline-primary"
					onClick={handleClearClick}
				>
					Clear
				</button>
				<button
					type="button"
					className="btn btn-sm btn-outline-primary"
					onClick={handleResetClick}
				>
					Reset
				</button>
			</div>
			<h1>Canvas</h1>
			<ReactSketchCanvas
				ref={canvasRef}
				strokeColor={strokeColor}
				strokeWidth={strokeWidth}
				eraserWidth={eraserWidth}
				width="1024px"
				height="1024px"
			/>

			<div>
				<label htmlFor="description">Monster Description:</label>
				<textarea
					style={{ width: "75%" }}
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={5}
					className="form-control"
				/>
			</div>

			<button
				type="button"
				onClick={() => {
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
				}}
			>
				Get Image
			</button>
		</div>
	);
}
