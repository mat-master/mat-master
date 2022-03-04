import { useViewportSize } from '@mantine/hooks'
import { useEffect, useRef } from 'react'

const useShrinkwrap = <T extends HTMLElement>() => {
	const ref = useRef<T>(null)
	const viewportSize = useViewportSize()

	useEffect(() => {
		console.log('shrink-wrapping')
		if (!ref.current) return
		ref.current.style.height = '100%'
		const maxHeight = ref.current.offsetHeight
		ref.current.style.height = 'fit-content'
		const targetHeight = ref.current.offsetHeight
		ref.current.style.height = `${Math.min(maxHeight, targetHeight)}px`
	}, [ref.current, viewportSize])

	return ref
}

export default useShrinkwrap
