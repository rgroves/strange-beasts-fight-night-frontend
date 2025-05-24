import type { GameState } from "./be-types";

interface StartGameInput {
	playerId: string;
}

interface StartGameOuptut {
	gameId: string;
	playerId: string;
}

interface GetGameStateInput {
	gameId: string;
}
interface AddPlayerInput {
	gameId: string;
	requestedPlayerId: string;
}

interface AddPlayerOutput {
	playerId: string;
}

interface UploadDoodleInput {
	gameId: string;
	playerId: string;
	monsterDescription: string;
	dataUri: string;
}

interface UploadDoodleOutput {
	fileName: string;
}

interface UploadMonsterConfigInput {
	gameId: string;
	playerId: string;
	name: string;
	description: string;
	monsterType: string;
	attackTypes: string[];
	specialAbilities: string[];
	power: number;
	defense: number;
	speed: number;
	maxHealth: number;
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
	}: GetGameStateInput): Promise<GameState> {
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

	public async addPlayer({
		gameId,
		requestedPlayerId,
	}: AddPlayerInput): Promise<AddPlayerOutput> {
		const response = await fetch(
			`${this.baseUrl}/game/${gameId}/player/${requestedPlayerId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ requestedPlayerId }),
			},
		);

		if (!response.ok) {
			throw new Error(`Error adding player: ${response.statusText}`);
		}
		const data = await response.json();
		return data;
	}

	public async uploadDoodle({
		gameId,
		playerId,
		monsterDescription,
		dataUri,
	}: UploadDoodleInput): Promise<UploadDoodleOutput> {
		const response = await fetch(
			`${this.baseUrl}/game/${gameId}/player/${playerId}/doodle`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ image: dataUri, monsterDescription }),
			},
		);

		if (!response.ok) {
			throw new Error(
				`Error adding player doodle: ${response.statusText}`,
			);
		}
		const data = await response.json();
		return { fileName: data.fileName };
	}

	public async uploadMonsterConfig({
		gameId,
		playerId,
		name,
		description,
		monsterType,
		attackTypes,
		specialAbilities,
		power,
		defense,
		speed,
		maxHealth,
	}: UploadMonsterConfigInput): Promise<void> {
		const response = await fetch(
			`${this.baseUrl}/game/${gameId}/player/${playerId}/monster-config`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					description,
					monsterType,
					attackTypes,
					specialAbilities,
					power,
					defense,
					speed,
					maxHealth,
				}),
			},
		);

		if (!response.ok) {
			throw new Error(
				`Error uploading monster config: ${response.statusText}`,
			);
		}
	}
}
