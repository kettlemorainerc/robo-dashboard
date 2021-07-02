import React from "react";
import {WebSockerProvider} from "./components/NetworkTableProvider";
import { NTArrayView, NTView, } from "./components/NetworkTableList";
import { ConnectionListener } from "./components/ConnectionListener";

export function App() {

	return (
		<WebSockerProvider>
			<div id="wrapper">
				<div className="body">
					<h1>I am the body</h1>
				</div>
				<div className="head">
					<ConnectionListener />
				</div>
				<div className="right">
					<span style={{color: "red"}}>
						I am the right
					</span>
				</div>
				<div className="left">
					<h3>Raw NT Values</h3>
					<div className="nt-values">
						<NTView
							targetNTKey="boolean"
							childType="checkbox"
						/>
						<NTView
							targetNTKey="string"
							childType="text"
						/>
						<NTView
							targetNTKey="double"
							childType="number"
						/>
						<NTView
							targetNTKey="This is a long key"
							childType="number"
						/>
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
					</div>
				</div>
			</div>
		</WebSockerProvider>
	)
}