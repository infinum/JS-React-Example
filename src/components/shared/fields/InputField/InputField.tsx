import { FormControl, FormErrorMessage, FormLabel, Input, InputProps, forwardRef } from '@chakra-ui/react';
import { ErrorMessage } from '@hookform/error-message';
import { FieldErrors } from 'react-hook-form';

export interface IInputField extends InputProps {
	label: string;
	errors?: FieldErrors;
	name: string;
}

export const InputField = forwardRef<IInputField, 'input'>(function InputField({ errors, name, label, ...rest }, ref) {
	return (
		<FormControl id={name} isInvalid={Boolean(errors?.[name])}>
			<FormLabel htmlFor={name}>{label}</FormLabel>
			<Input ref={ref} name={name} {...rest} />
			<FormErrorMessage color="red">
				<ErrorMessage errors={errors} name={name} />
			</FormErrorMessage>
		</FormControl>
	);
});
