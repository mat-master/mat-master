import { Modal, Title } from '@mantine/core'
import { useListState } from '@mantine/hooks'
import { createContext, ReactNode } from 'react'

export interface ModalProps {
	title: string
	children: ReactNode
	onOpen?(): void
	onClose?(): void
}

export interface ModalContext {
	enqueue(modal: ModalProps): void
	push(modal: ModalProps): void
	pop(): void
}

const defaultHanlder = () => {
	throw new Error('no modal context')
}

const defaultModalCtx: ModalContext = {
	enqueue: defaultHanlder,
	push: defaultHanlder,
	pop: defaultHanlder,
}

export const modalsCtx = createContext(defaultModalCtx)

export const ModalsProvider: React.FC = ({ children }) => {
	// The queue holds modals that will be displayed when the stack is clear
	const [queue, queueHandlers] = useListState<ModalProps>()
	const [stack, stackHandlers] = useListState<ModalProps>()

	const push = (modal: ModalProps) => {
		stackHandlers.append(modal)
		if (modal.onOpen) modal.onOpen()
	}

	const enqueue = (modal: ModalProps) => {
		if (stack.length === 0) return push(modal)
		queueHandlers.prepend(modal)
	}

	const pop = () => {
		const modal = stack[stack.length - 1]
		if (!modal) return

		stackHandlers.pop()
		if (modal?.onClose) modal.onClose()
		if (stack.length === 1 && queue.length > 0) {
			const modal = queue[queue.length - 1]!
			queueHandlers.pop()
			push(modal)
		}
	}

	const current = stack[stack.length - 1]

	return (
		<modalsCtx.Provider value={{ enqueue, push, pop }}>
			{current && (
				<Modal
					opened
					title={<Title order={3}>{current.title}</Title>}
					onClose={pop}
				>
					{current.children}
				</Modal>
			)}
			{children}
		</modalsCtx.Provider>
	)
}
