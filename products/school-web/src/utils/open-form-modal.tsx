import { Title } from '@mantine/core'
import type { ModalsContextProps } from '@mantine/modals/lib/context'
import React from 'react'

const openFormModal = (
	modals: ModalsContextProps,
	title: string,
	form: React.ReactNode
) => {
	if (!React.isValidElement(form)) throw 'Invalid form'
	const id = modals.openModal({
		title: <Title order={3}>{title}</Title>,
		children: React.cloneElement(form, {
			onSubmit: () => modals.closeModal(id),
		}),
	})
}

export default openFormModal
