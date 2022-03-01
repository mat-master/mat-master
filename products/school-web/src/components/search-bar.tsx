import { TextInput, TextInputProps, useMantineTheme } from '@mantine/core';
import React, { useState } from 'react';
import { Search as SearchIcon } from 'react-feather';
import { getPrimaryColor } from '../utils/get-colors';

const SearchBar: React.FC<TextInputProps> = (props) => {
	const [focused, setFocused] = useState(false);
	const theme = useMantineTheme();

	return (
		<TextInput
			style={{ width: '32ch' }}
			icon={<SearchIcon size={18} color={focused ? getPrimaryColor(theme) : undefined} />}
			placeholder='Search...'
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			{...props}
		/>
	);
};

export default SearchBar;