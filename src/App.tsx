import { useEffect, useState } from "react";
import ApiV1Client from "./api-client";
import "./App.css";
import DoodleCanvas from "./DoodleCanvas";

const client = new ApiV1Client();

function App() {
	const [gameId, setGameId] = useState<string>("");
	const [localGameState, setLocalGameState] = useState<any>(undefined);
	useState(false);

	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null;

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
			console.log("Fetching game state every 3 seconds");
			intervalId = setInterval(fetchGameState, 3000);
		}

		return () => {
			if (intervalId) {
				console.log("Stopping game state fetch");
				clearInterval(intervalId);
			}
		};
	}, [gameId]);

	const startGame = async () => {
		const requestedPlayerId = "Player 1";
		const { gameId, playerId } = await client.startGame({
			playerId: requestedPlayerId,
		});
		setGameId(gameId);
		console.log(
			`Game started with gameId(${gameId}) and playerId(${playerId})`,
		);
	};

	const joinGame = async () => {
		console.log(`Joining game with ID: ${gameId}`);
		if (!gameId) {
			console.error("No game ID available to join.");
			return;
		}
		const { playerId } = await client.addPlayer({
			gameId,
			requestedPlayerId: "Player 2",
		});

		// Optimistic update the local game state
		setLocalGameState((prevState: any) => ({
			...prevState,
			state: "WAIT",
		}));
		console.log(`Joined game as player: ${playerId}`);
		console.log(`Current players: ${localGameState.players}`);
	};

	const sendDoodle = async (dataUri: string) => {
		if (localGameState?.state !== "DrawingPhase") {
			return;
		}

		if (!gameId) {
			console.error("No game ID available to send doodle.");
			return;
		}

		const playerId =
			localGameState?.monsterImageMap["Player 1"] === undefined ?
				"Player 1"
			:	"Player 2";

		const doodleFileName = await client.uploadDoodle({
			gameId,
			playerId,
			dataUri,
		});

		console.log(`Doodle sent: ${doodleFileName}`);
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
			{localGameState?.state === "LobbyPhase" && (
				<div className="card">
					<button onClick={joinGame} type="button">
						Join [in progress: {gameId}]
					</button>
				</div>
			)}

			<div>{`Current State of the Game: ${localGameState?.state}`}</div>

			{localGameState?.state === "DrawingPhase" && (
				<DoodleCanvas onExport={sendDoodle} />
			)}
		</>
	);
}

export default App;
