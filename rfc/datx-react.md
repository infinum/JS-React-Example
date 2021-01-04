# Datx React RFC

We can build this lib upon `stale-while-revalidate` pattern and [SWR](https://swr.vercel.app/).

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

```jsx{7-9}
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

## query

TODO - description
- memoized
- returns function similar to emotion `css`

```ts
```

### QueryExpression

```ts
type Operation = 'findRecord' | 'findRecords' | 'findRelatedRecord' | 'findRelatedRecords';
type RecordIdentity = Record | { type: string, id: string };

interface QueryExpression {
  op: Operation;
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
	op: "fetchRecord",
	record: (variables) => ({ type: 'books', id: variables.id }),
});

// This fetches from /books/1
queryBookFn({ id: '1' });

```

## `useQuery`

### Example

```jsx
import { query, useQuery } from '@datx/react';

// This fetches from /books?filter[language]=english
const QUERY_BOOKS = query({
	op: "fetchRecords",
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
	op: "fetchRecords",
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

## `useMutation`

TODO
<!-- ### Example

```jsx
import { gql, useMutation } from '@apollo/client';

const ADD_TODO = gql`
  mutation AddTodo($type: String!) {
    addTodo(type: $type) {
      id
      type
    }
  }
`;

function AddTodo() {
  let input;
  const [addTodo, { data }] = useMutation(ADD_TODO);

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addTodo({ variables: { type: input.value } });
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

### Function Signature

```ts
function useMutation<TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode,
  options?: MutationHookOptions<TData, TVariables>,
): MutationTuple<TData, TVariables> {}
```

### Params

#### `mutation`

| Param      | Type         | Description                                                      |
| ---------- | ------------ | ---------------------------------------------------------------- |
| `mutation` | DocumentNode | A GraphQL mutation document parsed into an AST by `gql`. |

#### `options`

### Result -->

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
	*	prefetchQuery is an asynchronous method that can be used to prefetch a query before it is needed or
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
