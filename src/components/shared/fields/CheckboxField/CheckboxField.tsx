import React, { forwardRef } from 'react';
import { FormControl, FormLabel, Input, FormErrorMessage, Checkbox } from '@chakra-ui/react';
import { ErrorMessage } from '@hookform/error-message';

export const CheckboxField = forwardRef<any, any>(function CheckboxField({ errors, name, label, ...rest }, ref) {
	return (
		<FormControl id={name} my={4} isInvalid={errors[name]}>
			<Checkbox name={name} ref={ref} errorBorderColor="red" {...rest}>
				{label}
			</Checkbox>
			<FormErrorMessage color="red">
				<ErrorMessage errors={errors} name={name} />
			</FormErrorMessage>
		</FormControl>
	);
});
