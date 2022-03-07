import type React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Layout from './layout';
import SignInPage from './pages/auth/sign-in'
import SignUpPage from './pages/auth/sign-up'
import ClassesPage from './pages/classes'
import DashboardPage from './pages/dashboard'
import MembershipsPage from './pages/memberships'
import StudentsPage from './pages/students'

const App: React.FC = () => (
	<BrowserRouter>
		<Routes>
			<Route path='auth'>
				<Route path='sign-in' element={<SignInPage />} />
				<Route path='sign-up' element={<SignUpPage />} />
			</Route>

			<Route path=':school' element={<Layout />}>
				<Route index element={<DashboardPage />} />
				<Route path='students' element={<StudentsPage />} />
				<Route path='classes' element={<ClassesPage />} />
				<Route path='memberships' element={<MembershipsPage />} />
				<Route path='settings' element='Settings' />
				<Route path='account' element='Account' />
			</Route>

			<Route path='*' element='404' />
		</Routes>
	</BrowserRouter>
)

export default App;
