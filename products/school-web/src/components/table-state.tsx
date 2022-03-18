import { Button, createStyles, Group, Loader, Text } from '@mantine/core'
import type React from 'react'
import { Icon, Plus as DefaultCreateIcon, Refresh as RefreshIcon } from 'tabler-icons-react'

const useStyles = createStyles((theme) => ({
	state: {
		width: '100%',
		height: 360,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		margin: `0 ${theme.spacing.xl}`,
	},
}))

export interface TableEmptyStateProps {
	state?: 'loading' | 'error' | 'empty' | 'filtered'
	resourceLabel: string
	refetchItems: VoidFunction
	createItem: VoidFunction
	createIcon?: Icon
}

const TableState: React.FC<TableEmptyStateProps> = ({
	state,
	resourceLabel,
	refetchItems,
	createItem,
	createIcon: CreateIcon = DefaultCreateIcon,
}) => {
	const { classes } = useStyles()

	return state ? (
		<tr style={{ display: 'block', width: '100%' }}>
			<td className={classes.state}>
				<Group direction='column' align='center'>
					{state === 'loading' && <Loader variant='bars' />}

					{(state === 'empty' || state === 'filtered' || state === 'error') && (
						<Text color={state === 'error' ? 'red' : 'dimmed'} weight={700}>
							{state === 'error'
								? `Something went wrong getting your ${resourceLabel}`
								: state === 'empty'
								? `You don't have any ${resourceLabel} yet`
								: state === 'filtered'
								? `No ${resourceLabel} matched your search`
								: null}
						</Text>
					)}

					{state === 'error' && (
						<Button leftIcon={<RefreshIcon size={18} />} onClick={refetchItems}>
							Retry
						</Button>
					)}

					{state === 'empty' && (
						<Button leftIcon={<CreateIcon size={18} />} onClick={createItem}>
							Create One
						</Button>
					)}
				</Group>
			</td>
		</tr>
	) : null
}

export default TableState
