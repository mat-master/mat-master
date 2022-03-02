import { useSetState } from '@mantine/hooks';
import { useMemo } from 'react';
import getErrorMessage from '../utils/get-error-message';

interface PromiseState<T> {
	loading: boolean;
	value?: T;
	error?: string;
}

const usePromise = <T>(factory: () => Promise<T>, dependancies: any[]) => {
	const [result, setResult] = useSetState<PromiseState<T>>({ loading: true });

	useMemo(() => {
		setResult({ loading: true });
		factory()
			.then((value) => setResult({ loading: false, value }))
			.catch((error) => setResult({ loading: false, error: getErrorMessage(error) }));
	}, dependancies);

	return result;
};

export default usePromise;
