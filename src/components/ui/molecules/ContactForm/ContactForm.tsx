import { FormControl, FormLabel, Input, FormHelperText, Textarea, chakra, Button } from '@chakra-ui/react';
import React, { FC } from 'react';

export const ContactForm: FC = () => {
	return (
		<chakra.form maxW="xl" mx="auto">
			<FormControl id="email" mb={5}>
				<FormLabel>Email address</FormLabel>
				<Input type="email" />
				<FormHelperText>We&#39;ll never share your email.</FormHelperText>
			</FormControl>
			<FormControl id="subject" mb={5}>
				<FormLabel>Subject</FormLabel>
				<Input type="subject" />
			</FormControl>
			<FormControl id="message" mb={5}>
				<FormLabel>Message</FormLabel>
				<Textarea placeholder="Enter your message here!" />
			</FormControl>
			<Button colorScheme="blue" type="submit" w="100%">
				Send
			</Button>
		</chakra.form>
	);
};
