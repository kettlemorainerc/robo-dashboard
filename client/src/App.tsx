import React, {useCallback, useState} from "react";
import {NetworkTableMessageType, WebSockerProvider} from "./components/NetworkTableProvider";
import {NetworkTableInputTypes, NetworkTableList} from "./components/NetworkTableList";
import {ConnectionListener} from "./components/ConnectionListener";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {Modal} from "./layout/Modal";
import { ColumnedCell, ColumnedGrid } from "./layout/ColumnedGrid";
import {NetworkTableTimeSeries} from "./reports/NetworkTableGridChart";
import { FlexCell } from "./layout/FlexGrid";

type ChildType = {key: string} & (
	{type: Exclude<NetworkTableMessageType, `${string}[]`>, childType: Exclude<NetworkTableInputTypes, "radio">} |
	{type: Extract<NetworkTableMessageType, `${string}[]`>, childType: NetworkTableInputTypes}
)

export function App() {
	const [theme, setTheme] = useState("light");

	return (
		<DndProvider backend={HTML5Backend}>
			<WebSockerProvider>
				<div id="wrapper" className={theme}>
					<div className="body">
						<ColumnedGrid columns={4}>
							<FlexCell full>
								<NetworkTableTimeSeries
									networkTableKey="double"
								/>
							</FlexCell>
						</ColumnedGrid>
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
						<NetworkTableList />
					</div>
				</div>
			</WebSockerProvider>
		</DndProvider>
	)
}