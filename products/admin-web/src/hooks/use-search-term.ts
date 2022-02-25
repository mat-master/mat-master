import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const useSearchTerm = (
	queryKey: string = 'search'
): [string, React.Dispatch<React.SetStateAction<string>>] => {
	const [queryParams, setQueryParams] = useSearchParams();
	const [value, setValue] = useState(queryParams.get(queryKey) ?? '');

	useEffect(() => {
		value ? queryParams.set(queryKey, value) : queryParams.delete(queryKey);
		setQueryParams(queryParams);
	}, [value]);

	return [value, setValue];
};

export default useSearchTerm;
