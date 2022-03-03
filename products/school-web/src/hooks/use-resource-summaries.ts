import { useEffect, useState } from 'react';
import type { RemoteResource, ResourceContext } from '../data/resource-provider';

interface SummariesResult<S extends RemoteResource> {
	loading: boolean;
	summaries?: S[];
	error?: string;
}

const useResourceSummaries = <S extends RemoteResource>(
	ctx: ResourceContext<any, S>
): SummariesResult<S> => {
	const [error, setError] = useState<string>();
	const { summaries } = ctx;

	useEffect(() => {
		ctx.getSummaries().catch((error) => {
			if (error instanceof Error) setError(error.message);
			if (typeof error === 'string') setError(error);
		});
	}, []);

	if (!summaries && !error) return { loading: true };
	if (summaries) return { loading: false, summaries };
	return { loading: false, error: error ?? 'An unknown error occurred' };
};

export default useResourceSummaries;
