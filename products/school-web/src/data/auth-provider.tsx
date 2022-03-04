import axios from 'axios';
import React, { useEffect, useState } from 'react';

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export interface SignUpData {
	firstName: string
	lastName: string
	email: string
	password: string
}

export interface SignInData {
	email: string
	password: string
}

export interface AuthContext {
	user: User | null
	signup: (data: SignUpData) => Promise<void>
	signin: (data: SignInData) => Promise<void>
	signout: () => Promise<void>
}

const UNKNOWN_ERROR = Error('An unknown error has occurred')

const validateUser = (user: unknown): user is User => {
	if (!user || typeof user !== 'object') return false

	const structure: { [_ in keyof User]: string } = {
		id: 'string',
		firstName: 'string',
		lastName: 'string',
		email: 'string',
	}

	for (const [key, type] of Object.entries(structure)) {
		if (!(key in user)) return false
		if (typeof (user as any)[key] !== type) return false
	}

	return true
}

const signup = async (data: SignUpData) => {
	const res = await axios.post('/auth/signup', data)
	if (res.status !== 200) throw Error(res.data.error)
}

const signin = async (data: SignInData) => {
	const res = await axios.post('/auth/login', data)
	if (res.status !== 200) throw Error(res.data.error)

	const { jwt } = res.data
	if (typeof jwt !== 'string') throw UNKNOWN_ERROR

	localStorage.setItem('jwt', jwt)
	axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
}

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
