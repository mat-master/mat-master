import { Grid, PasswordInput, TextInput } from '@mantine/core';
import React from 'react';

const AdminSignUpForm: React.FC = () => {
	return (
		<form>
			<Grid>
				<Grid.Col span={6}>
					<TextInput label='First Name' />
				</Grid.Col>
				<Grid.Col span={6}>
					<TextInput label='Last Name' />
				</Grid.Col>
				<Grid.Col span={6}>
					<TextInput type='email' label='Email' />
				</Grid.Col>
				<Grid.Col span={6}>
					<PasswordInput label='Password' />
				</Grid.Col>
			</Grid>
		</form>
	);
};

export default AdminSignUpForm;
