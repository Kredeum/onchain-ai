import {
  replaceEqualDeep,
  createInfiniteQuery as tanstack_createInfiniteQuery,
  createQuery as tanstack_createQuery,
  type CreateInfiniteQueryOptions,
  type CreateInfiniteQueryResult,
  type CreateMutationOptions,
  type CreateQueryOptions,
  type DefaultError,
  type MutationObserverResult,
  type QueryKey,
  type QueryObserverResult,
  type StoreOrVal
} from "@tanstack/svelte-query";
import { deepEqual, type Compute, type ExactPartial, type Omit } from "@wagmi/core/internal";
import { hashFn } from "@wagmi/core/query";
import { derived, get, type Readable } from "svelte/store";

type LooseOmit<type, keys extends string> = Pick<type, Exclude<keyof type, keys>>;

export type CreateMutationParameters<
  data = unknown,
  error = Error,
  variables = void,
  context = unknown
> =
  CreateMutationOptions<data, error, Compute<variables>, context> extends Readable<infer T>
    ? Readable<LooseOmit<T, "mutationFn" | "mutationKey" | "throwOnError">>
    : Omit<
        CreateMutationOptions<data, error, Compute<variables>, context>,
        "mutationFn" | "mutationKey" | "throwOnError"
      >;

export type CreateMutationReturnType<
  data = unknown,
  error = Error,
  variables = void,
  context = unknown
> = Compute<Omit<MutationObserverResult<data, error, variables, context>, "mutate">>;

////////////////////////////////////////////////////////////////////////////////

export type CreateQueryParameters<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryKey extends QueryKey = QueryKey
> = Compute<
  ExactPartial<Omit<CreateQueryOptions<queryFnData, error, data, queryKey>, "initialData">> & {
    // Fix `initialData` type
    initialData?: CreateQueryOptions<queryFnData, error, data, queryKey>["initialData"] | undefined;
  }
>;

export type CreateQueryReturnType<data = unknown, error = DefaultError> = Compute<
  Readable<
    QueryObserverResult<data, error> & {
      queryKey: QueryKey;
    }
  >
>;

// Adding some basic customization.
// Ideally we don't have this function, but `import('@tanstack/svelte-query').createQuery` currently has some quirks where it is super hard to
// pass down the inferred `initialData` type because of it's discriminated overload in the on `createQuery`.
export function createQuery<queryFnData, error, data, queryKey extends QueryKey>(
  parameters: StoreOrVal<
    CreateQueryParameters<queryFnData, error, data, queryKey> & {
      queryKey: QueryKey;
    }
  >
): CreateQueryReturnType<data, error> {
  // check if `parameters` is a store
  if ("subscribe" in parameters) {
    const result = tanstack_createQuery(
      derived(parameters, ($parameters) => {
        return {
          ...$parameters,
          queryKeyHashFn: hashFn // for bigint support
        } as any;
      })
    ) as CreateQueryReturnType<data, error>;

    return derived(result, (data) => ({
      ...data,
      queryKey: get(parameters).queryKey
    }));
  }

  const result = tanstack_createQuery({
    ...(parameters as any),
    queryKeyHashFn: hashFn // for bigint support
  }) as CreateQueryReturnType<data, error>;
  return derived(result, (data) => ({
    ...data,
    queryKey: parameters.queryKey
  }));
}

////////////////////////////////////////////////////////////////////////////////

export type CreateInfiniteQueryParameters<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryData = queryFnData,
  queryKey extends QueryKey = QueryKey,
  pageParam = unknown
> = Compute<
  Omit<
    CreateInfiniteQueryOptions<queryFnData, error, data, queryData, queryKey, pageParam>,
    "initialData"
  > & {
    // Fix `initialData` type
    initialData?:
      | CreateInfiniteQueryOptions<queryFnData, error, data, queryKey>["initialData"]
      | undefined;
  }
>;

export type CreateInfiniteQueryReturnType<
  data = unknown,
  error = DefaultError
> = CreateInfiniteQueryResult<data, error> & {
  queryKey: QueryKey;
};

// Adding some basic customization.
export function createInfiniteQuery<queryFnData, error, data, queryKey extends QueryKey>(
  parameters: StoreOrVal<
    CreateInfiniteQueryParameters<queryFnData, error, data, queryKey> & {
      queryKey: QueryKey;
    }
  >
): CreateInfiniteQueryReturnType<data, error> {
  const { queryKey, ...rest } = parameters as any;
  const result = tanstack_createInfiniteQuery({
    ...rest,
    queryKeyHashFn: hashFn // for bigint support
  }) as CreateInfiniteQueryReturnType<data, error>;
  return {
    ...result,
    queryKey
  };
}

////////////////////////////////////////////////////////////////////////////////

export function structuralSharing<data>(oldData: data | undefined, newData: data): data {
  if (deepEqual(oldData, newData)) return oldData as data;
  return replaceEqualDeep(oldData, newData);
}
