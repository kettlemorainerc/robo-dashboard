import React from "react";
import {WebSockerProvider} from "./components/NetworkTableProvider";
import { NTArrayView } from "./components/NetworkTableList";
import { ConnectionListener } from "./components/ConnectionListener";

export function App() {

	return (
		<WebSockerProvider>
			<div id="wrapper">
				<div style={{gridArea: "body", textAlign: "center"}}>
					<h1>I am the body</h1>
				</div>
				<div style={{gridArea: "head"}}>
					<ConnectionListener />
				</div>
				<div style={{gridArea: "right"}}>
					<span style={{color: "red"}}>
						I am the right
					</span>
				</div>
				<div style={{gridArea: "left"}}>
					<span style={{color: "blue"}}>
						<NTArrayView
							targetNTKey="Selected Autonomous"
							childType="radio"
						/>
						<NTArrayView
							targetNTKey="Random Strings"
							childType="text"
						/>
						<NTArrayView
							targetNTKey="Doubles"
							childType="number"
						/>
					</span>
				</div>
			</div>
		</WebSockerProvider>
	)
}