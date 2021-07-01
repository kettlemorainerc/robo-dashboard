import { useEffect, useMemo, useState } from "react";

export function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

export function useArbitraryId(id?: string) { 
	const randomId = useMemo(() => `id-${uuidv4()}`, []);

	const [actualId, setActualId] = useState(id || randomId);

	useEffect(() => {
		setActualId(id || randomId);
	}, [id]);

	return actualId;
}