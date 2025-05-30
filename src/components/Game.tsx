import { useEffect, useRef, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";

import ApiV1Client from "../api-client";
import type { GameState } from "../be-types";
import useSession from "../hooks/useSession";
import DoodleCanvas from "./DoodleCanvas";
import EndGamePanel from "./EndGamePanel";
import MonsterConfigPanel from "./MonsterConfigPanel";

const REFRESH_INTERVAL = 1000;
const client = new ApiV1Client();

export default function Game() {
	const { gameId, playerId, setGameId, setPlayerId } = useSession();
	const { gameId: routeGameId = "" } = useParams<{ gameId: string }>();
	const [localGameState, setLocalGameState] = useState<GameState | null>(
		null,
	);
	const [waitForState, setWaitForState] = useState("");

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

	useEffect(() => {
		if (localGameState?.state === waitForState) {
			setWaitForState("");
		}
	}, [localGameState?.state, waitForState]);

	if (!gameId && routeGameId) {
		console.log("Setting gameId from route:", routeGameId);
		setGameId(routeGameId);
	}

	if (gameId && gameId !== routeGameId) {
		setGameId(routeGameId);
	}

	const hasGameAndPlayerId = gameId && playerId;
	const isAbleToJoinGame =
		!playerId && localGameState?.state === "LobbyPhase";
	const isWaitingForPlayers =
		playerId && localGameState?.state === "LobbyPhase";
	const shouldAllowDrawing =
		localGameState?.state === "DrawingPhase" &&
		!waitForState &&
		hasGameAndPlayerId;
	const shouldAllowMonsterConfig =
		localGameState?.state === "MonsterConfigPhase" &&
		!waitForState &&
		hasGameAndPlayerId;
	const isGameOver = localGameState?.state === "GameOver" && gameId;
	const isLoading = waitForState && !isGameOver;

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
		const doodleFileName = await client.uploadDoodle({
			gameId,
			playerId,
			monsterDescription,
			dataUri,
		});
		setWaitForState("MonsterConfigPhase");

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
		setWaitForState("Audio");
	};

	return (
		<div>
			<div className="card">
				<h1>Strange Beasts: Fight Night</h1>
				<h2>
					Room Code:{" "}
					<a href={`http://localhost:5173/game/${gameId}`}>
						{gameId}
					</a>
				</h2>
				<h3>{`Game State: ${localGameState?.state}`}</h3>
				{isAbleToJoinGame && (
					<button onClick={joinGame} type="button">
						Join Game
					</button>
				)}
				{isWaitingForPlayers && <p>You are: {playerId}</p>}
				{isWaitingForPlayers && <p>Waiting for other players.</p>}
			</div>

			{shouldAllowDrawing && <DoodleCanvas onExport={sendDoodle} />}

			{shouldAllowMonsterConfig && (
				<MonsterConfigPanel onSubmit={submitMonsterConfig} />
			)}

			{isGameOver && <EndGamePanel gameState={localGameState} />}

			{isLoading && (
				<div className="card">
					<p>Loading...</p>
				</div>
			)}
		</div>
	);
}
