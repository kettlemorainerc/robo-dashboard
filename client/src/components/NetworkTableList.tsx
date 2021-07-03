import React, {InputHTMLAttributes, useCallback, useMemo, useRef} from "react";
import {NTMessValue, useNetworkTableValue} from "./NetworkTableProvider";
import {Accordion} from "./Accordion";
import {useArbitraryId} from "src/uuid";
import {useState} from "react";
import {useEffect} from "react";
import {LoadingIcon} from "./LoadingIcon";
import {useDrag, useDrop, DropTargetMonitor} from "react-dnd";
import {XYCoord} from "dnd-core";

type InputTypeToType = {text: string, number: number, radio: boolean, checkbox: boolean};

export type NTInputTypes = keyof InputTypeToType;

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

interface BooleanNTInputProps extends SharedInputProps<boolean> {
	checked?: boolean
	label: React.ReactNode
	// Technically RADIO should get a value, but we're not using form data... so it'd be redundant
	type: "checkbox" | "radio"
	name: string
}

function BooleanNTInput(props: BooleanNTInputProps) {
	const {label, onChange, id: givenId, checked = false, type, ...nativeProps} = props;
	const id = useArbitraryId();
	const labelId = `${id}-label`;

	const [localChecked, setLocalChecked] = useState(checked);

	useEffect(() => {setLocalChecked(checked)}, [checked]); // set the localValue to value every time value is updated

	useEffect(() => {
		let id: number;
		let clear = () => window.clearTimeout(id);
		id = window.setTimeout(() => {
			if(localChecked !== checked) onChange(localChecked); // only post change if we're different than expected
			clear = () => {}; // don't bother clearing timeout if localValue updates after the timeout is called
		}, 250); // wait ~.25s until updating NT value (save network traffic)

		// wrap clear in another method here to capture the variable rather than the current variable's value
		// if clear is updated by the timeout the updated reference wouldn't be picked up if we
		// did `return clear;`
		return () => {
			clear();
		}
	}, [localChecked]);

	const localLabel = checked !== localChecked ? (
		<>
			{label} - <LoadingIcon width="2ex" height="2ex" style={{display:"inline-block"}} />
		</>
	) : label;

	return (
		<div className={"nt-field " + type}>
			<label htmlFor={id} id={labelId}>{localLabel}</label>
			<input id={id} onChange={e => setLocalChecked(e.target.checked)} type={type} checked={localChecked} {...nativeProps} />
		</div>
	)
}

interface SharedInputProps<V> extends Pick<InputHTMLAttributes<HTMLInputElement>, "name"> {
	label: React.ReactNode
	onChange(value: V): void
	id?: string
	
}

interface NTInputProps extends SharedInputProps<string> {
	value?: string
	type: "text" | "number"
}

function NTInput(props: NTInputProps) {
	// the value = "" is setting value to "" if and ONLY IF value is undefined
	const {label, onChange, type, id: givenId, value = "", ...nativeProps} = props;
	const id = useArbitraryId(givenId);
	const labelId = `${id}-label`;

	const [localValue, setLocalValue] = useState(value);

	useEffect(() => {setLocalValue(value)}, [value]); // set the localValue to value every time value is updated

	useEffect(() => {
		let id: number;
		let clear = () => window.clearTimeout(id);
		id = window.setTimeout(() => {
			if(localValue !== value) onChange(localValue); // only post change if we're different than expected
			clear = () => {}; // don't bother clearing timeout if localValue updates after the timeout is called
		}, 250); // wait ~.25s until updating NT value (save network traffic)

		// wrap clear in another method here to capture the variable rather than the current variable's value
		// if clear is updated by the timeout the updated reference wouldn't be picked up if we
		// did `return clear;`
		return () => {
			clear();
		}
	}, [localValue]);

	const localLabel = value !== localValue ? (
		<>
			{label} <LoadingIcon width="1em" height="auto" style={{display:"inline-block"}} />
		</>
	) : label;

	return (
		<div className={"nt-field " + type}>
			<label htmlFor={id} id={labelId}>{localLabel}</label>
			<input id={id} type={type} onChange={e => setLocalValue(e.target.value)} value={localValue} {...nativeProps} />
		</div>
	)
}

function isBooleanArrayView(props: NTArrayViewProps<any>): props is NTArrayViewProps<boolean> {
	return props.childType === "checkbox" || props.childType === "radio";
}

// TODO: Figure out a way/form to define expected array sizes and a way to map an index to a label/displayName
function BooleanArrayView(props: NTArrayViewProps<boolean> & {value: boolean[], onChange(checked: boolean[]): void}) {
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

function ArrayView<V extends string | number>(props: NTArrayViewProps<V> & {value: V[], onChange(val: V[]): void}) {
	const onChange = useCallback((idx: number, val: V) => {
		const copy = [...props.value];

		copy[idx] = inputTypeToValueConverter[props.childType](val) as V;

		props.onChange(copy);
	}, [props.value, props.onChange]);

	return (
		<>
			{props.value.map((val, idx) => (
				<NTInput
					label={idx === 0 ? "This is a long label" : idx}
					type={props.childType as any}
					value={val as any}
					onChange={val => onChange(idx, val as V)}
					key={idx}
				/>
			))}
		</>
	);
}

interface DraggableProps {
	move(from: number, to: number): void,
	index: number

}

interface DragItem {
  index: number
  id: string
  type: string
}

function useDraggable({move, index}: DraggableProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [{handlerId}, drop] = useDrop({
		accept: "nt-value",
		collect(monitor) {return {handlerId: monitor.getHandlerId()};},
		hover(item: DragItem, monitor) {
			if(!ref.current) return;
			const dragIndex = item.index;
			const hoverIndex = index;

			if(dragIndex === hoverIndex) return;

			const hoveringRect = ref.current.getBoundingClientRect();
			const middleY = (hoveringRect.bottom - hoveringRect.top) / 2;
			const offset = monitor.getClientOffset();
			const hoverY = offset!.y - hoveringRect.top;

			if(
				(dragIndex < hoverIndex && hoverY < middleY) ||
				(dragIndex > hoverIndex && hoverY > middleY)
			) {
				return;
			}

			move(dragIndex, hoverIndex);
			item.index = hoverIndex;
		}
	});

	const [{isDragging}, drag] = useDrag({
		type: "nt-value",
		item: () => ({index}),
		collect: (monitor) => ({isDragging: monitor.isDragging()})
	});

	drag(drop(ref));

	return useMemo(() => ({ref, handlerId, isDragging}), [ref, handlerId, isDragging]);
}

type KeysOfType<Type, Within> = {[K in keyof Within]: Within[K] extends Type ? K : never}[keyof Within]

interface NTArrayViewProps<V extends Exclude<NTMessValue, Array<any>>> extends NetworkTableComponentProps, DraggableProps {
	childType: KeysOfType<V, InputTypeToType> // radios should only ever be used with array types
}

export function NTArrayView<V extends Exclude<NTMessValue, any[]>>(props: NTArrayViewProps<V>) {
	const {targetNTKey, childTable, ntTable, childType} = props;
	const key = childType === "radio" || childType === "checkbox" ? "boolean" : childType === "text" ? "string" : "double";
	const [value, setValue] = useNetworkTableValue<`${typeof key}[]`, any[]>(targetNTKey, `${key}[]`, childTable, ntTable);
	const {ref} = useDraggable(props);

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

	const addValue: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		const newValue = key === "boolean" ? false : key === "double" ? 0 : "";
		const updatedValue = value ? [...value, newValue] : [newValue];
		setValue(updatedValue);
		e.stopPropagation();
	}

	const removeValue: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		setValue(value ? value.filter((_, i) => i !== value.length - 1) : []);
		e.stopPropagation();
	}

	const label = (
		<>
			{props.targetNTKey} —&nbsp;
			<button type="button" onClick={addValue}>+</button>
			<button type="button" onClick={removeValue}>-</button>
		</>
	);


	return (
		<Accordion label={label} ref={ref}>
			{children}
		</Accordion>
	)
}

interface NTViewProps<V extends Exclude<NTMessValue, Array<any>>> extends NetworkTableComponentProps, DraggableProps {
	childType: Exclude<KeysOfType<V, InputTypeToType>, "radio">
}

export function NTView<V extends Exclude<NTMessValue, Array<any>>>(props: NTViewProps<V>) {
	const {childType, targetNTKey, childTable, ntTable} = props;
	const key = childType === "checkbox" ? "boolean" : childType === "text" ? "string" : "double";
	const [value, setValue] = useNetworkTableValue<`${typeof key}`, V>(targetNTKey, key, childTable, ntTable);
	const {ref} = useDraggable(props);

	let children: React.ReactNode;
	if(childType === "checkbox" || childType === "radio") {
		children = <BooleanNTInput label={targetNTKey} name={targetNTKey} type={childType} checked={value as any} onChange={setValue as any} />
	} else {
		children = <NTInput label={targetNTKey} onChange={setValue as any} value={value as any} type={childType as any} />
	}

	return (
		<div ref={ref}>
			{children}
		</div>
	);
}