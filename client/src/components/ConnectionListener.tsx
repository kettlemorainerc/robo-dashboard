import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useNetworkTable } from "./NetworkTableProvider";

export function ConnectionListener() {
	const nt = useNetworkTable();
	const {isConnected, targetRemote, setTargetRemote} = nt;

	// 10.team-first-2.team-last.2
	// 172.22.11.2 (?)
	// roboRIO-<teamNumber>-FRC.frc-field.local
	// roboRIO-<teamNumber>-FRC.lan
	const [to, setTo] = useState<string>("127.0.0.1");
	useEffect(() => {
		if(targetRemote) setTo(targetRemote);
	}, [targetRemote]);

	const onAttemptConnect = useCallback(() => {
		setTargetRemote(to);
	}, [to, setTargetRemote]);

	console.log({connected: isConnected()})

	return (
		<div className="head">
			<input type="text" value={to} onChange={e => setTo(e.target.value)} />
			<button type="button" onClick={onAttemptConnect}>
				Connect
			</button>
			<div>
				{isConnected() ? `${targetRemote} - Connected` : "Not Connected"}
			</div>
		</div>
	)
}