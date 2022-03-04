import { useViewportSize } from '@mantine/hooks'
import React, { useEffect, useRef } from 'react'

interface ShrinkwrapOptions {
	minHeight?: React.CSSProperties['minHeight']
	maxHeight?: React.CSSProperties['maxHeight']
}

const useShrinkwrap = <T extends HTMLElement>(shrink: boolean = true) => {
	const ref = useRef<T>(null)
	const viewportSize = useViewportSize()

	useEffect(() => {
		if (!ref.current || !shrink) return
		ref.current.style.height = '100%'
		const maxHeight = ref.current.offsetHeight
		ref.current.style.height = 'fit-content'
		const targetHeight = ref.current.offsetHeight
		ref.current.style.height = `${Math.min(maxHeight, targetHeight)}px`
	}, [ref.current, viewportSize, shrink])

	return ref
}

export default useShrinkwrap
