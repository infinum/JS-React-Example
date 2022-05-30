import React, { forwardRef } from 'react';
import { FormControl, FormLabel, FormErrorMessage, Textarea } from '@chakra-ui/react';
import { ErrorMessage } from '@hookform/error-message';

export const TextareaField = forwardRef<any, any>(function InputField({ errors, name, label, ...rest }, ref) {
	return (
		<FormControl my={4} id={name} isInvalid={errors[name]}>
			<FormLabel>{label}</FormLabel>
			<Textarea ref={ref} errorBorderColor="red" name={name} {...rest} />
			<FormErrorMessage color="red">
				<ErrorMessage errors={errors} name={name} />
			</FormErrorMessage>
		</FormControl>
	);
});
