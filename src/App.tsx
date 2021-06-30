import React from "react";
import {NetworkTableProvider} from "./components/NetworkTableProvider";

export function App() {

	return (
		<NetworkTableProvider>
			<div id="wrapper">
				<div style={{gridArea: "body", textAlign: "center"}}>
					<h1>I am the body</h1>
				</div>
				<div style={{gridArea: "head"}}>
					<h3>I am head</h3>
				</div>
				<div style={{gridArea: "right"}}>
					<span style={{color: "red"}}>
						I am the right
					</span>
				</div>
				<div style={{gridArea: "left"}}>
					<span style={{color: "blue"}}>
						I am the left
					</span>
				</div>
			</div>
		</NetworkTableProvider>
	)
}