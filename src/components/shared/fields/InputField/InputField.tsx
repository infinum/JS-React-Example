import React from 'react';
import { FormControl, FormLabel, Input, FormErrorMessage, InputProps, forwardRef } from '@chakra-ui/react';
import { ErrorMessage } from '@hookform/error-message';
import { FieldValues } from 'react-hook-form';

export interface IInputField extends InputProps {
	label: string;
	errors?: FieldValues;
}

export const InputField = forwardRef<IInputField, 'input'>(function InputField({ errors, name, label, ...rest }, ref) {
	return (
		<FormControl id={name} isInvalid={errors[name]}>
			<FormLabel htmlFor={name}>{label}</FormLabel>
			<Input ref={ref} errorBorderColor="red" name={name} {...rest} />
			<FormErrorMessage color="red">
				<ErrorMessage errors={errors} name={name} />
			</FormErrorMessage>
		</FormControl>
	);
});
