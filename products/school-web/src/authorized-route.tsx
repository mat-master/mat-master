import { useLocalStorageValue } from '@mantine/hooks'
import axios from 'axios'
import type React from 'react'
import { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { Outlet, useNavigate } from 'react-router'

const AuthorizedRoute: React.FC = () => {
	const [jwt] = useLocalStorageValue({ key: 'jwt' })
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	useEffect(() => {
		if (!jwt) {
			delete axios.defaults.headers.common.Authorization
			navigate('/sign-in')
		} else {
			axios.defaults.headers.common.Authorization = `Bearer ${jwt}`
		}

		// queryClient.invalidateQueries('me')
	}, [jwt])

	return <Outlet />
}

export default AuthorizedRoute
