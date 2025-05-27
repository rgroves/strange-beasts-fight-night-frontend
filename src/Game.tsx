import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import ApiV1Client from "./api-client";
import type { GameState } from "./be-types";
import useSession from "./hooks/useSession";
import DoodleCanvas from "./DoodleCanvas";

const REFRESH_INTERVAL = 5000;
const client = new ApiV1Client();

export default function Game() {
	const { gameId, playerId, setGameId, setPlayerId } = useSession();
	const { gameId: routeGameId = "" } = useParams<{ gameId: string }>();
	const [localGameState, setLocalGameState] = useState<GameState | null>(
		null,
	);

	const statePollingIntervalId = useRef<NodeJS.Timeout | null>(null);

	const stopStatePolling = () => {
		if (statePollingIntervalId.current) {
			console.log("Stopping game state polling.");
			clearInterval(statePollingIntervalId.current);
			statePollingIntervalId.current = null;
		}
	};

	useEffect(() => {
		if (gameId) {
			const fetchGameState = async () => {
				try {
					const gameState = await client.getGameState({ gameId });
					setLocalGameState(gameState);
					console.log("Game state:", gameState);
					statePollingIntervalId.current = setTimeout(
						fetchGameState,
						REFRESH_INTERVAL,
					);
				} catch (error) {
					console.error("Error fetching game state:", error);
					return;
				}
			};

			fetchGameState();
		}

		return () => {
			stopStatePolling();
		};
	}, [gameId]);

	if (!gameId && routeGameId) {
		console.log("Setting gameId from route:", routeGameId);
		setGameId(routeGameId);
	}

	if (gameId && gameId !== routeGameId) {
		setGameId(routeGameId);
	}

	if (localGameState?.state === "GameOver") {
		stopStatePolling();
	}

	const joinGame = async () => {
		console.log(`Joining game with ID: ${gameId}`);
		const { playerId } = await client.addPlayer({
			gameId,
			requestedPlayerId: "Player 2",
		});
		setGameId(gameId);
		setPlayerId(playerId);
		console.log(`Joined game as player: ${playerId}`);
	};

	const sendDoodle = async (dataUri: string, monsterDescription: string) => {
		if (localGameState?.state !== "DrawingPhase") {
			return;
		}

		if (!gameId) {
			console.error("No game ID available to send doodle.");
			return;
		}

		if (!playerId) {
			console.error("No player ID available to send doodle.");
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
		<div>
			<div className="card">
				<h1>Game</h1>
				<h2>{gameId}</h2>
				<h3>{`Current Game State: ${localGameState?.state}`}</h3>
				{!playerId && localGameState?.state === "LobbyPhase" && (
					<button onClick={joinGame} type="button">
						Join Game
					</button>
				)}
				{playerId && <p>You are: {playerId}</p>}
				{playerId && localGameState?.state === "LobbyPhase" && (
					<p>Waiting for other players.</p>
				)}
			</div>

			{localGameState?.state === "DrawingPhase" && (
				<DoodleCanvas onExport={sendDoodle} />
			)}

			{localGameState?.state === "MonsterConfigPhase" &&
				gameId &&
				playerId && (
					<div className="card" style={{ textAlign: "left" }}>
						<h2>Monster Config</h2>
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								console.log(`playerId: ${playerId}`);
								console.log(
									`localGameState?.players: `,
									localGameState?.playersMap,
								);

								const formData = new FormData(e.currentTarget);
								const monsterConfig = {
									name:
										formData
											.get("name")
											?.toString()
											.trim() ?? "",
									description:
										localGameState?.playersMap[playerId]
											.monsterDescription,
									monsterType:
										formData
											.get("type")
											?.toString()
											.trim() ?? "",
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
									defense:
										Number(formData.get("defense")) || 3,
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

			{localGameState?.state === "GameOver" && (
				<div>
					{Object.values(localGameState?.monsterImageMap).map(
						(image) => (
							<img
								key={image}
								height="400"
								width="400"
								src={`http://localhost:3000/static/${image}`}
							/>
						),
					)}
					<audio
						controls
						src={`http://localhost:3000/static/${localGameState?.battleAudioFileName}`}
					></audio>
				</div>
			)}
		</div>
	);
}
