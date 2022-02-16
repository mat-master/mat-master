import { Title } from '@mantine/core';
import React from 'react';

const PageHeader: React.FC = () => {
	return (
		<header
			style={{
				gridArea: 'header',
				backgroundColor: 'transparent',
				border: 'none',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
			<Title>Page Title</Title>
		</header>
	);
};

export default PageHeader;
