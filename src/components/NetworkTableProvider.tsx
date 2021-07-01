import React, { createContext, useContext, useEffect, PropsWithChildren, useState, useCallback } from "react";


const NTCtx = createContext<NetworkTable>({} as any);

/**
 * Use this as a way to access the application's NetworkTables directly. Generall you'll probably just want to use {@link useNetworkTableValue}
 * @returns The application's NetworkTable instance
 */
export function useNetworkTable() {
	return useContext(NTCtx);
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
export function useNetworkTableValue<T>(key: string, converter: (a: any) => T, childNetworkTable: string = "", baseNetworkTable = "SmartDashboard"): [T | null, (val: T) => void] {
	const nt = useNetworkTable(); // this just gives us the Global NetworkTable variable, try to avoid globals as much as you can
	type Target = T | null; // Just a local type reference
	// transform the key into the way Network Tables/SmartDashboard utilize "tables"
	const actualKey = `/${baseNetworkTable}/${childNetworkTable}${childNetworkTable ? "/" : ""}${key}`;

	const updateValue = useCallback((update: T) => {
		console.log("NT Val update", actualKey, update);
		if("map" in update) nt.putValue(actualKey, (update as any).map(val => `${val}`));
		else nt.putValue(actualKey, update);
	}, [nt, actualKey]);

	const networkTableListener = useCallback<NetworkTableListener>((key, value) => {
		console.log("new network table value", key, value);
		setValue(value as T);
	}, []);

	useEffect(() => {
		const val = nt.getValue<Target>(actualKey, null);
		setValue(val === null ? null : converter(val));
		nt.addKeyListener(actualKey, networkTableListener);
		console.log("added key listener", actualKey);
		return () => {nt.removeKeyListener(actualKey, networkTableListener);}
	}, [actualKey, nt]);

	const [value, setValue] = useState<Target>(() => {
		const val = nt.getValue<Target>(actualKey, null)
		if(val === null) return val;
		return converter(val);
	});

	return [value, updateValue];
}

export function NetworkTableProvider({children}: PropsWithChildren<{}>) {

	if(!NetworkTable) return null;

	return (
		<NTCtx.Provider value={NetworkTable}>
			{children}
		</NTCtx.Provider>
	)
}