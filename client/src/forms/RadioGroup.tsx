import React, { ReactChild, useCallback } from "react";

export interface RadioGroupProps<Value extends string | number> {
    value: Value
    options: Set<Value>
    onChange(value: Value): void
    name: string
    id?: string

    label: ReactChild
}

export function RadioGroup<Value extends string | number>(props: RadioGroupProps<Value>) {
    const {value, options, onChange, name, id = name, label} = props;

    const buttons = [...options].map((opt, idx) => (
        <RadioButton
            checked={opt === value}
            id={`${id}-${opt}}`}
            name={name}
            label={opt}
            onChange={onChange}
        />
    ));

    return (
        <div className="radio-group-div">
            <label>{label}</label>
            <div className="radios">
                {buttons}
            </div>
        </div>
    )
}

interface RadioProps<Value extends string | number> {
    onChange(key: Value): void
    id: string
    name: string

    checked: boolean
    label: Value
}

function RadioButton<Value extends string | number>(props: RadioProps<Value>) {
    const {checked, onChange, id, name, label} = props;

    const change = useCallback(() => {
        onChange(label)
    }, [onChange]);

    return (
        <div className="boolean-input-wrapper radio">
            <label htmlFor={id}>{label}</label>
            <input
                type="radio"
                id={id}
                name={name}
                checked={checked}
                value={label}
                onChange={change}
            />
        </div>
    );
}