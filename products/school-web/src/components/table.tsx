import {
	createStyles,
	Loader,
	MantineNumberSize,
	Paper,
	Text,
	TextProps,
	Title,
} from '@mantine/core'
import type React from 'react'
import { useNavigate } from 'react-router'

interface Column<T extends string> {
	key: T
	name?: string
	width?: number
	defaultElement?: React.ReactNode | undefined
}

interface ItemData<T extends string> {
	href?: string | undefined
	data: { [_ in T]?: React.ReactNode }
}

export interface TableProps<T extends string> {
	columns: Column<T>[]
	items: ItemData<T>[]
	itemPadding?: MantineNumberSize | number | undefined
	loading?: boolean
}

interface StylesProps {
	itemPadding: MantineNumberSize | number
}

const useStyles = createStyles((theme, { itemPadding }: StylesProps) => ({
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
		paddingTop: theme.fn.size({ size: itemPadding, sizes: theme.spacing }),
		paddingBottom: theme.fn.size({ size: itemPadding, sizes: theme.spacing }),
		borderBottom: `1px solid ${theme.colors.gray[2]}`,
		// '&:hover': {
		// 	backgroundColor: theme.colors.gray[0],
		// },
		'&:last-child': {
			border: 'none',
		},
	},
	cell: {
		display: 'inline-block',
		textAlign: 'left',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	state: {
		width: '100%',
		height: 360,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
}))

const Table = <T extends string>({
	columns,
	items,
	itemPadding = 'xs',
	loading,
}: TableProps<T>) => {
	const { classes } = useStyles({ itemPadding })
	const navigate = useNavigate()

	const totalColumnWidth = columns.reduce((sum, { width = 1 }) => sum + width, 0)
	const columnWidths = columns.map(({ width = 1 }) => `${(width / totalColumnWidth) * 100}%`)

	return (
		<Paper component='table' shadow='sm' className={classes.root}>
			<thead className={classes.head}>
				<tr className={classes.row}>
					{columns.map((column, i) => (
						<th key={column.key} className={classes.cell} style={{ width: columnWidths[i] }}>
							<Title order={5}>{column.name ?? column.key}</Title>
						</th>
					))}
				</tr>
			</thead>

			<tbody className={classes.body}>
				{(loading || !items.length) && (
					<tr className={classes.state}>
						<td>
							{loading ? <Loader /> : <Text color='dimmed'>No items matched your search</Text>}
						</td>
					</tr>
				)}

				{!loading &&
					items.map((item, i) => (
						<tr
							key={i}
							className={`${classes.row} ${classes.item}`}
							data-href={item.href}
							onClick={() => item.href && navigate(item.href)}
							style={{ cursor: item.href ? 'pointer' : undefined }}
						>
							{columns.map(({ key, defaultElement }, i) => {
								const props: React.HTMLAttributes<'td'> & TextProps<'td'> = {
									key: key,
									className: classes.cell,
									style: { width: columnWidths[i], maxWidth: columnWidths[i] },
									children: item.data[key] ?? defaultElement,
								}

								return typeof props.children === 'string' ? (
									<Text component='td' {...props} />
								) : (
									<td {...props} />
								)
							})}
						</tr>
					))}
			</tbody>
		</Paper>
	)
}

export default Table
