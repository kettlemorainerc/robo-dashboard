import React, { ChangeEventHandler, ReactChild, useCallback } from "react";
import { useArbitraryId } from "src/uuid";

interface TextInput {
	value: string
	onChange(value: string): void
	label: ReactChild
}

export function TextInput(props: TextInput) {
	const {label, onChange, value} = props;
	const id = useArbitraryId();

	const change: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
		onChange(e.target.value);
	}, [onChange])

	return (
		<div className="input-wrapper">
			<label htmlFor={id}>
				{label}
			</label>
			<input
				onChange={change}
				value={value}
				type="text"
				id={id}
			/>
		</div>
	)
}