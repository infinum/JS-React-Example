# Datx React RFC

We can build this lib upon `stale-while-revalidate` pattern and [SWR](https://swr.vercel.app/).

Inspired by:
- [Apollo Cleant Hooks](https://www.apollographql.com/docs/react/api/react/hooks/)
- [React Query](https://react-query.tanstack.com/guides/ssr)
- [Kurier](https://kurier.readthedocs.io/en/latest/#kurier)
- [Orbit.js](https://orbitjs.com/v0.16/guide/querying-data.html)
- [REst Hooks](https://resthooks.io/)

## The `DatxProvider` component

The `DatxProvider` component leverages [React's Context API](https://reactjs.org/docs/context.html) to make a configured Datx Client instance available throughout a React component tree. This component can be imported directly from the `@datx/react` package.

```js
import { DatxClient } from '@datx/client';
import { DatxProvider } from '@datx/react';
```

### Props

| Option   | Type                       | Description                 |
| -------- | -------------------------- | --------------------------- |
| `client` | DatxClient                 | An `DatxClient` instance. |

### Example

```jsx
const client = new DatxClient({
  uri: "http://localhost:4000/api/v1"
});

ReactDOM.render(
  <DatxProvider client={client}>
    <MyRootComponent />
  </DatxProvider>,
  document.getElementById('root'),
);
```

## The `DatxConsumer` component

One way to access the configured Datx Client instance directly is to create an `DatxConsumer` component and provide a render prop function as its child. The render prop function will be called with your `DatxClient` instance as its only argument. You can think of the `DatxConsumer` component as similar to the `Consumer` component from the [React Context API](https://reactjs.org/docs/context.html).

### Example

```jsx
import React from 'react';
import { DatxConsumer } from '@datx/react';

const WithClientClient = () => (
  <DatxConsumer>
    {client => 'We have access to the client!' /* do stuff here */}
  </DatxConsumer>
);
```

## Query data

### QueryExpression

```ts
type QueryOperation = 'findRecord' | 'findRecords' | 'findRelatedRecord' | 'findRelatedRecords';
type RecordIdentity = Record | { type: string, id: string };

interface QueryExpression {
  op: QueryOperation;
}

interface FindRecord extends QueryExpression {
  op: "findRecord";
  record: RecordIdentity;
}

interface FindRelatedRecord extends QueryExpression {
  op: "findRelatedRecord";
  record: RecordIdentity;
  relationship: string;
}

interface FindRelatedRecords extends QueryExpression {
  op: "findRelatedRecords";
  record: RecordIdentity;
  relationship: string;
  sort?: SortSpecifier[];
  filter?: FilterSpecifier[];
  page?: PageSpecifier;
}

interface FindRecords extends QueryExpression {
  op: "findRecords";
  type?: string;
  sort?: SortSpecifier[];
  filter?: FilterSpecifier[];
  page?: PageSpecifier;
}
```

```ts
export type SortOrder = "ascending" | "descending";

export interface SortSpecifier {
  kind: string;
  order: SortOrder;
}

export interface AttributeSortSpecifier extends SortSpecifier {
  kind: "attribute";
  attribute: string;
}

export type ComparisonOperator = "equal" | "gt" | "lt" | "gte" | "lte";

export interface FilterSpecifier {
  op: ComparisonOperator;
  kind: string;
}

export interface AttributeFilterSpecifier extends FilterSpecifier {
  kind: "attribute";
  attribute: string;
  value: any;
}

export interface PageSpecifier {
  kind: string;
}

export interface OffsetLimitPageSpecifier extends PageSpecifier {
  kind: "offsetLimit";
  offset?: number;
  limit?: number;
}
```

### QueryBuilder

```ts
// Find a single record by identity
const QUERY_BOOK = query(q => q.findRecord({ type: "books", id: "1" }));

// Find all records by type
const QUERY_BOOKS = query(q => q.findRecords("books"));

// Find a related record in a to-one relationship
const QUERY_BOOK_AUTHOR = query(q => q.findRelatedRecord({ type: "authors", id: "1" }, "books"));

// Find related records in a to-many relationship
const QUERY_AUTHOR_BOOKS = query(q =>
  q.findRelatedRecords({ type: "books", id: "1" }, "authors")
);
```

### findRelatedRecords vs findRecords.filter({ relation: …, record: … })

```ts
const relatedRecordId = { type: 'books', id: '1' };

// This fetches from: /books/1/authors
query(q => q.findRelatedRecords(relatedRecordId, 'authors'));

// This fetches from: /authors?filter[books]=1
query(q => q.findRecords('authors')).filter({ relation: 'books', record: relatedRecordId });
```

### Passing variables

```ts
const queryBookFn = query({
  op: "findRecord",
  record: (variables) => ({ type: 'books', id: variables.id }),
});

// This fetches from /books/1
queryBookFn({ id: '1' });

```

### OperationProcessor

`OperationProcessor` knows how to transform expression to actual API call.

#### Example `JsonApiOperationProcessor`

```jsx
const client = new DatxClient({
  uri: "http://localhost:4000/api/v1",
  operationProcessor: JsonApiOperationProcessor,
});
```

## `useQuery`

### Example

```jsx
import { query, useQuery } from '@datx/react';

// This fetches from /books?filter[language]=english
const QUERY_BOOKS = query({
  op: "findRecords",
  type: 'books',
  filter: (variables) => ({
    kind: 'attribute',
    attribute: 'language',
    value: variables.language,
  })
});

function Books() {
  const { data: books } = useQuery(QUERY_BOOKS, {
    variables: { language: 'english' },
  });

  if (!books) {
    return <p>Loading ...</p>;
  }

  return books.map((book) => <p>Name: {book.title}</p>;
}
```

### Function Signature

```ts
function useQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentQuery,
  options?: QueryHookOptions<TData, TVariables>,
): QueryResult<TData, TVariables> {}
```

### Params

#### `query`

TODO - description
- memoized
- returns function similar to emotion `css`

| Param   | Type         | Description                                                   |
| ------- | ------------ | ------------------------------------------------------------- |
| `query` | DocumentQuery | A URL query constructed by `QueryBuilder`. |

#### `options`

| Option   | Type         | Description                                                   |
| ------- | ------------ | ------------------------------------------------------------- |
| variables | { [key: string]: any } | An object containing all of the variables your query needs to execute |
| skip | boolean | If skip is true, the query will be skipped entirely. Useful for lazy fetching |
| client | DatxClient | An DatxClient instance. By default useQuery / Query uses the client passed down via context, but a different client can be passed in. |
| SWR options | | https://swr.vercel.app/docs/options#options|

### Result

TODO


## useLazyQuery

### Example

```jsx
import { query, useQuery } from '@datx/react';

// This fetches from /books?filter[language]=english
const QUERY_BOOKS = query({
  op: "findRecords",
  type: 'books',
  filter: (variables) => ({
    kind: 'attribute',
    attribute: 'language',
    value: variables.language,
  })
});

function Books() {
  const [loadBooks, { called, loading, data }] = useLazyQuery(QUERY_BOOKS, {
    variables: { language: 'english' },
  });

  if (called && loading) return <p>Loading ...</p>

  if (!called) {
    return <button onClick={() => loadBooks()}>Load books</button>
  }
  return books.map((book) => <p>Name: {book.title}</p>;
}
```

## useResource
For fetching single resource

Example
```ts
function useResources<TModel extends Resource = Resource, TMeta extends object = object>(
	queryResources: QueryResources<TModel>,
	config?: ConfigInterface<Response<TModel>, Response<TModel>, fetcherFn<Response<TModel>>>
): {
	data: TModel;
	error: IError[] | Error;
	isValidating: boolean;
	meta: TMeta;
	links: Record<string, ILink> | undefined;
}
```

## useResources
For fetching resource list

Example:
```ts
function useResources<TModel extends Resource = Resource, TMeta extends object = object>(
	queryResources: QueryResources<TModel>,
	config?: ConfigInterface<Response<TModel>, Response<TModel>, fetcherFn<Response<TModel>>>
): {
	data: TModel[];
	error: IError[] | Error;
	isValidating: boolean;
	meta: TMeta;
	links: Record<string, ILink> | undefined;
	first?: () => Promise<Response>;
	prev?: () => Promise<Response>;
	next?: () => Promise<Response>;
	last?: () => Promise<Response>;
}
```

## useCache

Excellent to use data in the normalized cache without fetching.

- On Error (404, 500, etc):
  - Returns previously cached if exists
  - null otherwise
- While loading:
  - Returns previously cached if exists
  - null otherwise

Example:
```ts
function useCache<TModel extends Resource = Resource, TMeta extends object = object>(
	queryResources: QueryResources<TModel>,
	config?: ConfigInterface<Response<TModel>, Response<TModel>, fetcherFn<Response<TModel>>>
): {
	data: TModel | TModel[];
	error: IError[] | Error;
	isValidating: boolean;
	meta: TMeta;
	links: Record<string, ILink> | undefined;
}
```

## Mutate data

### Operations

Operations each represent a single change to a record or relationship (e.g. adding a record, updating a field, deleting a relationship, etc.).

```ts
type MutateOperation = 'addRecord' | 'updateRecord' | 'removeRecord' | 'replaceKey' | 'replaceAttribute' | 'addToRelatedRecords' | 'removeFromRelatedRecords' | 'replaceRelatedRecords' | 'replaceRelatedRecord';

interface Operation {
  op: MutateOperation;
}

interface AddRecordOperation extends Operation {
  op: "addRecord";
  record: Record;
}

interface UpdateRecordOperation extends Operation {
  op: "updateRecord";
  record: Record;
}

interface RemoveRecordOperation extends Operation {
  op: "removeRecord";
  record: RecordIdentity;
}

interface ReplaceKeyOperation extends Operation {
  op: "replaceKey";
  record: RecordIdentity;
  key: string;
  value: string;
}

interface ReplaceAttributeOperation extends Operation {
  op: "replaceAttribute";
  record: RecordIdentity;
  attribute: string;
  value: any;
}

interface AddToRelatedRecordsOperation extends Operation {
  op: "addToRelatedRecords";
  record: RecordIdentity;
  relationship: string;
  relatedRecord: RecordIdentity;
}

interface RemoveFromRelatedRecordsOperation extends Operation {
  op: "removeFromRelatedRecords";
  record: RecordIdentity;
  relationship: string;
  relatedRecord: RecordIdentity;
}

interface ReplaceRelatedRecordsOperation extends Operation {
  op: "replaceRelatedRecords";
  record: RecordIdentity;
  relationship: string;
  relatedRecords: RecordIdentity[];
}

interface ReplaceRelatedRecordOperation extends Operation {
  op: "replaceRelatedRecord";
  record: RecordIdentity;
  relationship: string;
  relatedRecord: RecordIdentity;
}
```

### `useMutate`

```jsx
import { mutate, useMutation } from '@datx/client';

const ADD_TODO = mutate({
  op: 'addRecord',
  record: {
    type: "todo",
    id: "1",
    attributes: {
      title: (variables) => variables.title,
    }
  }
});

function AddTodo() {
  let input;
  const [addTodo, { data }] = useMutation(ADD_TODO);

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addTodo({ variables: { title: input.value } });
          input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}
```

### Mutation builder

```jsx
const ADD_TODO = mutate((mutation, variables) => mutation.addRecord({
  type: "todo",
  id: "1",
  attributes: {
    title: variables.title,
  }
});
```

To perform more than one operation in a single mutation, just return an array of operations:

```jsx
const ADD_MULTIPLE_TODOS = mutate((m) => [m.addRecord(todoOne), m.addRecord(todoTwo)]);
```

### Bound mutation form `useQuery`

```jsx
import { mutate, query, useQuery } from '@datx/client';

const QUERY_BOOK = query({
  op: "findRecord",
  record: { type: 'book', id: '1' }
});

const UPDATE_BOOK = mutate({
  op: "updateRecord",
  record: {
    type: 'book',
    id: '1',
    attributes: {
      title: (variables) => variables.title,
    },
  }
});

function Books() {
  const { data: book, mutate: updateBook } = useQuery(QUERY_BOOK);

  if (!book) {
    return <p>Loading ...</p>;
  }

  return (
    <div>
      <p>Book Title: {book.title}</p>
      <form
        onSubmit={e => {
          e.preventDefault();
          updateBook(
            UPDATE_BOOK,
            {
              variables: {
                title: input.value
              },
              optimisticResponse: true // optimistically update the UI
            }
          );
          input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}
```

## `useDatxClient`

### Example

```jsx
import { useDatxClient } from '@datx/react';

function SomeComponent() {
  const client = useDatxClient();
  // `client` is now set to the `DatxClient` instance being used by the
  // application (that was configured using something like `DatxProvider`)
}
```

### Function Signature

```ts
function useDatxClient(): DatxClient<object> {}
```

### Result

| Param                  | Type                       | Description                                                |
| ---------------------- | -------------------------- | ---------------------------------------------------------- |
| Datx Client instance | DatxClient&lt;object&gt; | The `DatxClient` instance being used by the application. |

## SSR with Next.js

### Using initialData

```tsx
export async function getStaticProps() {
  const client = new DatxClient();

  try {
    /**
     * fetchQuery is an asynchronous method that can be used to fetch and cache a query. It will either
     * resolve with the data or throw with the error. Use the prefetchQuery method if you just want to fetch a
     * query without needing the result.
     */
    const books = await client.fetchQuery(QUERY_BOOKS)
  } catch (error) {
    console.log(error)
  }

   return { props: { books } }
 }

function Books(props) {
  const { data: books } = useQuery(QUERY_BOOKS, {
    initialData: props.books
  });

  // ...
}
```

### Using Hydration

```jsx
// _app.jsx
import { DatxClient } from '@datx/client';
import { DatxProvider } from '@datx/react';
import { Hydrate } from '@datx/hydration';

const client = new DatxClient();

export default function MyApp({ Component, pageProps }) {
  return (
    <DatxProvider client={client}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </DatxProvider>
  )
}
```

```jsx
// pages/books.jsx
import { DatxClient } from '@datx/client';
import { useQuery } from '@datx/react';
import { dehydrate } from '@datx/hydration';

export async function getStaticProps() {
  const client = new DatxClient();

  /**
  * prefetchQuery is an asynchronous method that can be used to prefetch a query before it is needed or
  * rendered with useQuery and friends. The method works the same as fetchQuery except that is will not throw
  * or return any data.
  */
  await client.prefetchQuery(QUERY_BOOKS)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

function Books() {
  // This useQuery could just as well happen in some deeper child to
  // the "Books"-page, data will be available immediately either way
  const { data } = useQuery(QUERY_BOOKS);

  // This query was not prefetched on the server and will not start
  // fetching until on the client, both patterns are fine to mix
  const { data: otherData } = useQuery(QUERY_OTHER_DATA);

  // ...
}
 ```

### Enhancements

#### Array of operations

Inspired with atomic operations we could also implement array of `QueryExpressions` and trigger multiple API calls in parallel.
https://jsonapi.org/ext/atomic/


```jsx
const QUERY_BOOK = query([
  {
    op: "findRecord",
    record: {
      type: 'book',
      id: '1'
    }
  },
  {
    op: 'findRecords',
    type: 'authors',
    filter: {
      kind: 'attribute',
      attribute: 'book',
      value: '1',
    }
  }
]);
```

This `query` will make two requests in the background:
1. `/books/1`
1. `/authors?filter[books]=1`

### Result
TODO: result signature

## TODO
- [ ] Dependable operations ???
- [ ] React Server Components example
- [ ] Pagination examples
- [ ] Suspense
