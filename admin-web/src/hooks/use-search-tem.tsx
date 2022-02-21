import { useDebouncedValue } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const useSearchTerm = (
	defaultValue?: string | undefined
): [string, React.Dispatch<React.SetStateAction<string>>] => {
	const [value, setValue] = useState(defaultValue ?? '');
	const [debounced] = useDebouncedValue(value, 200);
	const [_, setSearchParams] = useSearchParams();
	useEffect(() => setSearchParams({ search: debounced }), [debounced]);
	return [debounced, setValue];
};

export default useSearchTerm;
