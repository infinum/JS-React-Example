import {
	FormControl,
	FormLabel,
	IconButton,
	Input,
	InputGroup,
	InputProps,
	InputRightElement,
	useDisclosure,
	useMergeRefs,
	forwardRef,
	FormErrorMessage,
} from '@chakra-ui/react';
import { ErrorMessage } from '@hookform/error-message';
import { useRef } from 'react';
import { FieldValues } from 'react-hook-form';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export interface IPasswordField extends InputProps {
	label: string;
	errors?: FieldValues;
}

export const PasswordField = forwardRef<IPasswordField, 'input'>(({ label, errors, ...rest }, ref) => {
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
		<FormControl>
			<FormLabel htmlFor={rest.name}>{label}</FormLabel>
			<InputGroup>
				<InputRightElement>
					<IconButton
						aria-label={isOpen ? 'Mask password' : 'Reveal password'}
						icon={isOpen ? <HiEyeOff /> : <HiEye />}
						onClick={onClickReveal}
						variant="link"
					/>
				</InputRightElement>
				<Input
					ref={mergeRef}
					autoComplete="current-password"
					id="password"
					name="password"
					required
					type={isOpen ? 'text' : 'password'}
					{...rest}
				/>
				<FormErrorMessage color="red">
					<ErrorMessage errors={errors} name={rest.name} />
				</FormErrorMessage>
			</InputGroup>
		</FormControl>
	);
});
