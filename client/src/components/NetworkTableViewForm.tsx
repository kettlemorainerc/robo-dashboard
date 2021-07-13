import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Checkbox } from "src/forms/Checkbox";
import { FilteredSelect } from "src/forms/FilteredSelect";
import { NetworkTableInputTypes } from "./NetworkTableList";
import { NetworkTableMessageType, useNetworkTable } from "./NetworkTableProvider";
import {RadioGroup, RadioGroupProps} from "../forms/RadioGroup";
import {TextInput} from "../forms/TextInput";
import {FlexGrid, FlexCell} from "../layout/FlexGrid";

type SimpleViewType = "string" | "double" | "boolean";
type ViewType = SimpleViewType | `${SimpleViewType}[]`
type ChildTypesForType<Type extends ViewType> = {
    "string": Set<"text">, "string[]": Set<"text">,
    "double": Set<"number">, "double[]": Set<"number">,
    "boolean": Set<"checkbox">, "boolean[]": Set<"checkbox" | "radio">
}[Type] extends Set<infer A> ? Set<A> : never;

export type ViewDefinition = {key: string} & (
	{type: Exclude<NetworkTableMessageType, `${string}[]`>, childType: Exclude<NetworkTableInputTypes, "radio">} |
	{type: Extract<NetworkTableMessageType, `${string}[]`>, childType: NetworkTableInputTypes}
)

function useViewTypeSelectOptions<T extends ViewType>(viewType: T): ChildTypesForType<T> {
    return useMemo<ChildTypesForType<T>>(() => {
        switch(viewType) {
            case "string": case "string[]": return new Set(["text"]);
            case "double": case "double[]": return new Set(["number"]);
            case "boolean": return new Set(["checkbox"]);
            case "boolean[]": return new Set(["checkbox", "radio"]);
        }
        return new Set([]) as any;
    }, [viewType])
}

interface NetworkTableViewFormProps {
    addView(view: ViewDefinition): void
}

const typeOptions: Set<ViewDefinition["type"]> = new Set(["string", "string[]", "boolean", "boolean[]", "double", "double[]"]);

export const defaultNetworkTable = "SmartDashboard";
type SetVal<T> = T extends Set<infer A> ? A : T;

export function NetworkTableViewForm(props: NetworkTableViewFormProps) {
    const {addView} = props;
    const {knownKeys, listenerKeys} = useNetworkTable();
    const [key, setkey] = useState("");
    const [type, setType] = useState<ViewType>("string");
    const [childType, setChildType] = useState<SetVal<ChildTypesForType<ViewType>>>("text");
    const [existingKey, setExistingKey] = useState(false);
    const childTypeOptions = useViewTypeSelectOptions(type);

	useEffect(() => {
		if(!childTypeOptions.has(childType)) {
			for(let val of childTypeOptions.values()) {
				setChildType(val);
				return;
			}
		}
	}, [type]);

    const add = useCallback(() => {
        addView({key, type, childType} as ViewDefinition);
    }, [addView, key, type, childType]);

    const keyOptions = useMemo(
        () => {
            const ret = knownKeys[type]?.filter(key => !listenerKeys[type]?.includes(key))
			console.log(knownKeys[type], listenerKeys[type]);
            return (ret ?? []).map(
				key => key.startsWith(`/${defaultNetworkTable}/`) ? key.substring(defaultNetworkTable.length + 2) : key
			);
        },
        [knownKeys, listenerKeys, type]
    );

	const radioProps: Pick<RadioGroupProps<ViewDefinition["type"]>, "onChange" | "value" | "options"> = {
		onChange: setType,
		value: type,
		options: typeOptions
	}

	const inputRadioProps: Pick<RadioGroupProps<SetVal<ChildTypesForType<ViewType>>>, "onChange" | "value" | "options"> = {
		value: childType,
		onChange: setChildType,
		options: childTypeOptions
	};

    return (
        <div>
			<FlexGrid align="center">
				<FlexCell shrink>
					<Checkbox checked={existingKey} onChange={setExistingKey} label="Use Existing Key" />
				</FlexCell>
				<FlexCell shrink>
					<RadioGroup
						{...radioProps}
						label="Value Type"
						name="value-type"
					/>
				</FlexCell>
				<FlexCell shrink>
					<RadioGroup
						{...inputRadioProps}
						label="Input Type"
						name="input-type"
					/>
				</FlexCell>
				<FlexCell full />
				<FlexCell>
					{
						existingKey ? (          
							<FilteredSelect
								label="Key"
								options={keyOptions}
								value={key}
								onChange={setkey}
							/>
						) : (
							<TextInput
								label="Key"
								value={key}
								onChange={setkey}
							/>
						)
					}
				</FlexCell>
			</FlexGrid>
			<FlexGrid>
				<FlexCell />
				<FlexCell shrink>
					<button type="button" onClick={add}>
						Add View
					</button>
				</FlexCell>
			</FlexGrid>
        </div>
    )
}