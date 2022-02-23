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
			<Route element={<Layout />}>
				<Route path='/' element={<DashboardPage />} />
				<Route path='/classes' element={<ClassesPage />} />
				<Route path='/classes/:class' element={<ClassPage />} />
				<Route path='/students' element={<StudentsPage />} />
				<Route path='/students/:student' element={<StudentPage />} />
				<Route path='/billing' element={<BillingPage />} />
			</Route>

			<Route path='/settings' element='Settings' />
			<Route path='/account' element='Account' />

			<Route path='*' element='404' />
		</Routes>
	</BrowserRouter>
);

export default App;
