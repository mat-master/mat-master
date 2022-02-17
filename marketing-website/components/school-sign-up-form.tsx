import { Grid, TextInput } from '@mantine/core';
import React from 'react';

const StudioSignUpForm: React.FC = () => {
	return (
		<form>
			<Grid>
				<Grid.Col span={6}>
					<TextInput label='School Name' />
				</Grid.Col>
				<Grid.Col span={6}>
					<TextInput label='Address' />
				</Grid.Col>
			</Grid>
		</form>
	);
};

export default StudioSignUpForm;
