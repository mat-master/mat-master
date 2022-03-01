import { useListState } from '@mantine/hooks';
import axios from 'axios';
import React from 'react';
import type { ClassTime } from '../utils/class-time-serialization';

export interface Class {
	id: string;
	name: string;
	schedule: Array<[ClassTime, number]>;
}

export interface ClassSummary {
	id: string;
	name: string;
	studentAvatars: string[];
	memberships: Array<string>;
	schedule: string;
}

interface ClassesContext {
	summaries: ClassSummary[];
	classes: Class[];
	getSummaries: () => Promise<ClassSummary[]>;
	create: (data: Omit<Class, 'id'>) => Promise<void>;
	get: (id: string) => Promise<Class>;
	update: (id: string, data: Partial<Class>) => Promise<void>;
	remove: (id: string) => Promise<void>;
}

const validateClass = (value: unknown): value is Class => {
	return true;
};

const validateClassSummary = (summary: unknown): summary is ClassSummary => {
	return true;
};

const mergeClass = (base: Class, data: Partial<Class>) => {
	return { ...base, ...data };
};

const defaultHandler = () => {
	throw Error('unimplemented');
};

export const classesContext = React.createContext<ClassesContext>({
	summaries: [],
	classes: [],
	getSummaries: defaultHandler,
	create: defaultHandler,
	get: defaultHandler,
	update: defaultHandler,
	remove: defaultHandler,
});

const ClassesProvider: React.FC = ({ children }) => {
	const [classes, classesHandlers] = useListState<Class>();
	const [summaries, summariesHandlers] = useListState<ClassSummary>();

	const getSummaries = async () => {
		if (summaries.length > 0) return summaries;

		const res = await axios.get('/classes/*?summarize');
		if (res.status !== 200) throw Error(res.data.error);

		const newSummaries = res.data.summaries;
		if (!Array.isArray(newSummaries) || !newSummaries.every(validateClassSummary))
			throw Error('invalid response');

		summariesHandlers.setState(newSummaries);
		return newSummaries;
	};

	const create = async (data: Omit<Class, 'id'>) => {
		const res = await axios.post('/classes', data);
		if (res.status !== 200) throw Error(res.data.error);

		const { id } = res.data;
		if (typeof id !== 'string') throw Error('invalid response');

		const summaryRes = await axios.get(`/classes/${id}?summarize`);
		if (summaryRes.status !== 200) throw Error(summaryRes.data.error);

		const { summary } = summaryRes.data;
		if (!validateClassSummary(summary)) throw Error('invalid response');

		classesHandlers.append({ ...data, id });
		summariesHandlers.append(summary);
	};

	const get = async (id: string) => {
		const local = classes.find((value) => value.id === id);
		if (local) return local;

		const res = await axios.get(`/classes/${id}`);
		if (res.status !== 200) throw Error(res.data.error);

		const value = res.data.class;
		if (!validateClass(value)) throw Error('invalid response');

		classesHandlers.append(value);
		return value;
	};

	const update = async (id: string, data: Partial<Class>) => {
		const res = await axios.post(`/classes/${id}`, data);
		if (res.status !== 200) throw Error(res.data.error);

		const i = classes.findIndex((item) => item.id === id);
		if (i > 0) classesHandlers.setItem(i, mergeClass(classes[i], data));

		// TODO: update class summary
	};

	const remove = async (id: string) => {
		const res = await axios.delete(`/classes/${id}`);
		if (res.status !== 200) throw Error(res.data.error);

		classesHandlers.remove(classes.findIndex((item) => item.id === id));
		summariesHandlers.remove(summaries.findIndex((item) => item.id === id));
	};

	return (
		<classesContext.Provider
			value={{ classes, summaries, getSummaries, create, get, update, remove }}
		>
			{children}
		</classesContext.Provider>
	);
};

export default ClassesProvider;
