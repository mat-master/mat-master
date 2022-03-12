import { Box, Skeleton, Title } from '@mantine/core'
import type React from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import { getSchool } from '../data/schools'

const AppHeader: React.FC = () => {
	const { school } = useParams()
	if (!school) throw Error('App Header is designed to be rendered under a school route')
	const { data, error } = useQuery(`school:${school}`, () => getSchool(school))
	console.log(data, error)

	return (
		<Box
			component='header'
			sx={(theme) => ({
				gridColumn: 'span 2',
				padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
				backgroundColor: theme.white,
				borderBottom: `1px solid ${theme.colors.gray[2]}`,
			})}
		>
			<Skeleton width={256} visible={false}>
				<Title order={3}>{'Mat Master'}</Title>
			</Skeleton>
		</Box>
	)
}

export default AppHeader
