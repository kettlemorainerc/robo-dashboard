import React, { useCallback, useState } from "react";
import {NTMessType, WebSockerProvider} from "./components/NetworkTableProvider";
import { NTArrayView, NTInputTypes, NTView} from "./components/NetworkTableList";
import { ConnectionListener } from "./components/ConnectionListener";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type ChildType = {key: string} & (
	{type: Exclude<NTMessType, `${string}[]`>, childType: Exclude<NTInputTypes, "radio">} |
	{type: Extract<NTMessType, `${string}[]`>, childType: NTInputTypes}
)

export function App() {

	const [keys, setKeys] = useState<ChildType[]>([
		{key: "boolean", type: "boolean", childType: "checkbox"},
		{key: "string", type: "string", childType: "text"},
		{key: "double", type: "double", childType: "number"},
		{key: "This is a long key", type: "double", childType: "number"},
		{key: "Selected Autonomous", type: "double[]", childType: "radio"},
		{key: "Random Strings", type: "string[]", childType: "text"},
		{key: "Doubles", type: "double[]", childType: "number"},
	]);

	const move = useCallback((from: number, to: number) => {
		setKeys(keys => {
			const early = from > to ? to : from; // get the smaller index
			const late = early === from ? to : from; // larger index

			const a = keys[early];
			const b = keys[late];

			const before = keys.slice(0, early);
			const between = keys.slice(early + 1, late);
			const after = keys.slice(late + 1);

			return [...before, b, ...between, a, ...after];
		});
	}, [setKeys]);

	return (
		<DndProvider backend={HTML5Backend}>
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
							{keys.map(({key, type, childType}, idx) => (
								type.endsWith("[]") ? (
									<NTArrayView key={key} index={idx} childType={childType} targetNTKey={key} move={move} />
								) : (
									<NTView key={key} index={idx} childType={childType as any} targetNTKey={key} move={move} />
								)
							))}
							{/* <NTView
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
							/> */}
						</div>
					</div>
				</div>
			</WebSockerProvider>
		</DndProvider>
	)
}