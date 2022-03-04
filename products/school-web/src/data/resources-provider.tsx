import type React from 'react';
import classesContext, { testClasses, testClassSummaries } from './classes-context';
import membershipsContext, {
	testMemberships,
	testMembershipSummaries,
} from './memberships-context';
import ResourceProvider from './resource-provider';
import studentsContext, { testStudents, testStudentSummaries } from './students-context';

const ResourcesProvider: React.FC = ({ children }) => (
	<ResourceProvider
		context={studentsContext}
		defaultItems={testStudents}
		defaultSummaries={testStudentSummaries}
	>
		<ResourceProvider
			context={classesContext}
			defaultItems={testClasses}
			defaultSummaries={testClassSummaries}
		>
			<ResourceProvider
				context={membershipsContext}
				defaultItems={testMemberships}
				defaultSummaries={testMembershipSummaries}
			>
				{children}
			</ResourceProvider>
		</ResourceProvider>
	</ResourceProvider>
);

export default ResourcesProvider;
