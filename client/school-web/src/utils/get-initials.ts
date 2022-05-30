import type { User } from '@common/types'

const getInitials = (user: User) => `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

export default getInitials
