import { Paper, SimpleGrid, Title } from '@mantine/core'
import type React from 'react'
import AppHeader from '../components/app-header'
import UserForm from '../components/user-form'
import Page from '../page'

const AccountPage: React.FC = () => {
	return (
		<Page authorized header={<AppHeader />}>
			<SimpleGrid cols={2} spacing='sm'>
				<Paper shadow='sm' padding='lg'>
					<Title>Account</Title>
					<UserForm />
				</Paper>
				<Paper shadow='sm' padding='lg'>
					<Title>Billing Information</Title>
				</Paper>
			</SimpleGrid>
		</Page>
	)
}

export default AccountPage
