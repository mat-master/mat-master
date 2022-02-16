import React from 'react';
import { Route, Routes } from 'react-router';
import Layout from './layout';

const App: React.FC = () => (
	<Routes>
		<Route element={<Layout />}>
			<Route path='/' element='Dashboard' />
			<Route path='/classes' element='Classes' />
			<Route path='/classes/:class' element='Class' />
			<Route path='/students' element='Students' />
			<Route path='/students/:student' element='Student' />
			<Route path='/billing' element='Billing' />
			<Route path='/settings' element='Settings' />
			<Route path='/account' element='Account' />
		</Route>

		<Route path='*' element='404' />
	</Routes>
);

export default App;
