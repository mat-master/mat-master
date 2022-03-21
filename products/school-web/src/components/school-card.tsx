import { Card, createStyles, Image, Text } from '@mantine/core'
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
}

const SchoolCard: React.FC<BadgeCardProps> = ({ image, name, href }) => {
	const { classes } = useStyles()

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
				<Image src={image} alt={name} height={180} />
			</Card.Section>

			<Card.Section className={classes.section} mt='md'>
				<Text size='lg' weight={700}>
					{name}
				</Text>
			</Card.Section>
		</Card>
	)
}

export default SchoolCard
