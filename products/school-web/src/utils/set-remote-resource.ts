import type { NotificationsContextProps } from '@mantine/notifications/lib/types'
import type { RemoteResource, ResourceContext, ResourceData } from '../data/resource-provider'
import getErrorMessage from './get-error-message'

interface SetRemoteResourceOptions<T extends RemoteResource> {
	id?: string
	data?: Partial<ResourceData<T>>
	notifications?: NotificationsContextProps
	resourceLabel?: string
}

const setRemoteResource = async <T extends RemoteResource>(
	src: ResourceContext<T, any>,
	options?: SetRemoteResourceOptions<T>
) => {
	const { id, data, notifications, resourceLabel = 'resource' } = options ?? {}

	const gerund = id && data ? 'Updating' : data ? 'Creating' : id ? 'Deleting' : ''
	const pastTenst = id && data ? 'Updated' : data ? 'Created' : id ? 'Deleted' : ''

	const notificationId = notifications?.showNotification({
		message: `${gerund} ${resourceLabel}`,
		loading: true,
		autoClose: false,
		disallowClose: true,
	})

	try {
		if (id && data) {
			await src.update(id, data)
		} else if (data) {
			await src.create(data as T)
		} else if (id) {
			await src.remove(id)
		}

		notifications?.updateNotification(notificationId!, {
			id: notificationId,
			message: `${pastTenst} ${resourceLabel}`,
		})
	} catch (error) {
		let message = await getErrorMessage(error)
		if (typeof message !== 'string') message = 'An unkown error ocurred'

		notifications?.updateNotification(notificationId!, {
			id: notificationId,
			title: `Error ${gerund.toLowerCase()} ${resourceLabel}`,
			color: 'red',
			message,
		})
	}
}

export default setRemoteResource
