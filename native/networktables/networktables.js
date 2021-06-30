let ipc = require('electron').ipcRenderer;

/**
 * 
 * @param {globalThis.IP} args Various requirements needed to react to various express main thread events
 * @returns A map of eventName to eventListener
 */
function getIPCListeners(args) {
	const {keyListeners, keys, connectionListeners, globalListeners} = args;

	return {
		connected: (event, con) => {
			args.connected = con;
			connectionListeners.forEach(listener => listener(con));
		},

		add: (event, mesg) => {
			const {key, val, valType, id, flags} = mesg;
			keys[key] = {val, valType, id, flags, new: globalListeners.length === 0 && !(key in keys)};
			globalListeners.forEach(listener => listener(key, val, true));
			if(keyListeners[key]) keyListeners[key].forEach(listener => listener(key, val, true));
		},

		delete: (event, mesg) => {
			delete keys[mesg.key];
		},

		update: (event, mesg) => {
			const {[mesg.key]: val} = keys;
			val.flags = mesg.flags;
			val.val = mesg.val;

			globalListeners.forEach(listener => listener(mesg.key, val.val, val.new));
			if(keyListeners[mesg.key]) keyListeners[mesg.key].forEach(listener => listener(mesg.key, val.val, val.new));

			val.new = globalListeners.length > 0 || mesg.key in keyListeners;
		},

		flagChange: (event, mesg) => {
			keys[mesg.key].flags = mesg.flags;
		}
	}
}

/**
 * @type {globalThis.NetworkTable}
 */
var NetworkTable = (() => {
	const args = {
		connected: false,
		connectionListeners: [],
		globalListeners: [],
		keyListeners: {},
		keys: {}
	}
	const address = "127.0.0.1";
	const listenerMap = getIPCListeners(args);
	Object.entries(listenerMap).forEach(([key, func]) => ipc.on(key, func))
	ipc.send('ready');
	const {connectionListeners, globalListeners, keyListeners, keys} = args;

	return {
		addRobotConnectionListener: (listener, immediate = false) => {
			connectionListeners.push(listener);
			if(immediate) listener(args.connected);
		},
		
		removeRobotConnectionListener: (listener) => {
			if(connectionListeners.includes(listener)) {
				return connectionListeners.splice(connectionListeners.indexOf(listener), 1).length !== 0;
			}
			return false;
		},

		addGlobalListener: (listener, immediate = false) => {
			globalListeners.push(listener);
			if(immediate) Object.entries(keys).forEach(([key, value]) => listener(key, value.val, value.new));
		},
		
		removeGlobalListener: (listener) => {
			if(globalListeners.includes(listener)) {
				return globalListeners.splice(globalListeners.indexOf(listener), 1).length !== 0;
			}
			return false;
		},

		addKeyListener: (key, listener, immediate) => {
			if(!(key in keyListeners)) keyListeners[key] = [];
			keyListeners[key].push(listener);
			if(immediate && key in keys) listener(key, keys[key].val, keys[key].new);
		},
		
		removeKeyListener: (key, listener) => {
			if(key in keyListeners && keyListeners[key].includes(listener)) {
				return keyListeners[key].splice(keyListeners[key].indexOf(listener), 1).length !== 0;
			}
			return false;
		},

		containsKey: (key) => key in keys,

		getKeys: () => Object.keys(keys),

		getValue: (key, defaultValue) => {
			if(keys[key] !== undefined && keys[key].val !== undefined) return keys[key].val;
			return defaultValue;
		},

		getRobotAddress: () => (args.connected ? address : null),

		isRobotConnected: () => args.connected,
		
		putValue: (key, val) => {
			if(!(key in keys)) {
				ipc.send('add', {key, val, flags: 0})
			} else {
				let value = keys[key];
				value.val = val;
				ipc.send('update', {key, val, id: value.id, flags: value.flags});
			}

			return args.connected;
		},

		keyToId: encodeURIComponent
	};
})();
