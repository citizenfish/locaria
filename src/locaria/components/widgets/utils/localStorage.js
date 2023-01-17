import React, {useCallback} from 'react';

function useLocalStorage(storageKey, fallbackState) {

	const [value, setValue] = React.useState(
		JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState
	);

	const updatedSetValue = useCallback(
		newValue => {
			localStorage.setItem(storageKey, JSON.stringify(newValue));
			setValue(newValue);
		},
		[fallbackState, storageKey]
	);

/*
	React.useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(value));
	}, [value, storageKey]);
*/

	return [value, updatedSetValue];
}

export default useLocalStorage;