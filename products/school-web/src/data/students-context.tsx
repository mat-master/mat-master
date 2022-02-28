import { useListState } from '@mantine/hooks';
import axios from 'axios';
import React from 'react';

type ActivityStatus = 'active' | 'inactive' | 'deleted';

interface Student {
	id: string;
	activityStatus: ActivityStatus;

	/** list of membership ids */
	memberships: Array<string>;
}

interface StudentSummary {
	id: string;
	name: string;
	activityStatus: ActivityStatus;

	/** list of membership names */
	memberships: Array<string>;
}

interface StudentsContext {
	summaries: StudentSummary[];
	students: Student[];
	loadSummaries: () => Promise<StudentSummary[]>;
	invite: (email: string) => Promise<void>;
	get: (id: string) => Promise<Student>;
	update: (id: string, data: Partial<Student>) => Promise<void>;
	remove: (id: string) => Promise<void>;
}

const validateStudentSummary = (summary: unknown): summary is StudentSummary => {
	return true;
};

const validateStudent = (student: unknown): student is Student => {
	return true;
};

const mergeStudent = (student: Student, data: Partial<Student>) => {
	return { ...student, ...data };
};

const defaultMethod = async () => {
	throw Error('uninitailized');
};
export const studentsContext = React.createContext<StudentsContext>({
	summaries: [],
	students: [],
	loadSummaries: defaultMethod,
	invite: defaultMethod,
	get: defaultMethod,
	update: defaultMethod,
	remove: defaultMethod,
});

const StudentsProvider: React.FC = ({ children }) => {
	const [summaries, summariesHandlers] = useListState<StudentSummary>([]);
	const [students, studentsHandlers] = useListState<Student>([]);

	const loadSummaries = async () => {
		if (summaries.length > 0) summaries;

		const res = await axios.get('/students/*?summarize');
		if (res.status !== 200) throw Error(res.data.error);

		const newSummaries = res.data.summaries;
		if (!Array.isArray(newSummaries)) throw Error('invalid response');
		if (!newSummaries.every(validateStudentSummary)) throw Error('invalid response');

		summariesHandlers.setState(newSummaries);
		return newSummaries;
	};

	const invite = async (email: string) => {
		const res = await axios.post('/invites', { email });
		if (res.status !== 200) throw Error(res.data.error);
	};

	const get = async (id: string) => {
		const local = students.find((student) => student.id === id);
		if (local) return local;

		const res = await axios.get(`/students/${id}`);
		if (res.status !== 200) throw Error(res.data.error);

		const { student } = res.data;
		if (!validateStudent(student)) throw Error('invalid response');

		studentsHandlers.append(student);
		return student;
	};

	const update = async (id: string, data: Partial<Student>) => {
		const res = await axios.post(`/students/${id}`, data);
		if (res.status !== 200) throw Error(res.data.error);

		const i = students.findIndex((student) => student.id === id);
		if (i > 0) studentsHandlers.setItem(i, mergeStudent(students[i], data));
	};

	const remove = async (id: string) => {
		const res = await axios.delete(`/students/${id}`);
		if (res.status !== 200) throw Error(res.data.error);

		const i = students.findIndex((student) => student.id === id);
		if (i > 0) studentsHandlers.remove(i);
	};

	return (
		<studentsContext.Provider
			value={{ summaries, students, loadSummaries, invite, get, update, remove }}
		>
			{children}
		</studentsContext.Provider>
	);
};

export default StudentsProvider;
