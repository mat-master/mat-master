import { Avatar, createStyles, useMantineTheme } from '@mantine/core'
import { useUncontrolled } from '@mantine/hooks'
import React, { useMemo } from 'react'
import { Pencil as EditIcon } from 'tabler-icons-react'
import { getPrimaryColor } from '../utils/get-colors'

export interface AvatarInputProps {
	value?: string | File | null
	defaultValue?: string | File
	onChange: (img: File) => void
	children?: React.ReactNode
}

const useStyles = createStyles((theme) => ({
	wrapper: { position: 'relative', overflow: 'hidden' },
	editOverlay: {
		position: 'absolute',
		inset: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: '50%',
		opacity: 0,
		backdropFilter: 'blur(1px)',
		backgroundColor: getPrimaryColor(theme),
		cursor: 'pointer',
		transition: `opacity 200ms ${theme.transitionTimingFunction}`,
		'&:hover': { opacity: 1 },
	},
}))

const AvatarInput = React.forwardRef<HTMLInputElement, AvatarInputProps>(
	({ children, value: controlledValue, defaultValue, onChange }) => {
		const theme = useMantineTheme()
		const { classes } = useStyles()
		const [value, setValue] = useUncontrolled({
			value: controlledValue,
			finalValue: null,
			defaultValue,
			onChange,
			rule: (value) => typeof value === 'string' || value instanceof File || value === null,
		})

		let src: string | undefined
		src = useMemo(() => {
			if (src) URL.revokeObjectURL(src)
			if (value instanceof File) return URL.createObjectURL(value)
		}, [value])

		return (
			<label className={classes.wrapper}>
				<input
					type='file'
					accept='image/*'
					style={{ display: 'none' }}
					onChange={(e) => setValue(e.target.files?.item(0) ?? null)}
				/>
				<Avatar src={src} size='xl' radius={128} color={theme.primaryColor}>
					{children}
				</Avatar>
				<div className={classes.editOverlay}>
					<EditIcon size={32} color={theme.white} />
				</div>
			</label>
		)
	}
)

export default AvatarInput
