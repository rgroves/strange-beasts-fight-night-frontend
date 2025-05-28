import { useEffect, useRef, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";

import ApiV1Client from "../api-client";
import type { GameState } from "../be-types";
import useSession from "../hooks/useSession";
import DoodleCanvas from "./DoodleCanvas";
import EndGamePanel from "./EndGamePanel";
import MonsterConfigPanel from "./MonsterConfigPanel";

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

	const hasGameAndPlayerId = gameId && playerId;

	if (localGameState?.state === "GameOver") {
		stopStatePolling();
	}

	const joinGame = async () => {
		if (localGameState?.state !== "LobbyPhase") {
			return;
		}

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

	const submitMonsterConfig = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(`playerId: ${playerId}`);
		console.log(`gameState?.players: `, localGameState?.playersMap);

		const defaultMonsterName = "Smiley McHappyFace";
		const defaultMonsterDescription = "";
		const defaultMonsterType = "Imaginary Abomination";

		const formData = new FormData(e.currentTarget);
		const monsterConfig = {
			name: formData.get("name")?.toString().trim() ?? defaultMonsterName,
			description:
				localGameState?.playersMap[playerId].monsterDescription ??
				defaultMonsterDescription,
			monsterType:
				formData.get("type")?.toString().trim() ?? defaultMonsterType,
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
			...monsterConfig,
		});
		console.log("Monster Config submitted");
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

			{localGameState?.state === "DrawingPhase" && hasGameAndPlayerId && (
				<DoodleCanvas onExport={sendDoodle} />
			)}

			{localGameState?.state === "MonsterConfigPhase" &&
				hasGameAndPlayerId && (
					<MonsterConfigPanel onSubmit={submitMonsterConfig} />
				)}

			{localGameState?.state === "GameOver" && hasGameAndPlayerId && (
				<EndGamePanel gameState={localGameState} />
			)}
		</div>
	);
}
