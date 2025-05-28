interface MonsterConfigPanelProps {
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function MonsterConfigPanel({
	onSubmit,
}: MonsterConfigPanelProps) {
	return (
		<div className="card" style={{ textAlign: "left" }}>
			<h2>Monster Config</h2>
			<form onSubmit={onSubmit} autoComplete="off">
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
	);
}
