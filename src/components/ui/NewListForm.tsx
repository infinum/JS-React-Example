import styled from '@emotion/styled';
import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const Title = styled.h1``;

const Error = styled.p`
	padding: 4px 8px;
	color: red;
`;

interface INewListFormProps {
	onSubmit({ title }: { title: string }): Promise<void>;
	apiErrors?: string;
}

export const NewListForm = ({ onSubmit, apiErrors }: INewListFormProps): ReactElement => {
	const { handleSubmit, register, errors } = useForm();
	const { t } = useTranslation();

	return (
		<>
			<Title>{t('addNewTodoList')}</Title>
			<form onSubmit={handleSubmit(onSubmit)}>
				{apiErrors && <Error>{apiErrors}</Error>}

				<input
					name="title"
					ref={register({
						required: 'Required',
					})}
				/>

				{errors.title && <Error>{errors.title.message}</Error>}

				<button type="submit">{t('addList')}</button>
			</form>
		</>
	);
};
