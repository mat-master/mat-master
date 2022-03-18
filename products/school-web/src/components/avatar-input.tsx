import { Avatar, createStyles, useMantineTheme } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Pencil as EditIcon } from 'tabler-icons-react'
import { getPrimaryColor } from '../utils/get-colors'

export interface AvatarInputProps {
	initialValue?: string
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

const AvatarInput: React.FC<AvatarInputProps> = ({ children, initialValue, onChange }) => {
	const theme = useMantineTheme()
	const { classes } = useStyles()
	const [src, setSrc] = useState(initialValue)

	useEffect(() => {
		if (!src) setSrc(initialValue)
	}, [initialValue])

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const file = e.target.files?.item(0)
		if (!file) return

		if (src) URL.revokeObjectURL(src)
		setSrc(URL.createObjectURL(file))
		onChange(file)
	}

	return (
		<label className={classes.wrapper}>
			<input type='file' accept='image/*' style={{ display: 'none' }} onChange={handleChange} />
			<Avatar src={src} size='xl' radius={128} color={theme.primaryColor}>
				{children}
			</Avatar>
			<div className={classes.editOverlay}>
				<EditIcon size={32} color={theme.white} />
			</div>
		</label>
	)
}

export default AvatarInput
