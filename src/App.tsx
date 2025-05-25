import { useEffect, useState } from "react";
import ApiV1Client from "./api-client";
import "./App.css";
import DoodleCanvas from "./DoodleCanvas";
import type { GameState } from "./be-types";

const client = new ApiV1Client();

function App() {
	const [gameId, setGameId] = useState<string>("");
	const [localGameState, setLocalGameState] = useState<GameState | null>(
		null,
	);
	const [playerId, setPlayerId] = useState<string>("");

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

	if (localGameState?.state === "GameOver") {
		setGameId("");
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
		setPlayerId(playerId);
		console.log(`Joined game as player: ${playerId}`);
		console.log(`Current players: ${localGameState?.players}`);
	};

	const sendDoodle = async (dataUri: string, monsterDescription: string) => {
		if (localGameState?.state !== "DrawingPhase") {
			return;
		}

		if (!gameId) {
			console.error("No game ID available to send doodle.");
			return;
		}

		const doodleFileName = await client.uploadDoodle({
			gameId,
			playerId,
			monsterDescription,
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

			{localGameState?.state === "MonsterConfigPhase" && (
				<div className="card" style={{ textAlign: "left" }}>
					<h2>Monster Config</h2>
					<form
						onSubmit={async (e) => {
							e.preventDefault();

							const formData = new FormData(e.currentTarget);
							const monsterConfig = {
								name:
									formData.get("name")?.toString().trim() ??
									"",
								description:
									localGameState?.players[playerId]
										.monsterDescription,
								monsterType:
									formData.get("type")?.toString().trim() ??
									"",
								attackTypes:
									formData
										.get("attackTypes")
										?.toString()
										.split(",")
										.map((s) => s.trim())
										.filter(Boolean) ?? [],
								specialAbilities:
									formData
										.get("specialAbilities")
										?.toString()
										.split(",")
										.map((s) => s.trim())
										.filter(Boolean) ?? [],
								power: Number(formData.get("power")) || 3,
								defense: Number(formData.get("defense")) || 3,
								speed: Number(formData.get("speed")) || 3,
								maxHealth: 6,
							};
							console.log("Monster Config: ", monsterConfig);

							client.uploadMonsterConfig({
								gameId,
								playerId,
								name: monsterConfig.name,
								description: monsterConfig.description,
								monsterType: monsterConfig.monsterType,
								attackTypes: monsterConfig.attackTypes,
								specialAbilities:
									monsterConfig.specialAbilities,
								power: monsterConfig.power,
								defense: monsterConfig.defense,
								speed: monsterConfig.speed,
								maxHealth: monsterConfig.maxHealth,
							});
							console.log("Monster Config submitted");
						}}
						autoComplete="off"
					>
						<div>
							<label>
								Name:
								<input
									name="name"
									type="text"
									placeholder="Monster Name"
									required
									autoFocus
								/>
							</label>
						</div>
						<div>
							<label>
								Type:
								<input
									name="type"
									type="text"
									placeholder="Monster Type (e.g. Golem, Demon)"
									required
								/>
							</label>
						</div>
						<div>
							<label>
								Attack Types:
								<input
									name="attackTypes"
									type="text"
									placeholder="Attack Types (comma separated)"
								/>
							</label>
						</div>
						<div>
							<label>
								Special Abilities:
								<input
									name="specialAbilities"
									type="text"
									placeholder="Special Abilities (comma separated)"
								/>
							</label>
						</div>
						<div>
							<label>
								Power:
								<input
									name="power"
									type="number"
									placeholder="Power"
									min={1}
									max={6}
									defaultValue={3}
									required
								/>
							</label>
						</div>
						<div>
							<label>
								Defense:
								<input
									name="defense"
									type="number"
									placeholder="Defense"
									min={1}
									max={6}
									defaultValue={3}
									required
								/>
							</label>
						</div>
						<div>
							<label>
								Speed:
								<input
									name="speed"
									type="number"
									placeholder="Speed"
									min={1}
									max={6}
									defaultValue={3}
									required
								/>
							</label>
						</div>
						<div style={{ marginTop: "1em" }}>
							<button type="submit">Submit</button>
						</div>
					</form>
				</div>
			)}
		</>
	);
}

export default App;
