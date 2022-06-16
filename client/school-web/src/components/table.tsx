import { createStyles, Loader, Paper, Text, Title } from '@mantine/core'
import type React from 'react'
import { ReactNode } from 'react'

interface TableColumn<TColumn extends string> {
	key: TColumn
	label?: ReactNode
	width?: number
	defaultElement?: React.ReactNode | undefined
}

type TableItem<TColumn extends string> = { [_ in TColumn]: React.ReactNode }

export interface TableProps<
	TColumn extends string,
	TItem extends TableItem<TColumn> = TableItem<TColumn>
> {
	columns: TableColumn<TColumn>[]
	data?: TItem[]
	loading?: boolean
	errorMessage?: ReactNode
	emptyMessage?: ReactNode
	onItemClick?(item: TItem): void
}

const useStyles = createStyles((theme) => ({
	root: {
		width: '100%',
		maxHeight: '100%',
		display: 'grid',
		gridAutoColumns: '1fr',
		gridTemplateRows: 'min-content 1fr',
	},
	row: {
		display: 'block',
		paddingLeft: theme.spacing.md,
		paddingRight: theme.spacing.md,
	},
	head: {
		width: '100%',
		paddingTop: theme.spacing.md,
		paddingBottom: theme.spacing.md,
		borderBottom: `1px solid ${theme.colors.gray[2]}`,
	},
	body: {
		width: '100%',
		maxHeight: '100%',
		overflowY: 'auto',
	},
	item: {
		paddingTop: theme.fn.size({ size: 'xs', sizes: theme.spacing }),
		paddingBottom: theme.fn.size({ size: 'xs', sizes: theme.spacing }),
		borderBottom: `1px solid ${theme.colors.gray[2]}`,
		// '&:hover': {
		// 	backgroundColor: theme.colors.gray[0],
		// },
		'&:last-child': {
			border: 'none',
		},
	},
	state: {
		width: '100%',
		paddingTop: theme.fn.size({ size: 'xl', sizes: theme.spacing }),
		paddingBottom: theme.fn.size({ size: 'xl', sizes: theme.spacing }),
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	cell: {
		display: 'inline-block',
		textAlign: 'left',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
}))

const Table = <TColumn extends string>({
	columns,
	data = [],
	loading,
	errorMessage,
	emptyMessage,
	onItemClick,
}: TableProps<TColumn>) => {
	const { classes, cx } = useStyles()
	const totalWidth = columns.reduce((total, { width = 1 }) => total + width, 0)
	const columnWidths = columns.map(
		({ width = 1 }) => `${(width / totalWidth) * 100}%`
	)

	return (
		<Paper component='table' shadow='sm' className={classes.root}>
			<thead className={classes.head}>
				<tr className={classes.row}>
					{columns.map((column, i) => (
						<th
							key={column.key}
							className={classes.cell}
							style={{ width: columnWidths[i] }}
						>
							<Title order={5} style={{ textTransform: 'capitalize' }}>
								{column.label ?? column.key}
							</Title>
						</th>
					))}
				</tr>
			</thead>

			<tbody className={classes.body}>
				{data.map((item, i) => (
					<tr
						key={i}
						className={cx(classes.row, classes.item)}
						onClick={() => onItemClick && onItemClick(item)}
						style={onItemClick ? { cursor: 'pointer' } : undefined}
					>
						{columns.map(({ key, defaultElement }, i) => (
							<td
								key={key}
								className={classes.cell}
								style={{ width: columnWidths[i], maxWidth: columnWidths[i] }}
							>
								{item[key] ?? defaultElement}
							</td>
						))}
					</tr>
				))}

				{(loading || errorMessage || !data.length) && (
					<tr className={cx(classes.row, classes.state)}>
						<td>
							{loading ? (
								<Loader />
							) : typeof errorMessage === 'string' ? (
								<Text color='red'>{errorMessage}</Text>
							) : !!errorMessage ? (
								errorMessage
							) : !data.length ? (
								emptyMessage || (
									<Text color='dimmed'>No items matched your search</Text>
								)
							) : null}
						</td>
					</tr>
				)}
			</tbody>
		</Paper>
	)
}

export default Table
