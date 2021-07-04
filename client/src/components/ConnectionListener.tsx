import React, {useCallback, useEffect, useReducer, useRef, useState} from "react";
import {useNetworkTable} from "./NetworkTableProvider";

export function ConnectionListener() {
	const nt = useNetworkTable();
	const {connectionStatus, targetRemote, setTargetRemote, connectToTarget} = nt;

	return (
		<div className="connection-listener" style={{display: "flex", padding: ".5rem"}}>
			<input type="text" value={targetRemote} onChange={e => setTargetRemote(e.target.value)} style={{borderRightColor: "transparent"}} />
			<button type="button" onClick={connectToTarget} style={{}}>
				Connect
			</button>
			<div style={{marginLeft: ".5rem"}}>
				{connectionStatus !== "Not Connected" && `${targetRemote} - `}{connectionStatus}
			</div>
		</div>
	)
}