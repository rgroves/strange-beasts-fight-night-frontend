import { useState, useEffect } from "react";

interface SessionState {
	gameId: string;
	playerId: string;
}

const useSession = () => {
	const [sessionState, setSessionState] = useState<SessionState>({
		gameId: sessionStorage.getItem("gameId") ?? "",
		playerId: sessionStorage.getItem("playerId") ?? "",
	});

	useEffect(() => {
		const handleStorageChange = () => {
			setSessionState({
				gameId: sessionStorage.getItem("gameId") ?? "",
				playerId: sessionStorage.getItem("playerId") ?? "",
			});
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	const setGameId = (gameId: string) => {
		if (gameId !== sessionState.gameId) {
			sessionStorage.setItem("gameId", gameId);
			setSessionState((prevState) => ({ ...prevState, gameId }));
		}
	};

	const setPlayerId = (playerId: string) => {
		if (playerId !== sessionState.playerId) {
			sessionStorage.setItem("playerId", playerId);
			setSessionState((prevState) => ({ ...prevState, playerId }));
		}
	};

	const clearSession = () => {
		sessionStorage.removeItem("gameId");
		sessionStorage.removeItem("playerId");
		setSessionState({ gameId: "", playerId: "" });
	};

	return {
		gameId: sessionState.gameId,
		playerId: sessionState.playerId,
		setGameId,
		setPlayerId,
		clearSession,
	};
};

export default useSession;
