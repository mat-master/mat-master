import type React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import AcceptInvitePage from './pages/accept-invite'
import AccountPage from './pages/account'
import BillingPage from './pages/school/billing'
import ClassesPage from './pages/school/classes'
import DashboardPage from './pages/school/dashboard'
import MembershipsPage from './pages/school/memberships'
import StudentsPage from './pages/school/students'
import SchoolsPage from './pages/schools'
import SignInPage from './pages/sign-in'
import SignUpPage from './pages/sign-up'
import VerifyPage from './pages/verify'

const App: React.FC = () => (
	<BrowserRouter>
		<Routes>
			<Route path='sign-in' element={<SignInPage />} />
			<Route path='sign-up' element={<SignUpPage />} />
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
	</BrowserRouter>
)

export default App;
