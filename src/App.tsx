import { useEffect, useState } from "react";
import ApiV1Client from "./api-client";
import "./App.css";

const client = new ApiV1Client();

function App() {
	const [gameId, setGameId] = useState<string>("");

	useEffect(() => {
		if (gameId) {
			const fetchGameState = async () => {
				try {
					const gameState = await client.getGameState({ gameId });
					console.log("Game state:", gameState);
				} catch (error) {
					console.error("Error fetching game state:", error);
				}
			};
			fetchGameState();
		}
	}, [gameId]);

	const startGame = async () => {
		const { gameId } = await client.startGame({ playerId: "Player 1" });
		setGameId(gameId);
		console.log(`Game started with ID: ${gameId}`);
	};

	return (
		<>
			<h1>Strange Beasts: Fight Night</h1>
			<div className="card">
				<button onClick={startGame} type="button">
					Get ready to rumble!
				</button>
			</div>
		</>
	);
}

export default App;
