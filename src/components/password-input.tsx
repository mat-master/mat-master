import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
	FormControl,
	FormLabel,
	IconButton,
	Input,
	InputGroup,
	InputProps,
	InputRightElement,
	useDisclosure,
	useMergeRefs,
} from '@chakra-ui/react';
import React from 'react';

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
	const { isOpen, onToggle } = useDisclosure();
	const inputRef = React.useRef<HTMLInputElement>(null);
	const mergeRef = useMergeRefs(inputRef, ref);

	const onClickReveal = () => {
		inputRef.current?.focus({ preventScroll: true });
		onToggle();
	};

	return (
		<FormControl id='password'>
			<FormLabel>Password</FormLabel>
			<InputGroup>
				<Input
					ref={mergeRef}
					name='password'
					type={isOpen ? 'text' : 'password'}
					autoComplete='current-password'
					required
					{...props}
				/>
				<InputRightElement>
					<IconButton
						size='sm'
						aria-label={isOpen ? 'Hide password' : 'Show password'}
						icon={isOpen ? <ViewIcon /> : <ViewOffIcon />}
						onClick={onClickReveal}
					/>
				</InputRightElement>
			</InputGroup>
		</FormControl>
	);
});

export default PasswordInput;
