import { Box, createStyles } from '@mantine/core'
import { useLocalStorageValue } from '@mantine/hooks'
import axios from 'axios'
import type React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

interface PageProps {
	authorized?: boolean
	header?: React.ReactNode
	sideBar?: React.ReactNode
}

const useStyles = createStyles((theme) => ({
	layout: {
		width: '100%',
		height: '100%',
		display: 'grid',
		gridTemplateRows: 'min-content minmax(0, 1fr)',
		gridTemplateColumns: 'min-content minmax(0, 1fr)',
	},
	headerWrapper: {
		gridColumn: 'span 2',
	},
	bodyWrapper: {
		width: '100%',
		maxHeight: '100%',
		overflowY: 'auto',
		display: 'grid',
		gridTemplateRows: 'min-content',
		gridAutoRows: 'min-content',
		alignItems: 'start',
		rowGap: theme.spacing.lg,
		padding: theme.spacing.xl,
	},
}))

const Page: React.FC<PageProps> = ({ authorized, header, sideBar, children }) => {
	const { classes } = useStyles()
	const [jwt] = useLocalStorageValue({ key: 'jwt' })
	const navigate = useNavigate()

	useEffect(() => {
		if (authorized && !jwt) {
			delete axios.defaults.headers.common.Authorization
			navigate('/sign-in')
		} else {
			axios.defaults.headers.common.Authorization = `Bearer ${jwt}`
		}
	}, [authorized, jwt])

	return (
		<Box className={classes.layout}>
			<div className={classes.headerWrapper}>{header}</div>
			<div>{sideBar}</div>
			<main className={classes.bodyWrapper}>{children}</main>
		</Box>
	)
}

export default Page
