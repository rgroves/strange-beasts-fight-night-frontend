import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import ApiV1Client from "./api-client";
import "./App.css";
import type { GameState } from "./be-types";
import useSession from "./hooks/useSession";

const client = new ApiV1Client();

function App() {
	const navigate = useNavigate();
	const { gameId, playerId, setGameId, setPlayerId, clearSession } =
		useSession();
	const [localGameState, setLocalGameState] = useState<GameState | null>(
		null,
	);

	useEffect(() => {
		if (gameId) {
			const fetchGameState = async () => {
				try {
					const gameState = await client.getGameState({ gameId });
					console.log("Game state:", gameState);
					setLocalGameState(gameState);
				} catch (error) {
					console.error("Error fetching game state:", error);
				}
			};

			fetchGameState();
		}
	}, [gameId]);

	if (localGameState?.state === "GameOver") {
		clearSession();
		setLocalGameState(null);
	}

	const startGame = async () => {
		const requestedPlayerId = "Player 1";
		const { gameId, playerId } = await client.startGame({
			playerId: requestedPlayerId,
		});
		setGameId(gameId);
		setPlayerId(playerId);
		console.log(
			`Starting new game with: gameId(${gameId}) playerId(${playerId})`,
		);
		navigate(`/game/${gameId}`);
	};

	return (
		<>
			<h1>Strange Beasts: Fight Night</h1>
			{!gameId && (
				<div className="card">
					<button onClick={startGame} type="button">
						Get ready to rumble!
					</button>
				</div>
			)}
			{gameId && (
				<div className="card">
					<div>
						You are {playerId} in game {gameId}
					</div>
					<a href={`/game/${gameId}`}>Continue Game</a>
				</div>
			)}
		</>
	);
}

export default App;
