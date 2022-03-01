import axios from 'axios';
import React, { useEffect, useState } from 'react';

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export interface AuthContext {
	user: User | null;
	signup: (
		firtName: string,
		lastName: string,
		email: string,
		password: string
	) => Promise<void>;
	signin: (email: string, password: string) => Promise<void>;
	signout: () => Promise<void>;
}

const UNKNOWN_ERROR = Error('An unknown error has occurred');

const validateUser = (user: unknown): user is User => {
	if (!user || typeof user !== 'object') return false;

	const structure: { [_ in keyof User]: string } = {
		id: 'string',
		firstName: 'string',
		lastName: 'string',
		email: 'string',
	};

	for (const [key, type] of Object.entries(structure)) {
		if (!(key in user)) return false;
		if (typeof (user as any)[key] !== type) return false;
	}

	return true;
};

const signup = async (firstName: string, lastName: string, email: string, password: string) => {
	const res = await axios.post('/auth/signup', { firstName, lastName, email, password });
	if (res.status !== 200) throw Error(res.data.error);
};

const signin = async (email: string, password: string) => {
	const res = await axios.post('/auth/signin', { email, password });
	if (res.status !== 200) throw Error(res.data.error);

	const { jwt } = res.data;
	if (typeof jwt !== 'string') throw UNKNOWN_ERROR;

	localStorage.setItem('jwt', jwt);
	axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
};

const signout = async () => {
	const res = await axios.post('/auth/signout');
	if (res.status !== 200) throw Error(res.data.error);

	localStorage.removeItem('jwt');
	delete axios.defaults.headers.common['Authorization'];
};

const getUser = async () => {
	const res = await axios.get('/users/me');
	if (res.status !== 200) throw Error(res.data.error);

	const { user } = res.data;
	if (!validateUser(user)) throw UNKNOWN_ERROR;

	return user;
};

export const authContext = React.createContext<AuthContext>({
	user: null,
	signup,
	signin,
	signout,
});

const AuthProvider: React.FC = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		if (user) return;

		const jwt = localStorage.getItem('jwt');
		if (!jwt) return;

		axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
		getUser().then(setUser).catch(console.error);
	}, []);

	return (
		<authContext.Provider value={{ user, signup, signin, signout }}>
			{children}
		</authContext.Provider>
	);
};

export default AuthProvider;
