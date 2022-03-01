import type React from 'react';
import ClassesProvider from './classes-context';
import StudentsProvider from './students-context';

const ResourcesProvider: React.FC = ({ children }) => (
	<StudentsProvider>
		<ClassesProvider>{children}</ClassesProvider>
	</StudentsProvider>
);

export default ResourcesProvider;
