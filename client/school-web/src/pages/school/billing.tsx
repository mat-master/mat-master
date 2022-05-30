import type React from 'react'
import AppHeader from '../../components/app-header'
import PageHeader from '../../components/page-header'
import SideBar from '../../components/side-bar'
import Page from '../../page'

export interface BillingPageProps {}

const BillingPage: React.FC<BillingPageProps> = ({}) => {
	return (
		<Page authorized header={<AppHeader />} sideBar={<SideBar />}>
			<PageHeader title='Billing' search={() => {}} />
		</Page>
	)
}

export default BillingPage
