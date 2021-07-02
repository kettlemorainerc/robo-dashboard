import React, { InputHTMLAttributes, useCallback } from "react";
import { NTMessValue, useNetworkTableValue } from "./NetworkTableProvider";
import { Accordion } from "./Accordion";
import { useArbitraryId } from "src/uuid";

type InputTypeToType = {text: string, number: number, radio: boolean, checkbox: boolean};
type TypeToTypeString = {string: string, double: number, boolean: boolean};
type KeyWithType<O, T> = {[K in keyof O]: O[K] extends T ? K : never}[keyof O];

type NameTypeToConverter = {[K in keyof InputTypeToType]: (a: any) => InputTypeToType[K]};
const inputTypeToValueConverter: NameTypeToConverter = {
	text: a => typeof a === "string" ? a : `${a}`,
	number: a => typeof a === "number" ? a : parseFloat(a),
	checkbox: a => typeof a === "boolean" ? a : Boolean(a),
	radio: a => typeof a === "boolean" ? a : Boolean(a),
};

const knownNetworkTableTypes = {

}

export interface NetworkTableComponentProps {
	targetNTKey: string,
	childTable?: string
	ntTable?: string,
}

export function NetworkTableList() {
	
}

function NTCheckbox() {

}

interface BooleanNTInputProps extends SharedInputProps<boolean> {
	checked: boolean
	label: React.ReactNode
	// Technically RADIO should get a value, but we're not using form data... so it'd be redundant
	type: "checkbox" | "radio"
	name: string
}

export function BooleanNTInput(props: BooleanNTInputProps) {
	const {label, onChange, id: givenId, ...nativeProps} = props;
	const id = useArbitraryId();
	const labelId = `${id}-label`
	console.log("bool nt input", props);
	return (
		<div className="nt-field">
			<label htmlFor={id} id={labelId}>{label}</label>
			<input id={id} onChange={e => onChange(e.target.checked)} {...nativeProps} />
		</div>
	)
}

interface SharedInputProps<V> extends Pick<InputHTMLAttributes<HTMLInputElement>, "name"> {
	label: React.ReactNode
	onChange(value: V): void
	id?: string
	
}

interface NTInputProps extends SharedInputProps<string> {
	value: string
	type: "text" | "number"
}

export function NTInput(props: NTInputProps) {
	const {label, onChange, type, id: givenId, ...nativeProps} = props;
	const id = useArbitraryId(givenId);
	const labelId = `${id}-label`;

	return (
		<div className="nt-field">
			<label htmlFor={id} id={labelId}>{label}</label>
			<input id={id} type={type} style={{flex: "0 0 auto"}} onChange={e => onChange(e.target.value)} {...nativeProps} />
		</div>
	)
}

function isBooleanArrayView(props: NTArrayViewProps<any>): props is NTArrayViewProps<boolean> {
	return props.childType === "checkbox" || props.childType === "radio";
}

// TODO: Figure out a way/form to define expected array sizes and a way to map an index to a label/displayName
export function BooleanArrayView(props: NTArrayViewProps<boolean> & {value: boolean[], onChange(checked: boolean[]): void}) {
	const onChange = useCallback((idx: number, update: boolean) => {
		let copy = [...props.value];
		// console.log({copy});
		if(props.childType === "radio") {
			if(update && !copy[idx]) { // if a new value is being selected. Radio sets can only have 1 active value
				// console.log("mapped to ", copy);
				props.onChange(copy.map((_, i) => i === idx));
			}
		} else if(copy[idx] !== update) {
			copy[idx] = update;
			props.onChange(copy);
		}
	}, [props.onChange, props.value]);

	console.log("Bool Arr View", props);

	return (
		<>
			{props.value.map((checked, idx) => (
				<BooleanNTInput
					type={props.childType}
					name={props.targetNTKey}
					label={idx}
					onChange={val => onChange(idx, val)}
					checked={checked}
					id={`${props.targetNTKey}-${idx}`}
					key={idx} // generally frowned upon, but it's fine since the Index is literally the ONLY identifier for this value on this side
				/>
			))}
		</>
	);
}

export function ArrayView<V extends string | number>(props: NTArrayViewProps<V> & {value: V[], onChange(val: V[]): void}) {
	const onChange = useCallback((idx: number, val: V) => {
		const copy = [...props.value];

		copy[idx] = inputTypeToValueConverter[props.childType](val) as V;

		props.onChange(copy);
	}, [props.value, props.onChange]);

	return (
		<>
			{props.value.map((val, idx) => (
				<NTInput
					label={idx}
					type={props.childType as any}
					value={val as any}
					onChange={val => onChange(idx, val as V)}
					key={idx}
				/>
			))}
		</>
	);
}


type KeysOfType<Type, Within> = {[K in keyof Within]: Within[K] extends Type ? K : never}[keyof Within]

interface NTArrayViewProps<V extends Exclude<NTMessValue, Array<any>>> extends NetworkTableComponentProps {
	childType: KeysOfType<V, InputTypeToType>
}

export function NTArrayView<V extends Exclude<NTMessValue, any[]>>(props: NTArrayViewProps<V>) {
	const {targetNTKey, childTable, ntTable, childType} = props;
	const key = childType === "radio" || childType === "checkbox" ? "boolean" : childType === "text" ? "string" : "double";
	const [value, setValue] = useNetworkTableValue<`${typeof key}[]`, any>(targetNTKey, `${key}[]`, childTable, ntTable);

	let children: React.ReactNode;
	// 0 and undefined is also falsy
	if(!value || !value.length) {
		children = null;
	} else if(isBooleanArrayView(props)) {
		children = (
			<BooleanArrayView {...props} onChange={setValue as any} value={value as any} />
		);
	} else {
		children = (
			<ArrayView {...props as any} onChange={setValue as any} value={value as any} />
		);
	}

	return (
		<Accordion label={props.targetNTKey}>
			{children}
		</Accordion>
	)
}