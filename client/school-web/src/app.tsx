import { Global, MantineProvider } from '@mantine/core'
import type React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { ModalsProvider } from './components/modals-context'
import AcceptInvitePage from './pages/accept-invite'
import AccountPage from './pages/account'
import BillingPage from './pages/school/billing'
import ClassesPage from './pages/school/classes'
import DashboardPage from './pages/school/dashboard'
import MembershipsPage from './pages/school/memberships'
import StudentsPage from './pages/school/students'
import SchoolsPage from './pages/schools'
import SignUpLoginPage from './pages/sign-up-login'
import VerifyPage from './pages/verify'

const App: React.FC = () => (
	<MantineProvider
		theme={{
			primaryColor: 'red',
			fontFamily: "'Lato', sans-serif",
			headings: { fontFamily: "'Lato', sans-serif", fontWeight: 900 },
		}}
	>
		<Global
			styles={(theme) => ({
				'*, *::before, *::after': { boxSizing: 'border-box' },
				'body, #root': { margin: 0, width: '100vw', height: '100vh' },
				body: {
					backgroundColor: theme.colors.gray[1],
					...theme.fn.fontStyles(),
				},
			})}
		/>
		<ModalsProvider>
			<Routes>
				<Route path='sign-in' element={<SignUpLoginPage intention='Sign in' />} />
				<Route path='sign-up' element={<SignUpLoginPage intention='Sign up' />} />
				<Route path='accept-invite' element={<AcceptInvitePage />} />
				<Route path='account' element={<AccountPage />} />
				<Route path='verify' element={<VerifyPage />} />

				<Route path='schools'>
					<Route index element={<SchoolsPage />} />
					<Route path=':school'>
						<Route index element={<DashboardPage />} />
						<Route path='students' element={<StudentsPage />} />
						<Route path='classes' element={<ClassesPage />} />
						<Route path='memberships' element={<MembershipsPage />} />
						<Route path='billing' element={<BillingPage />} />
					</Route>
				</Route>

				<Route path='/' element={<Navigate to='/schools' />} />
				<Route path='*' element='404' />
			</Routes>
		</ModalsProvider>
	</MantineProvider>
)

export default App
