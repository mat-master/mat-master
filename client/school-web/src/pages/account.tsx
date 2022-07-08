import { Paper, SimpleGrid, Title } from '@mantine/core'
import type React from 'react'
import AppHeader from '../components/app-header'
import { BillingForm } from '../components/billing-form'
import { RemoteUserForm } from '../components/user-form'
import Page from '../page'

const AccountPage: React.FC = () => {
	return (
		<Page authorized header={<AppHeader />}>
			<SimpleGrid cols={2} spacing='sm'>
				<Paper shadow='sm' p='lg'>
					<Title>Account</Title>
					<RemoteUserForm />
				</Paper>
				<Paper shadow='sm' p='lg'>
					<Title>Billing Information</Title>
					<BillingForm redirect={window.location.href} />
				</Paper>
			</SimpleGrid>
		</Page>
	)
}

export default AccountPage
