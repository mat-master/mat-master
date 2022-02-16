import { Grid, TextInput } from '@mantine/core';
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
					<TextInput label='Email' type='email' />
				</Grid.Col>
				<Grid.Col span={6}>
					<TextInput label='Phone Number' type='tel' />
				</Grid.Col>
			</Grid>
		</form>
	);
};

export default AdminSignUpForm;
