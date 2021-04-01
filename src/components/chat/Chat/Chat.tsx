import React, { FC, useCallback, useMemo, useRef } from 'react';
import { ChatIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Textarea, VStack, useDisclosure } from '@chakra-ui/react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { StyledActions, StyledMessagesList, StyledMessage, StyledWrapper } from './Chat.elements';

interface IChatProps {}

export const Chat: FC<IChatProps> = () => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const messageHistory = useRef<Array<any>>(null);

	const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(process.env.NEXT_PUBLIC_WS_ENDPOINT);

	useMemo(() => {
		if (!messageHistory.current) {
			messageHistory.current = [];
		}
		if (lastJsonMessage && !lastJsonMessage.errors) {
			messageHistory.current = [...messageHistory.current, ...lastJsonMessage?.operations];
		}
	}, [lastJsonMessage]);

	const handleClickSendMessage = useCallback(() => {
		const textarea = textareaRef.current;

		sendJsonMessage({
			operations: [
				{
					op: 'add',
					ref: {
						type: 'message',
					},
					data: {
						type: 'message',
						attributes: {
							body: textarea.value,
						},
					},
				},
			],
			meta: {},
		});

		textarea.value = '';
	}, []);

	const connectionStatus = {
		[ReadyState.CONNECTING]: 'Connecting',
		[ReadyState.OPEN]: 'Open',
		[ReadyState.CLOSING]: 'Closing',
		[ReadyState.CLOSED]: 'Closed',
		[ReadyState.UNINSTANTIATED]: 'Uninstantiated',
	}[readyState];

	return (
		<StyledWrapper minW="200px" h="300px" style={{ bottom: !isOpen ? '-268px' : null }}>
			<Button
				colorScheme="infinum"
				onClick={isOpen ? onClose : onOpen}
				leftIcon={<ChatIcon />}
				rightIcon={isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
				size="sm"
				isFullWidth
				iconSpacing="auto"
				borderBottomRadius={0}
				flex={0}
				py={2}
			>
				Chat
			</Button>
			<StyledMessagesList as={VStack} flex={1} align="stretch">
				{messageHistory.current?.map((message) => (
					<StyledMessage key={message.data.id}>{message.data.attributes.body}</StyledMessage>
				))}
			</StyledMessagesList>
			<StyledActions flex={0}>
				<Textarea ref={textareaRef} placeholder="Enter message" />
				<Button size="sm" ml={2} onClick={handleClickSendMessage} disabled={readyState !== ReadyState.OPEN}>
					Send
				</Button>
			</StyledActions>
		</StyledWrapper>
	);
};
