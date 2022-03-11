import { AVATAR_URL } from '@common/types'
import { Avatar, Box, Skeleton, Text, UnstyledButton, useMantineTheme } from '@mantine/core'
import type React from 'react'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { getUser } from '../data/auth'
import { getHighlightColor } from '../utils/get-colors'
import getInitials from '../utils/get-initials'
import UserModal from './user-modal'

const UserButton: React.FC = () => {
	const theme = useMantineTheme()
	const { data: user, status } = useQuery('me', getUser)
	const [open, setOpen] = useState(false)

	return (
		<>
			<UnstyledButton
				disabled={!user}
				onClick={() => setOpen(true)}
				sx={(theme) => ({
					width: '100%',
					display: 'grid',
					gridTemplateColumns: 'min-content minmax(0, 1fr)',
					alignItems: 'center',
					columnGap: theme.spacing.xs,
					padding: theme.spacing.xs,
					borderRadius: theme.radius.sm,
					'&:hover': {
						background: user ? getHighlightColor(theme) : undefined,
					},
				})}
			>
				<Skeleton
					visible={status === 'loading'}
					width='min-content'
					height='min-content'
					radius='xl'
				>
					<Avatar
						radius='xl'
						color={theme.primaryColor}
						src={user?.avatar ? `${AVATAR_URL}/${user.avatar.toString()}.webp` : ''}
					>
						{user && getInitials(user)}
					</Avatar>
				</Skeleton>

				<Skeleton visible={status === 'loading'}>
					<Box
						sx={{
							maxWidth: '100%',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						<Text size='sm' weight='bold' transform='capitalize'>
							{user ? `${user.firstName} ${user.lastName}` : 'loading'.repeat(3)}
						</Text>

						<Text size='xs' color='dimmed'>
							{user?.email ?? 'loading'.repeat(3)}
						</Text>
					</Box>
				</Skeleton>
			</UnstyledButton>

			<UserModal open={open} onClose={() => setOpen(false)} />
		</>
	)
}

export default UserButton
