import { ActionIcon, Avatar, createStyles, useMantineTheme } from '@mantine/core'
import { useUncontrolled } from '@mantine/hooks'
import React, { useMemo, useRef } from 'react'
import { Pencil as EditIcon } from 'tabler-icons-react'

export interface AvatarInputProps {
	value?: string | File | null
	defaultValue?: string | File
	onChange: (img: File) => void
	children?: React.ReactNode
}

const useStyles = createStyles((theme) => ({
	editIcon: {
		position: 'absolute',
		right: -6,
		bottom: -6,
	},
}))

const AvatarInput = React.forwardRef<HTMLInputElement, AvatarInputProps>(
	({ children, value: controlledValue, defaultValue, onChange }) => {
		const inputRef = useRef<HTMLInputElement>(null)
		const theme = useMantineTheme()
		const [value, setValue] = useUncontrolled({
			value: controlledValue,
			finalValue: null,
			defaultValue,
			onChange,
			rule: (value) =>
				typeof value === 'string' || value instanceof File || value === null,
		})

		let src: string | undefined
		src = useMemo(() => {
			if (src) URL.revokeObjectURL(src)
			if (value instanceof File) return URL.createObjectURL(value)
		}, [value])

		return (
			<div style={{ position: 'relative' }}>
				<input
					ref={inputRef}
					type='file'
					accept='image/*'
					style={{ display: 'none' }}
					onChange={(e) => setValue(e.target.files?.item(0) ?? null)}
				/>
				<Avatar
					src={src}
					size='xl'
					radius='lg'
					color={theme.primaryColor}
					styles={{ root: { overflow: 'hidden' } }}
				>
					{children}
				</Avatar>
				<ActionIcon
					size='md'
					variant='filled'
					color={theme.primaryColor}
					onClick={() => inputRef.current?.click()}
					style={{
						position: 'absolute',
						right: -6,
						bottom: -6,
					}}
				>
					<EditIcon size={18} />
				</ActionIcon>
			</div>
		)
	}
)

export default AvatarInput
