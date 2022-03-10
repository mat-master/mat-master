import axios from 'axios'
import { useQuery } from 'react-query'
import type { SchemaOf } from 'yup'

const useRemoteResource = <T>(path: string, resourceSchema: SchemaOf<T>, data?: T) =>
	useQuery(path, async () => {
		const res = await (data ? axios.post(path, data) : axios.get(path))
		if (res.status !== 200) throw res.data.error

		const resource = resourceSchema.cast(res.data)
		if (await resourceSchema.validate(resource)) return resource as T
		throw new Error("Couldn't cast response to fit resource schema")
	})

export default useRemoteResource
