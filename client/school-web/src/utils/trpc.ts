// trpc-helper.ts
import type { Router } from '@mat-master/api'
import { createReactQueryHooks } from '@trpc/react'
import type {
	inferProcedureInput,
	inferProcedureOutput,
	inferSubscriptionOutput,
} from '@trpc/server'

export const trpc = createReactQueryHooks<Router>()

export type TQuery = keyof Router['_def']['queries']

export type TMutation = keyof Router['_def']['mutations']

export type TSubscription = keyof Router['_def']['subscriptions']

export type InferQueryResult<TRouteKey extends TQuery> = inferProcedureOutput<
	Router['_def']['queries'][TRouteKey]
>

export type InferQueryParams<TRouteKey extends TQuery> = inferProcedureInput<
	Router['_def']['queries'][TRouteKey]
>

export type InferMutationResult<TRouteKey extends TMutation> = inferProcedureOutput<
	Router['_def']['mutations'][TRouteKey]
>

export type InferMutationParams<TRouteKey extends TMutation> = inferProcedureInput<
	Router['_def']['mutations'][TRouteKey]
>

export type InferSubscriptionResult<TRouteKey extends TSubscription> =
	inferProcedureOutput<Router['_def']['subscriptions'][TRouteKey]>

export type InferAsyncSubscriptionResult<TRouteKey extends TSubscription> =
	inferSubscriptionOutput<Router, TRouteKey>

export type InferSubscriptionParams<TRouteKey extends TSubscription> =
	inferProcedureInput<Router['_def']['subscriptions'][TRouteKey]>
