// TODO: This is not the way.
//       These are types copied (some slightly modified due to tsconfig setting differences) from the backend code.
//       Should eventually do something fancier to get the types from the backend.

export type PlayerId = string;
export type AbilityScore = number;
export type HealthScore = number;

export interface Player {
	id: PlayerId;
}

export interface GameState {
	state:
		| "LobbyPhase"
		| "DrawingPhase"
		| "MonsterConfigPhase"
		| "BattleResolutionPhase"
		| "BattleCommentaryPhase"
		| "AudioGenerationPhase"
		| "GameOver";
	maxPlayers: number;
	players: Player[];
	monsterImageMap: Record<PlayerId, string>;
	monsterConfigMap: Record<PlayerId, MonsterConfig>;
	battleAudioFileName: string;
}

export interface MonsterConfig {
	name: string;
	description: string;
	monsterType: string;
	attackTypes: string[];
	specialAbilities: string[];
	power: AbilityScore;
	defense: AbilityScore;
	speed: AbilityScore;
	maxHealth: HealthScore;
	// TODO Ideally the attributes below become dynamically calcuable and not needed to be slammed in here
	currentHealth: HealthScore;
	startingVitality: Vitality;
	currentVitality: Vitality;
}

export type Vitality = "Fresh" | "Worn" | "Wounded" | "Critical" | "Dead";
