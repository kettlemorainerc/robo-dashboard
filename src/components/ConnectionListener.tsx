import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useNetworkTable } from "./NetworkTableProvider";

export function ConnectionListener() {
	const nt = useNetworkTable();
	const [, forceUpdate] = useReducer(i => i + 1, 0);

	const [connected, setConnected] = useState(nt.isRobotConnected());
	// 10.team-first-2.team-last.2
	// 172.22.11.2 (?)
	// roboRIO-<teamNumber>-FRC.frc-field.local
	// roboRIO-<teamNumber>-FRC.lan
	const [to, setTo] = useState<string>("127.0.0.1");

	const ref = useRef<string>(to);
	const current = useRef<string>(`${to} - Connecting...`);

	const onAttemptConnect = useCallback(() => {
		ref.current = to;
		nt.connect(to);
	}, [to]);

	useEffect(() => {
		const connectionListener = (connected: boolean) => {
			if(connected) {
				setConnected(true);
				current.current = `${ref.current} - Connected`;
				forceUpdate();
			} else {
				setConnected(false);
				current.current = "Not Connected"
				ref.current = "";
				forceUpdate();
			}
		}
		nt.addRobotConnectionListener(connectionListener);
		onAttemptConnect();
	}, []);

	return (
		<div className="head">
			<input type="text" value={to} onChange={e => setTo(e.target.value)} />
			<button type="button" onClick={onAttemptConnect}>
				Connect
			</button>
			<div>
				{current.current}
			</div>
		</div>
	)
}