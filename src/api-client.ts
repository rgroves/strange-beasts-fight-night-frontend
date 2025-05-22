interface StartGameInput {
	playerId: string;
}

interface StartGameOuptut {
	gameId: string;
}

interface GetGameStateInput {
	gameId: string;
}
interface GetGameStateOutput {
	state: string;
	maxPlayers: number;
	playerId: string;
	players: string[];
	monsterImageMap: Record<string, string>;
	monsterConfigMap: Record<string, string>;
	audioFilePath: string;
}

export default class ApiV1Client {
	private baseUrl = "http://localhost:3000/api/v1";

	public async startGame(input: StartGameInput): Promise<StartGameOuptut> {
		const response = await fetch(`${this.baseUrl}/game`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(input),
		});

		if (!response.ok) {
			throw new Error(`Error starting game: ${response.statusText}`);
		}
		const data = await response.json();
		return data;
	}

	public async getGameState({
		gameId,
	}: GetGameStateInput): Promise<GetGameStateOutput> {
		const response = await fetch(`${this.baseUrl}/game/${gameId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Error getting game state: ${response.statusText}`);
		}
		const data = await response.json();
		return data;
	}
}
