import React from "react";
import {NetworkTableProvider} from "./components/NetworkTableProvider";
import { BooleanNTInput, BooleanArrayView, NTArrayView } from "./components/NetworkTableList";
import { Accordion } from "./components/Accordion";
import { ConnectionListener } from "./components/ConnectionListener";

export function App() {

	return (
		<NetworkTableProvider>
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
						I am the left
						<Accordion label="Checkboxes">
							<BooleanArrayView
								onChange={() => {}}
								childType="checkbox"
								targetNTKey="Something"
								value={[true, false, false, true]}
							/>
						</Accordion>
						<Accordion label="Radios">
							<BooleanArrayView
								onChange={() => {}}
								childType="radio"
								targetNTKey="Single choice"
								value={[undefined, undefined, undefined, undefined] as any[]}
							/>
						</Accordion>
						<BooleanNTInput
							checked={false}
							label="False"
							name="thing"
							onChange={() => {}}
							type="checkbox"
						/>
						<BooleanNTInput
							checked={true}
							label="True"
							name="thing2"
							onChange={() => {}}
							type="checkbox"
						/>
						<BooleanNTInput
							checked={undefined as any}
							label="False"
							name="radio"
							onChange={() => {}}
							type="radio"
						/>
						<BooleanNTInput
							checked={undefined as any}
							label="True"
							name="radio"
							onChange={() => {}}
							type="radio"
						/>
					</span>
				</div>
			</div>
		</NetworkTableProvider>
	)
}