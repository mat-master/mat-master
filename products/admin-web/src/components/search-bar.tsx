import { TextInput, TextInputProps } from '@mantine/core';
import React, { useState } from 'react';
import { Search as SearchIcon } from 'react-feather';
import usePrimaryColor from '../hooks/use-primary-color';

const SearchBar: React.FC<TextInputProps> = (props) => {
	const [focused, setFocused] = useState(false);
	const primaryColor = usePrimaryColor();

	return (
		<TextInput
			style={{ width: '32ch' }}
			icon={<SearchIcon size={18} color={focused ? primaryColor : undefined} />}
			placeholder='Search...'
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			{...props}
		/>
	);
};

export default SearchBar;
