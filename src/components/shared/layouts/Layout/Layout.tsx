import { FC, ReactNode } from 'react';

export interface ILayout {
	children?: ReactNode;
}

export const Layout: FC<ILayout> = ({ children }) => {
	return <div>{children}</div>;
};
