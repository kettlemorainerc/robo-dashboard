import React, {forwardRef, InputHTMLAttributes, useCallback, useMemo, useRef} from "react";
import {NetworkTableMessageValue, useNetworkTableValue} from "./NetworkTableProvider";
import {Accordion} from "../layout/Accordion";
import {useArbitraryId} from "src/uuid";
import {useState} from "react";
import {useEffect} from "react";
import {LoadingIcon} from "./LoadingIcon";
import {useDrag, useDrop} from "react-dnd";
import { Modal } from "src/layout/Modal";
import { NetworkTableViewForm, ViewDefinition } from "./NetworkTableViewForm";

type InputTypeToType = {text: string, number: number, radio: boolean, checkbox: boolean};

export type NetworkTableInputTypes = keyof InputTypeToType;

type NameTypeToConverter = {[K in keyof InputTypeToType]: (a: any) => InputTypeToType[K]};
const inputTypeToValueConverter: NameTypeToConverter = {
	text: a => typeof a === "string" ? a : `${a}`,
	number: a => typeof a === "number" ? a : parseFloat(a),
	checkbox: a => typeof a === "boolean" ? a : Boolean(a),
	radio: a => typeof a === "boolean" ? a : Boolean(a),
};

export interface NetworkTableComponentProps {
	networkTableKey: string,
	childTable?: string
	ntTable?: string,
}

type ToggleTrue = () => void;
type ToggleFalse = () => void;
export function useFlag(def = false): [boolean, React.Dispatch<React.SetStateAction<boolean>>, ToggleTrue, ToggleFalse] {
	const [bool, setBool] = useState(def);

	const setTrue = useCallback(() => setBool(true), []);
	const setFalse = useCallback(() => setBool(false), []);

	return [bool, setBool, setTrue, setFalse];
}

export function NetworkTableList() {
	const [createView, setCreateView, showCreateView, hideCreateView] = useFlag();
	const [views, setViews] = useState<ViewDefinition[]>([
		{key: "boolean", type: "boolean", childType: "checkbox"},
		{key: "string", type: "string", childType: "text"},
		{key: "double", type: "double", childType: "number"},
		{key: "This is a long key", type: "double", childType: "number"},
		{key: "Selected Autonomous", type: "double[]", childType: "radio"},
		{key: "Random Strings", type: "string[]", childType: "text"},
		{key: "Doubles", type: "double[]", childType: "number"},
	]);

	const move = useCallback((from: number, to: number) => {
		setViews(keys => {
			const early = from > to ? to : from; // get the smaller index
			const late = early === from ? to : from; // larger index

			const a = keys[early];
			const b = keys[late];

			const before = keys.slice(0, early);
			const between = keys.slice(early + 1, late);
			const after = keys.slice(late + 1);

			return [...before, b, ...between, a, ...after];
		});
	}, [setViews]);

	const addNewView = useCallback((view: ViewDefinition) => {
		setViews(keys => ([...keys, view]));
	}, []);

	const removeView = useCallback((idx: number) => {
		setViews(keys => keys.filter((_, i) => i !== idx));
	}, []);

	return (
		<>
			<h3>
				Raw NetworkTable Values 
				<button type="button" onClick={showCreateView}>+</button>
			</h3>
			<Modal title="Add Listener" show={createView} onClose={hideCreateView}>
				<NetworkTableViewForm addView={addNewView} />
			</Modal>
			<div className="nt-values">
				{(
					views.map(({key, childType, type}, idx) => (
						type.endsWith("[]") ? (
							<NetworkTableArrayView key={key} index={idx} childType={childType} networkTableKey={key} move={move} />
						) : (
							<NetworkTableValueView key={key} index={idx} childType={childType as any} networkTableKey={key} move={move} />
						)
					))
				)}
			</div>
		</>
	)
}

interface BooleanNetworkTableInputProps extends SharedInputProps<boolean> {
	checked?: boolean
	label: React.ReactNode
	// Technically RADIO should get a value, but we're not using form data... so it'd be redundant
	type: "checkbox" | "radio"
	name: string
}

const BooleanNetworkTableInput = forwardRef(function BooleanNetworkTableInput(props: BooleanNetworkTableInputProps, ref: React.Ref<HTMLDivElement>) {
	const {label, onChange, id: givenId, checked = false, type, ...nativeProps} = props;
	const id = useArbitraryId();
	const labelId = `${id}-label`;

	const [localChecked = false, setLocalChecked] = useState(checked);

	useEffect(() => {setLocalChecked(checked)}, [checked]); // set the localValue to value every time value is updated

	useEffect(() => {
		let id: number;
		let clear = () => window.clearTimeout(id);
		id = window.setTimeout(() => {
			if(localChecked !== checked) onChange(localChecked); // only post change if we're different than expected
			clear = () => {}; // don't bother clearing timeout if localValue updates after the timeout is called
		}, 250); // wait ~.25s until updating NetworkTable value (save network traffic)

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
		<div className={"nt-field " + type} ref={ref}>
			<label htmlFor={id} id={labelId}>{localLabel}</label>
			<input id={id} onChange={e => setLocalChecked(e.target.checked)} type={type} checked={localChecked} {...nativeProps} />
		</div>
	)
});

interface SharedInputProps<V> extends Pick<InputHTMLAttributes<HTMLInputElement>, "name"> {
	label: React.ReactNode
	onChange(value: V): void
	id?: string
	
}

interface NetworkTableInputProps extends SharedInputProps<string> {
	value?: string
	type: "text" | "number"
}

const NetworkTableInput = forwardRef(function NetworkTableInput(props: NetworkTableInputProps, ref: React.Ref<HTMLDivElement>) {
	// the value = "" is setting value to "" if and ONLY IF value is undefined
	const {label, onChange, type, id: givenId, value, ...nativeProps} = props;
	const id = useArbitraryId(givenId);
	const labelId = `${id}-label`;

	const [localValue, setLocalValue] = useState(value);

	useEffect(() => {setLocalValue(value)}, [value]); // set the localValue to value every time value is updated

	useEffect(() => {
		let id: number;
		let clear = () => window.clearTimeout(id);
		id = window.setTimeout(() => {
			if(typeof localValue === "string" && localValue !== value) onChange(localValue); // only post change if we're different than expected
			clear = () => {}; // don't bother clearing timeout if localValue updates after the timeout is called
		}, 250); // wait ~.25s until updating NetworkTable value (save network traffic)

		// wrap clear in another method here to capture the variable rather than the current variable's value
		// if clear is updated by the timeout the updated reference wouldn't be picked up if we
		// did `return clear;`
		return () => {
			clear();
		}
	}, [localValue]);

	const localLabel = value !== localValue ? (
		<>
			{label} <LoadingIcon width="1em" height={undefined} style={{display:"inline-block", height: "auto"}} />
		</>
	) : label;

	return (
		<div className={"nt-field " + type} ref={ref}>
			<label htmlFor={id} id={labelId}>{localLabel}</label>
			<input id={id} type={type} onChange={e => setLocalValue(e.target.value)} value={localValue ?? ""} {...nativeProps} />
		</div>
	)
});

function isBooleanArrayView(props: NetworkTableArrayViewProps<any>): props is NetworkTableArrayViewProps<boolean> {
	return props.childType === "checkbox" || props.childType === "radio";
}

// TODO: Figure out a way/form to define expected array sizes and a way to map an index to a label/displayName
function BooleanArrayView(props: NetworkTableArrayViewProps<boolean> & {value: boolean[], onChange(checked: boolean[]): void}) {
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
				<BooleanNetworkTableInput
					type={props.childType}
					name={props.networkTableKey}
					label={idx}
					onChange={val => onChange(idx, val)}
					checked={checked}
					id={`${props.networkTableKey}-${idx}`}
					key={idx} // generally frowned upon, but it's fine since the Index is literally the ONLY identifier for this value on this side
				/>
			))}
		</>
	);
}

function ArrayView<V extends string | number>(props: NetworkTableArrayViewProps<V> & {value: V[], onChange(val: V[]): void}) {
	const onChange = useCallback((idx: number, val: V) => {
		const copy = [...props.value];

		copy[idx] = inputTypeToValueConverter[props.childType](val) as V;

		props.onChange(copy);
	}, [props.value, props.onChange]);

	return (
		<>
			{props.value.map((val, idx) => (
				<NetworkTableInput
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

interface NetworkTableArrayViewProps<V extends Exclude<NetworkTableMessageValue, Array<any>>> extends NetworkTableComponentProps, DraggableProps {
	childType: KeysOfType<V, InputTypeToType> // radios should only ever be used with array types
}

export function NetworkTableArrayView<V extends Exclude<NetworkTableMessageValue, any[]>>(props: NetworkTableArrayViewProps<V>) {
	const {networkTableKey, childTable, ntTable, childType} = props;
	const key = childType === "radio" || childType === "checkbox" ? "boolean" : childType === "text" ? "string" : "double";
	const [value, setValue] = useNetworkTableValue<`${typeof key}[]`, any[]>(networkTableKey, `${key}[]`, childTable, ntTable);
	const {ref} = useDraggable(props);

	let children: React.ReactNode;
	// 0 and undefined is also falsy
	if(!value || !value.length) {
		children = null;
	} else if(isBooleanArrayView(props)) {
		children = (
			<BooleanArrayView {...props} onChange={setValue} value={value} />
		);
	} else {
		children = (
			<ArrayView {...props} onChange={setValue} value={value} />
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
			{props.networkTableKey} —&nbsp;
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

interface NetworkTableValueViewProps<V extends Exclude<NetworkTableMessageValue, Array<any>>> extends NetworkTableComponentProps, DraggableProps {
	childType: Exclude<KeysOfType<V, InputTypeToType>, "radio">
}

export function NetworkTableValueView<V extends Exclude<NetworkTableMessageValue, Array<any>>>(props: NetworkTableValueViewProps<V>) {
	const {childType, networkTableKey, childTable, ntTable} = props;
	const key = childType === "checkbox" ? "boolean" : childType === "text" ? "string" : "double";
	const [value, setValue] = useNetworkTableValue<`${typeof key}`, V>(networkTableKey, key, childTable, ntTable);
	const {ref} = useDraggable(props);

	let children: React.ReactNode;
	if(childType === "checkbox") {
		return <BooleanNetworkTableInput ref={ref} label={networkTableKey} name={networkTableKey} type={childType} checked={value as boolean} onChange={setValue as any} />
	} else {
		return <NetworkTableInput ref={ref} label={networkTableKey} onChange={setValue as any} value={value as any} type={childType as any} />
	}
}