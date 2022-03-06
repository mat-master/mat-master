import type { NotificationsContextProps } from '@mantine/notifications/lib/types'
import type { RemoteResource, ResourceContext, ResourceData } from '../data/resource-provider'
import getErrorMessage from './get-error-message'

interface SetRemoteResourceOptions {
	id?: string
	notifications?: NotificationsContextProps
	resourceLabel?: string
}

const setRemoteResource = async <T extends RemoteResource>(
	src: ResourceContext<T, any>,
	data: Partial<ResourceData<T>>,
	options?: SetRemoteResourceOptions
) => {
	const { id, notifications, resourceLabel = 'resource' } = options ?? {}

	const notificationId = notifications?.showNotification({
		message: `${id ? 'Updating' : 'Creating'} ${resourceLabel}`,
		loading: true,
		autoClose: false,
		disallowClose: true,
	})

	try {
		if (id) {
			await src.update(id, data)
		} else {
			await src.create(data as T)
		}

		notifications?.updateNotification(notificationId!, {
			id: notificationId,
			message: `${id ? 'Updated' : 'Created'} ${resourceLabel}`,
		})
	} catch (error) {
		let message = await getErrorMessage(error)
		if (typeof message !== 'string') message = 'An unkown error ocurred'

		notifications?.updateNotification(notificationId!, {
			id: notificationId,
			title: `Error ${id ? 'updating' : 'creating'} ${resourceLabel}`,
			color: 'red',
			message,
		})
	}
}

export default setRemoteResource
