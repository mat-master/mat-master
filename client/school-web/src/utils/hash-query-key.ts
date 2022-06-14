import { QueryKey } from 'react-query'
import { serialize } from 'superjson'

export const hashQueryKey = (key: QueryKey) => JSON.stringify(serialize(key))
