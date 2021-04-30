import React, { forwardRef } from 'react';
import { FormControl, FormLabel, FormErrorMessage, Textarea } from '@chakra-ui/react';
import { ErrorMessage } from '@hookform/error-message';

export const TextareaField = forwardRef<any, any>(function InputField({ errors, name, label }, ref) {
	return (
		<FormControl id={name} my={4} isInvalid={errors[name]}>
			<FormLabel>{label}</FormLabel>
			<Textarea name={name} ref={ref} errorBorderColor="red" />
			<FormErrorMessage color="red">
				<ErrorMessage errors={errors} name={name} />
			</FormErrorMessage>
		</FormControl>
	);
});
