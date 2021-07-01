
type Listener<args extends any[]> = (...args: args) => void;
type ConnectionListener = Listener<[boolean]>;
type NetworkTableListener = Listener<[string, any, boolean]>;

namespace globalThis {
	interface NetworkTable {
		/**
		 * @param listener A function to run whenever we (dis)connect to the bot
		 * @param immediate Should this immediately be invoked with the current status
		 */
		addRobotConnectionListener(listener: (connected: boolean) => void, immediate?: boolean): void
		removeRobotConnectionListener(listener: (connected: boolean) => void): boolean;
		/**
		 * @param listener A listener for ANY network table key updates
		 * @param immediate Should this be invoked immediately for every known key
		 */
		addGlobalListener(listener: NetworkTableListener, immediate?: boolean): void
		removeGlobalListener(listener: NetworkTableListener): boolean
		/**
		 * 
		 * @param key a network table key
		 * @param callback a function that processes a key/result/isnew evertime a key is updated externally
		 * @param immediate should the callback be invoked IMMEDIATELY with the current status of the {@link key}
		 */
		addKeyListener(key: string, callback: NetworkTableListener, immediate?: boolean): void
		removeKeyListener(key: string, callback: NetworkTableListener): boolean
		/**
		 * Is this a known network table key
		 * @param key a network table key
		 */
		containsKey(key: string): boolean
		/**
		 * Get known network table keys
		 */
		getKeys(): string[]
		/**
		 * 
		 * @param key a network table key
		 * @param defaultValue if the given {@link key} isn't present return this value
		 */
		getValue<T>(key: string, defaultValue: T): T
		getRobotAddress(): string | null
		isRobotConnected(): boolean
		/**
		 * Attempts to set the value in NetworkTables
		 * @param key a network table key
		 * @param value the value to put
		 * @returns false if there's no connection to the target network tables
		 */
		putValue(key: string, value: any): boolean
		/**
		 * Transforms a netowkr table key into a valid HTML identifier
		 * @param str a network table key
		 */
		keyToId(key: string): string
	}
	var NetworkTable: NetworkTable;
}