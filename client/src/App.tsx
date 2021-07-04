import React, {useCallback, useState} from "react";
import {NetworkTableMessageType, WebSockerProvider} from "./components/NetworkTableProvider";
import {NetworkTableArrayView, NetworkTableInputTypes, NetworkTableValueView} from "./components/NetworkTableList";
import {ConnectionListener} from "./components/ConnectionListener";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

type ChildType = {key: string} & (
	{type: Exclude<NetworkTableMessageType, `${string}[]`>, childType: Exclude<NetworkTableInputTypes, "radio">} |
	{type: Extract<NetworkTableMessageType, `${string}[]`>, childType: NetworkTableInputTypes}
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
						<h3>Raw NetworkTable Values</h3>
						<div className="nt-values">
							{keys.map(({key, type, childType}, idx) => (
								type.endsWith("[]") ? (
									<NetworkTableArrayView key={key} index={idx} childType={childType} networkTableKey={key} move={move} />
								) : (
									<NetworkTableValueView key={key} index={idx} childType={childType as any} networkTableKey={key} move={move} />
								)
							))}
							{/* <NetworkTableValueView
								networkTableKey="boolean"
								childType="checkbox"
							/>
							<NetworkTableValueView
								networkTableKey="string"
								childType="text"
							/>
							<NetworkTableValueView
								networkTableKey="double"
								childType="number"
							/>
							<NetworkTableValueView
								networkTableKey="This is a long key"
								childType="number"
							/>
							<NetworkTableArrayView
								networkTableKey="Selected Autonomous"
								childType="radio"
							/>
							<NetworkTableArrayView
								networkTableKey="Random Strings"
								childType="text"
							/>
							<NetworkTableArrayView
								networkTableKey="Doubles"
								childType="number"
							/> */}
						</div>
					</div>
				</div>
			</WebSockerProvider>
		</DndProvider>
	)
}