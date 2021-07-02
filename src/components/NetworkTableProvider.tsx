import React, { createContext, useContext, useEffect, PropsWithChildren, useState, useCallback, useRef, useMemo } from "react";
// import WebSocket from "ws";

type WebsocketNTListener<T> = (data: T) => void;
export interface WebsocketTable<Type extends NTMessType, Value extends NTMessValue> {
	isConnected: () => boolean
	targetRemote: string
	setTargetRemote(target: string): void

	addListener(key: string, listener: WebsocketNTListener<Value>): void
	removeListener(key: string, listener: WebsocketNTListener<Value>): void

	getValue(message: NetworkTableMessage<Type, Value>): Promise<NetworkTableMessage<Type, Value> | undefined>
	putValue(message: NetworkTableMessage<Type, Value>): void
}

interface MessageBase {
	messageType: "GET" | "SET" | "DELETE" | "TOGGLE_PERSIST"
	key: string
}
export type NTMessType = "boolean" | "string" | "double" | "boolean[]" | "string[]" | "double[]"
export type NTMessValue = boolean | string | number | boolean[] | string[] | number[]
export type NetworkTableMessage<Type extends NTMessType, Value extends NTMessValue> = MessageBase & {type: Type, value: Value};


const WebSocketCtx = createContext<WebsocketTable<any, any>>({
	isConnected: () => false,
	targetRemote: "",
	setTargetRemote() {},
	addListener() {},
	removeListener() {},
	getValue: () => undefined as any,
	putValue() {}
});

export function WebSockerProvider({children}) {
	const connection = useRef<WebSocket>();
	const [connected, setConnected] = useState(false);
	const {current: listeners} = useRef<Record<string, ((data) => void)[]>>({});

	const addListener = useCallback<WebsocketTable<any, any>["addListener"]>((key, listener) => {
		if(!listeners[key]) listeners[key] = [];
		listeners[key].push(listener);
	}, []);

	const removeListener = useCallback<WebsocketTable<any, any>["removeListener"]>((key, listener) => {
		if(listeners[key]) listeners[key] = listeners[key].filter(list => list !== listener);
	}, []);

	const isConnected = useCallback<WebsocketTable<any, any>["isConnected"]>(() => connected, [connected]);
	console.log({connected, conn: isConnected()});
	const [targetRemote, setTargetRemote] = useState("localhost:8080");

	const getValue = useCallback<WebsocketTable<any, any>["getValue"]>(
		message => {
			return new Promise(resolve => {
				let resolved = false;
				setTimeout(() => {
					resolved = true;
					resolve(undefined)
				}, 2000);

				const listener = mess => {
					removeListener(message.key, listener);
					if(!resolved) resolve(mess);
				}
				addListener(message.key, listener);
				const newTimeout = () => setTimeout(() => {
					console.log("TO")
					if(resolved) return;
					if(!connection.current) newTimeout()
					else if(connection.current.readyState === WebSocket.OPEN) connection.current.send(JSON.stringify(message));
				}, 100);
				newTimeout();
			});
		},
		[]
	);

	const putValue = useCallback<WebsocketTable<any, any>["putValue"]>((message) => {
		connection.current!.send(JSON.stringify(message));
	}, []);

	useEffect(() => {
		if(connection.current) connection.current.close();

		const ws = new WebSocket(`ws://${targetRemote}`);
		connection.current = ws;
		ws.addEventListener("open", (event) => {
			console.log("opened connection");
			setConnected(true);
		});
		ws.addEventListener("close", (close) => {
			console.log("closed connection");
			setConnected(false);
		});
		ws.addEventListener("message", (event) => {
			const value = JSON.parse(event.data);
			console.log("message", value);
			if(listeners[value.key]) listeners[value.key].forEach(list => list(value.value));

		});
	}, [targetRemote, setConnected]);

	useEffect(() => {
		if(connected) {

		} else {

		}
	}, [connected]);

	const ctx = useMemo(() => ({
		isConnected,
		targetRemote,
		setTargetRemote,
		addListener,
		removeListener,
		getValue,
		putValue
	}), [isConnected, targetRemote, setTargetRemote, addListener, removeListener, getValue, putValue]);

	return (
		<WebSocketCtx.Provider value={ctx}>
			{children}
		</WebSocketCtx.Provider>
	)
}

/**
 * Use this as a way to access the application's NetworkTables directly. Generall you'll probably just want to use {@link useNetworkTableValue}
 * @returns The application's NetworkTable instance
 */
export function useNetworkTable<Type extends NTMessType, Value extends NTMessValue>(): WebsocketTable<Type, Value> {
	return useContext(WebSocketCtx);
}

/**
 * Provides a reacty way of accessing/updating NetworkTable entries. The default functionality assumes
 * that you're using the default SmartDashboard network table, or a "child" table within the SmartDashboard network table.
 * 
 * @param key the key we want to target inside network tables/SmartDashboard
 * @param childNetworkTable If get a child table within smart dashboard, pass the name here
 * @param baseNetworkTable If you're NOT using smart dashboard's built-in NT override this with your Network Table name
 * @returns A tuple that contains 2 items, the first is the current value of the network table, the second is method that updates the network table value
 */
export function useNetworkTableValue<Type extends NTMessType, Value extends NTMessValue>(
	key: string,
	type: Type,
	childNetworkTable: string = "",
	baseNetworkTable = "SmartDashboard"
): [Value | null, (val: Value) => void] {
	type Target = Value | null; // Just a local type reference

	const nt = useNetworkTable<Type, Value>();
	const [value, setValue] = useState<Target>(null);
	// transform the key into the way Network Tables/SmartDashboard utilize "tables"
	const actualKey = `/${baseNetworkTable}/${childNetworkTable}${childNetworkTable ? "/" : ""}${key}`;

	const updateValue = useCallback((value: Value) => {
		console.log("NT Val update", actualKey, value);
		nt.putValue({key: actualKey, value, messageType: "SET", type})
	}, [nt, actualKey]);

	const networkTableListener = useCallback<WebsocketNTListener<Value>>((value) => {
		console.log("new network table value", actualKey, value);
		setValue(value as Value);
	}, []);

	useEffect(() => {
		nt.getValue({key: actualKey, messageType: "GET", type, value: value!}).then(val => {
			if(val !== undefined && val !== null) setValue(val.value);
		});
		nt.addListener(actualKey, networkTableListener);
		console.log("added key listener", actualKey);
		return () => {nt.removeListener(actualKey, networkTableListener);}
	}, [actualKey, nt]);

	return [value, updateValue];
}