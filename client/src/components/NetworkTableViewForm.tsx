import React, { useCallback, useMemo, useState } from "react";
import { Checkbox } from "src/forms/Checkbox";
import { FilteredSelect } from "src/forms/FilteredSelect";
import { NetworkTableInputTypes } from "./NetworkTableList";
import { NetworkTableMessageType, useNetworkTable } from "./NetworkTableProvider";

type SimpleViewType = "string" | "double" | "boolean";
type ViewType = SimpleViewType | `${SimpleViewType}[]`
type ChildTypesForType<Type extends ViewType> = {
    "string": ["text"], "string[]": ["text"],
    "double": ["number"], "double[]": ["number"],
    "boolean": ["checkbox"], "boolean[]": ["checkbox", "radio"]
}[Type];

export type ViewDefinition = {key: string} & (
	{type: Exclude<NetworkTableMessageType, `${string}[]`>, childType: Exclude<NetworkTableInputTypes, "radio">} |
	{type: Extract<NetworkTableMessageType, `${string}[]`>, childType: NetworkTableInputTypes}
)

function useViewTypeSelectOptions<T extends ViewType>(viewType: T): ChildTypesForType<T> {
    return useMemo<ChildTypesForType<T>>(() => {
        switch(viewType) {
            case "string": case "string[]": return ["text"];
            case "double": case "double[]": return ["number"];
            case "boolean": return ["checkbox"];
            case "boolean[]": return ["checkbox", "radio"];
        }
        return [] as any
    }, [viewType])
}

interface NetworkTableViewFormProps {
    addView(view: ViewDefinition): void
}

const typeOptions: ViewDefinition["type"][] = ["string", "string[]", "boolean", "boolean[]", "double", "double[]"];

export function NetworkTableViewForm(props: NetworkTableViewFormProps) {
    const {addView} = props;
    const {knownKeys, listenerKeys} = useNetworkTable();
    const [key, setkey] = useState("");
    const [type, setType] = useState<ViewDefinition["type"]>("string");
    const [childType, setChildType] = useState<ChildTypesForType<any>[number]>("text");
    const [existingKey, setExistingKey] = useState(false);
    const childTypeOptions = useViewTypeSelectOptions(type);

    const add = useCallback(() => {
        addView({key, type, childType});
    }, [addView]);

    const keyOptions = useMemo(
        () => {
            const ret = knownKeys[type]?.filter(key => listenerKeys[type]?.includes(key))
            return ret ?? [];
        },
        [knownKeys, listenerKeys]
    );

    return (
        <div>
            <Checkbox checked={existingKey} onChange={setExistingKey} label="Use Existing Key" />
            <br />
            {
                existingKey ? (          
                    <FilteredSelect
                        options={keyOptions}
                        value={key}
                        onChange={setkey}
                    />
                ) : (
                    null
                )
            }
        </div>
    )
}