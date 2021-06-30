import React, { createContext, useContext, useEffect, PropsWithChildren } from "react";


const NTCtx = createContext<NetworkTable>({} as any);

/**
 * Use this as a way to access the application's NetworkTables directly
 * @returns The application's NetworkTable instance
 */
export function useNetworkTable() {
	return useContext(NTCtx);
}

export function useNetworkTableListener(key: string, listener: NetworkTableListener) {
	const nt = useNetworkTable();

	useEffect(() => {

	}, [])
}

export function NetworkTableProvider({children}: PropsWithChildren<{}>) {

	if(!NetworkTable) return null;

	return (
		<NTCtx.Provider value={NetworkTable}>
			{children}
		</NTCtx.Provider>
	)
}