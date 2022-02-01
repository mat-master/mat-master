import React from 'react';
import { Route, Routes } from 'react-router';

const App: React.FC = () => (
	<Routes>
		<Route path='/' element='Dashboard' />
		<Route path='/classes' element='Classes' />
		<Route path='/classes/:class' element='Class' />
		<Route path='/students' element='Students' />
		<Route path='/students/:student' element='Student' />
		<Route path='/billing' element='Billing' />

		<Route path='account'>
			<Route index element='Account' />
			<Route path='sign-in' element='Sign In' />
			<Route path='sign-up' element='Sign Up' />
		</Route>

		<Route path='*' element='404' />
	</Routes>
);

export default App;
