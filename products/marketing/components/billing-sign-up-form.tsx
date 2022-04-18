import { Grid, TextInput } from '@mantine/core';
import React from 'react';

export interface BillingSignUpFormProps {}

const BillingSignUpForm: React.FC<BillingSignUpFormProps> = ({}) => {
	return (
		<form>
			<Grid>
				<Grid.Col span={6}>
					<TextInput label='Card Number' />
				</Grid.Col>
				<Grid.Col span={6}>
					<TextInput label='Expiration Date' />
				</Grid.Col>
			</Grid>
		</form>
	);
};

export default BillingSignUpForm;
