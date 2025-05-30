import type { GameState } from "../be-types";

interface EndGamePanelProps {
	gameState: GameState;
}

export default function EndGamePanel({ gameState }: EndGamePanelProps) {
	return (
		<>
			<div className="end-game-panel">
				{Object.values(gameState?.monsterImageMap).map((image) => (
					<img
						key={image}
						height="400"
						width="400"
						src={`http://localhost:3000/static/${image}`}
					/>
				))}
				<audio
					controls
					src={`http://localhost:3000/static/${gameState?.battleAudioFileName}`}
				></audio>
			</div>
			<a href="/">Exit</a>
		</>
	);
}
