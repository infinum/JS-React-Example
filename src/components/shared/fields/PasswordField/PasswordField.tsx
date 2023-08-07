import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	forwardRef,
	IconButton,
	Input,
	InputGroup,
	InputProps,
	InputRightElement,
	useDisclosure,
	useMergeRefs,
} from '@chakra-ui/react';
import { ErrorMessage } from '@hookform/error-message';
import { useRef } from 'react';
import { FieldErrors } from 'react-hook-form';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export interface IPasswordField extends InputProps {
	label: string;
	errors?: FieldErrors;
	name: string;
}

export const PasswordField = forwardRef<IPasswordField, 'input'>(({ label, errors, name, id, ...rest }, ref) => {
	const { isOpen, onToggle } = useDisclosure();
	const inputRef = useRef<HTMLInputElement>(null);

	const mergeRef = useMergeRefs(inputRef, ref);
	const onClickReveal = () => {
		onToggle();

		if (inputRef.current) {
			inputRef.current.focus({ preventScroll: true });
		}
	};

	return (
		<FormControl id={id} isInvalid={Boolean(errors?.[name])}>
			<FormLabel>{label}</FormLabel>
			<InputGroup>
				<Input
					ref={mergeRef}
					autoComplete="current-password"
					name={name}
					required
					type={isOpen ? 'text' : 'password'}
					{...rest}
				/>
				<InputRightElement>
					<IconButton
						aria-label={isOpen ? 'Mask password' : 'Reveal password'}
						icon={isOpen ? <HiEyeOff /> : <HiEye />}
						onClick={onClickReveal}
						variant="link"
					/>
				</InputRightElement>
			</InputGroup>
			<FormErrorMessage color="red">
				<ErrorMessage errors={errors} name={name} />
			</FormErrorMessage>
		</FormControl>
	);
});
