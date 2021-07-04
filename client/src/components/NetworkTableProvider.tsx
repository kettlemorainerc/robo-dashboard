import React, {createContext, useContext, useEffect, PropsWithChildren, useState, useCallback, useRef, useMemo, useReducer} from "react";
// import WebSocket from "ws";

type WebsocketNetworkTableListener<T> = (data: T) => void;
export interface WebsocketTable<Type extends NetworkTableMessageType, Value extends NetworkTableMessageValue> {
	connectionStatus: ConnectionState
	targetRemote: string
	setTargetRemote(target: string): void

	addListener(key: string, listener: WebsocketNetworkTableListener<Value>): void
	removeListener(key: string, listener: WebsocketNetworkTableListener<Value>): void

	getValue(message: NetworkTableMessage<Type, Value>): Promise<NetworkTableMessage<Type, Value> | undefined>
	putValue(message: NetworkTableMessage<Type, Value>): void

	connectToTarget(): void
}

interface MessageBase {
	messageType: "GET" | "SET" | "DELETE" | "TOGGLE_PERSIST"
	key: string
}
export type NetworkTableMessageType = "boolean" | "string" | "double" | "boolean[]" | "string[]" | "double[]"
export type NetworkTableMessageValue = boolean | string | number | boolean[] | string[] | number[]
export type NetworkTableMessage<Type extends NetworkTableMessageType, Value extends NetworkTableMessageValue> = MessageBase & {type: Type, value: Value};


const WebSocketCtx = createContext<WebsocketTable<any, any>>({
	connectionStatus: "Not Connected",
	targetRemote: "",
	setTargetRemote() {},
	addListener() {},
	removeListener() {},
	getValue: () => undefined as any,
	putValue() {},
	connectToTarget() {},
});

export type ConnectionState = "Connected" | "Connecting" | "Not Connected"

export function WebSockerProvider({children}) {
	const connection = useRef<WebSocket>();
	const connectionStatus = useRef<ConnectionState>("Not Connected");
	const [, forceUpdate] = useReducer(i => i ^ 0b1, 0);

	const updateConnectionStatus = useCallback((status: ConnectionState) => {
		if(status !== connectionStatus.current) {
			connectionStatus.current = status;
			forceUpdate();
		}
	}, []);

	const {current: listeners} = useRef<Record<string, ((data) => void)[]>>({});

	const addListener = useCallback<WebsocketTable<any, any>["addListener"]>((key, listener) => {
		if(!listeners[key]) listeners[key] = [];
		listeners[key].push(listener);
	}, []);

	const removeListener = useCallback<WebsocketTable<any, any>["removeListener"]>((key, listener) => {
		if(listeners[key]) listeners[key] = listeners[key].filter(list => list !== listener);
	}, []);

	console.log({connectionStatus: connectionStatus.current});
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

	const connectToTarget = useCallback(() => {
		if(connection.current) connection.current.close();

		const ws = new WebSocket(`ws://${targetRemote}`);
		connection.current = ws;
		updateConnectionStatus("Connecting");
		ws.addEventListener("open", (event) => {updateConnectionStatus("Connected")});
		ws.addEventListener("close", (close) => {updateConnectionStatus("Not Connected");});
		ws.addEventListener("message", (event) => {
			const value = JSON.parse(event.data);
			console.log("message", value);
			if(listeners[value.key]) listeners[value.key].forEach(list => list(value.value));

		});
	}, [targetRemote, connection, listeners]);

	useEffect(() => {
		const to = window.setTimeout(() => {
			if(connectionStatus.current === "Not Connected") connectToTarget();
		}, 500);

		return () => window.clearTimeout(to);
	}, []);

	const ctx = useMemo<WebsocketTable<any, any>>(() => ({
		connectionStatus: connectionStatus.current,
		targetRemote,
		setTargetRemote,
		addListener,
		removeListener,
		getValue,
		putValue,
		connectToTarget
	}), [connectionStatus.current, targetRemote, setTargetRemote, addListener, removeListener, getValue, putValue, connectToTarget]);

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
export function useNetworkTable<Type extends NetworkTableMessageType, Value extends NetworkTableMessageValue>(): WebsocketTable<Type, Value> {
	return useContext(WebSocketCtx);
}

/**
 * Provides a reacty way of accessing/updating NetworkTable entries. The default functionality assumes
 * that you're using the default SmartDashboard network table, or a "child" table within the SmartDashboard network table.
 * 
 * @param key the key we want to target inside network tables/SmartDashboard
 * @param childNetworkTable If get a child table within smart dashboard, pass the name here
 * @param baseNetworkTable If you're NOT using smart dashboard's built-in NetworkTable override this with your Network Table name
 * @returns A tuple that contains 2 items, the first is the current value of the network table, the second is method that updates the network table value
 */
export function useNetworkTableValue<Type extends NetworkTableMessageType, Value extends NetworkTableMessageValue>(
	key: string,
	type: Type,
	childNetworkTable: string = "",
	baseNetworkTable = "SmartDashboard"
): [Value | undefined, (val: Value) => void] {
	type Target = Value | undefined; // Just a local type reference

	const nt = useNetworkTable<Type, Value>();
	const [value, setValue] = useState<Target>();
	// transform the key into the way Network Tables/SmartDashboard utilize "tables"
	const actualKey = `/${baseNetworkTable}/${childNetworkTable}${childNetworkTable ? "/" : ""}${key}`;

	/**
	 * This will accept the new value and send a "SET" message to the backend,
	 * but will NOT physically update {@link value}
	 * 
	 * It waits to received a "SET" message from the backend for the key
	 */
	const updateValue = useCallback((value: Value) => {
		console.log("NetworkTable Val update", actualKey, value);
		nt.putValue({key: actualKey, value, messageType: "SET", type})
	}, [nt, actualKey]);

	const networkTableListener = useCallback<WebsocketNetworkTableListener<Value>>((value) => {
		setValue(value as Value);
	}, [actualKey]);

	useEffect(() => {
		nt.getValue({key: actualKey, messageType: "GET", type, value: value!}).then(val => {
			if(val !== undefined && val !== null) setValue(val.value);
		});
		nt.addListener(actualKey, networkTableListener);
		return () => {nt.removeListener(actualKey, networkTableListener);}
	}, [actualKey, networkTableListener, nt]);

	return [value, updateValue];
}