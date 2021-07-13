import React, { ChangeEvent, ChangeEventHandler, ReactChild, SyntheticEvent, useCallback } from "react";
import { useArbitraryId } from "src/uuid";

interface CheckboxProps {
    checked: boolean
    label: ReactChild
    onChange(checked: boolean): void
}

export function Checkbox(props: CheckboxProps) {
    const {checked, label, onChange} = props;

    const id = useArbitraryId();
    const change: ChangeEventHandler<HTMLInputElement> = useCallback(
        e => onChange(e.target.checked),
        [onChange]
    );

    return (
        <div className="boolean-input-wrapper">
            <label htmlFor={id}>
                {label}
            </label>
            <input
                type="checkbox"
                checked={checked}
                onChange={change}
                id={id}
            />
        </div>
    );
}