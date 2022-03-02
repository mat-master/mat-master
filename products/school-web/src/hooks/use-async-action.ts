import { useNotifications } from '@mantine/notifications';
import getErrorMessage from '../utils/get-error-message';

export type ActionType = 'create' | 'update' | 'delete';

const gerund = (actionType: ActionType) =>
	actionType === 'create'
		? 'creating'
		: actionType === 'update'
		? 'updating'
		: actionType === 'delete'
		? 'deleting'
		: '';

const pastTense = (actionType: ActionType) =>
	actionType === 'create'
		? 'created'
		: actionType === 'update'
		? 'updated'
		: actionType === 'delete'
		? 'deleted'
		: '';

const useAsyncAction = (
	action: () => Promise<any>,
	actionType: ActionType,
	resourceLabel: string
) => {
	const notifications = useNotifications();

	return async () => {
		const notificationId = notifications.showNotification({
			message: `${gerund(actionType)} ${resourceLabel}`,
			loading: true,
			autoClose: false,
			disallowClose: true,
		});

		try {
			await action();

			notifications.updateNotification(notificationId, {
				id: notificationId,
				message: `Successfully ${pastTense(actionType)} ${resourceLabel}`,
				loading: false,
			});
		} catch (error) {
			notifications.updateNotification(notificationId, {
				id: notificationId,
				title: `Error ${pastTense(actionType)} ${resourceLabel}`,
				message: getErrorMessage(error),
				loading: false,
			});
		}
	};
};

export default useAsyncAction;
