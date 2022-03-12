import type React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import AuthorizedRoute from './authorized-route'
import Layout from './layout'
import ClassesPage from './pages/school/classes'
import DashboardPage from './pages/school/dashboard'
import MembershipsPage from './pages/school/memberships'
import StudentsPage from './pages/school/students'
import SchoolsPage from './pages/schools'
import SignInPage from './pages/sign-in'
import SignUpPage from './pages/sign-up'

const App: React.FC = () => (
	<BrowserRouter>
		<Routes>
			<Route path='sign-in' element={<SignInPage />} />
			<Route path='sign-up' element={<SignUpPage />} />

			<Route element={<AuthorizedRoute />}>
				<Route path='schools'>
					<Route index element={<SchoolsPage />} />
					<Route path=':school' element={<Layout />}>
						<Route index element={<DashboardPage />} />
						<Route path='students' element={<StudentsPage />} />
						<Route path='classes' element={<ClassesPage />} />
						<Route path='memberships' element={<MembershipsPage />} />
					</Route>
				</Route>
			</Route>

			<Route path='*' element='404' />
		</Routes>
	</BrowserRouter>
)

export default App;
