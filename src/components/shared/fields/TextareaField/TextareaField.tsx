import { FormControl, FormErrorMessage, FormLabel, Textarea, TextareaProps, forwardRef } from '@chakra-ui/react';
import { ErrorMessage } from '@hookform/error-message';
import { FieldErrors } from 'react-hook-form';

interface ITextareaFieldProps extends TextareaProps {
	errors: FieldErrors;
	name: string;
	label: string;
}

export const TextareaField = forwardRef<ITextareaFieldProps, 'textarea'>(function InputField(
	{ errors, name, label, ...rest },
	ref
) {
	return (
		<FormControl my={4} id={name} isInvalid={Boolean(errors[name])}>
			<FormLabel>{label}</FormLabel>
			<Textarea ref={ref} errorBorderColor="red" name={name} {...rest} />
			<FormErrorMessage color="red">
				<ErrorMessage errors={errors} name={name} />
			</FormErrorMessage>
		</FormControl>
	);
});
