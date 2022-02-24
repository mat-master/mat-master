import React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Layout from './layout';
import BillingPage from './pages/billing';
import ClassPage from './pages/class';
import ClassesPage from './pages/classes';
import DashboardPage from './pages/dashboard';
import StudentPage from './pages/student';
import StudentsPage from './pages/students';

const App: React.FC = () => (
	<BrowserRouter>
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route index element={<DashboardPage />} />

				<Route path='/classes'>
					<Route index element={<ClassesPage />} />
					<Route path=':class' element={<ClassPage />} />
				</Route>

				<Route path='/students'>
					<Route index element={<StudentsPage />} />
					<Route path=':student' element={<StudentPage />} />
				</Route>

				<Route path='/billing' element={<BillingPage />} />
				<Route path='/settings' element='Settings' />
				<Route path='/account' element='Account' />
			</Route>

			<Route path='*' element='404' />
		</Routes>
	</BrowserRouter>
);

export default App;
