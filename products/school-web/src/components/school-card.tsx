import { Card, createStyles, Image, Skeleton, Text, useMantineTheme } from '@mantine/core'
import type React from 'react'

const useStyles = createStyles((theme) => ({
	card: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
	},

	section: {
		borderBottom: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		paddingLeft: theme.spacing.md,
		paddingRight: theme.spacing.md,
		paddingBottom: theme.spacing.md,
	},

	like: {
		color: theme.colors.red[6],
	},

	label: {
		textTransform: 'uppercase',
		fontSize: theme.fontSizes.xs,
		fontWeight: 700,
	},
}))

interface BadgeCardProps {
	image: string
	name: string
	href: string
	loading?: boolean
}

const SchoolCard: React.FC<BadgeCardProps> = ({ image, name, href, loading }) => {
	const { classes } = useStyles()
	const theme = useMantineTheme()

	return (
		<Card
			withBorder
			component='a'
			href={href}
			padding='md'
			radius='md'
			shadow='sm'
			className={classes.card}
		>
			<Card.Section style={{ margin: 0 }}>
				<Skeleton visible={!!loading}>
					<Image src={image} alt={name} height={180} />
				</Skeleton>
			</Card.Section>

			<Card.Section className={classes.section} mt='md'>
				<Skeleton visible={!!loading}>
					<Text size='lg' weight={700}>
						{name}
					</Text>
				</Skeleton>
			</Card.Section>
		</Card>
	)
}

export default SchoolCard
