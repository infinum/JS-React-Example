import { createContext, FC } from 'react';
import { SWRConfig } from 'swr';
import { Client } from './Client';

import { compare } from './utils';

export const DatxContext = createContext<Client>(null);

interface IDatxProviderProps {
	client: Client;
}

export const DatxProvider: FC<IDatxProviderProps> = ({ client, children }) => {
	return (
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
};
