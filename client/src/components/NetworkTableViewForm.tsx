import React from "react";
import { NetworkTableInputTypes } from "./NetworkTableList";
import { NetworkTableMessageType } from "./NetworkTableProvider";

export type ViewDefinition = {key: string} & (
	{type: Exclude<NetworkTableMessageType, `${string}[]`>, childType: Exclude<NetworkTableInputTypes, "radio">} |
	{type: Extract<NetworkTableMessageType, `${string}[]`>, childType: NetworkTableInputTypes}
)

interface NetworkTableViewFormProps {
    addView(view: ViewDefinition): void
}

export function NetworkTableViewForm(props: NetworkTableViewFormProps) {

}