import { Badge, Card, createStyles, Group, Image, Text, useMantineTheme } from '@mantine/core'
import type React from 'react'
import { Users as StudentsIcon } from 'tabler-icons-react'

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
	title: string
	country: string
	description: string
	badges: {
		emoji: string
		label: string
	}[]
}

const SchoolCard: React.FC<BadgeCardProps> = ({
	image,
	title,
	description,
	country,
	badges,
}) => {
	const { classes } = useStyles()
	const theme = useMantineTheme()

	return (
		<Card withBorder padding='md' className={classes.card}>
			<Card.Section>
				<Image src={image} alt={title} height={180} />
			</Card.Section>

			<Card.Section className={classes.section} mt='md'>
				<Text size='lg' weight={700}>
					{title}
				</Text>
				<Group>
					<Badge size='lg' leftSection={<StudentsIcon size={16} />}>
						38
					</Badge>
				</Group>
			</Card.Section>
		</Card>
	)
}

export default SchoolCard
