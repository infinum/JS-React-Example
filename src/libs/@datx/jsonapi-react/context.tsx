import { createContext, FC, ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { Client } from './Client';

import { compare } from './utils';

export const DatxContext = createContext<Client>(null);

interface IDatxProviderProps {
	client: Client;
	children?: ReactNode;
}

export const DatxProvider: FC<IDatxProviderProps> = ({ client, children }) => (
	<DatxContext.Provider value={client}>
		<SWRConfig
			value={{
				compare,
			}}
		>
			{children}
		</SWRConfig>
	</DatxContext.Provider>
);
