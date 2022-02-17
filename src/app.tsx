import React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Layout from './layout';
import ClassesPage from './pages/classes';
import StudentsPage from './pages/students';

const App: React.FC = () => (
	<BrowserRouter>
		<Routes>
			<Route element={<Layout />}>
				<Route path='/' element='Dashboard' />
				<Route path='/students' element={<StudentsPage />} />
				<Route path='/students/:student' element='Student' />
				<Route path='/classes' element={<ClassesPage />} />
				<Route path='/classes/:class' element='Class' />
				<Route path='/billing' element='Billing' />
			</Route>

			<Route path='/settings' element='Settings' />
			<Route path='/account' element='Account' />

			<Route path='*' element='404' />
		</Routes>
	</BrowserRouter>
);

export default App;
