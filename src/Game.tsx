import { useParams } from "react-router-dom";

export default function Game() {
	const { gameId } = useParams<{ gameId: string }>();

	return (
		<div>
			<h1>Game</h1>
			<p>This is the game page for gameId: {gameId}</p>
		</div>
	);
}
