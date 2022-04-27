import { Paper, SimpleGrid, Title } from '@mantine/core'
import type React from 'react'
import AccountForm from '../../components/account-form'
import AppHeader from '../../components/app-header'
import SideBar from '../../components/side-bar'
import Page from '../../page'

const AccountPage: React.FC = () => {
	return (
		<Page authorized header={<AppHeader />} sideBar={<SideBar />}>
			<SimpleGrid cols={2} spacing='sm'>
			<AccountForm />
				<Paper shadow='sm' padding='lg'>
					<Title>Billing Information</Title>
				</Paper>
			</SimpleGrid>
		</Page>
	)
}

export default AccountPage
