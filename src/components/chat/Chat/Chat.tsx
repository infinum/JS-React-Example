import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { ChatIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Textarea } from '@chakra-ui/textarea';
import React, { FC, useCallback, useMemo, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { StyledActions, StyledMessagesList, StyledWrapper } from './Chat.elements';

interface IChatProps {}

export const Chat: FC<IChatProps> = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const messageHistory = useRef(null);

	const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:8080');

	messageHistory.current = useMemo(() => {
		if (!messageHistory.current) {
			messageHistory.current = [];
		}
		messageHistory.current.concat(lastMessage);
	}, [lastMessage]);

	const handleClickSendMessage = useCallback(
		() =>
			sendMessage(`{
				"operations": [
					{
						"op": "add",
						"ref": {
							"type": "message"
						},
						"data": {
							body: "test message",
						}
					}
				]
			}`),
		[]
	);

	const connectionStatus = {
		[ReadyState.CONNECTING]: 'Connecting',
		[ReadyState.OPEN]: 'Open',
		[ReadyState.CLOSING]: 'Closing',
		[ReadyState.CLOSED]: 'Closed',
		[ReadyState.UNINSTANTIATED]: 'Uninstantiated',
	}[readyState];

	return (
		<StyledWrapper minW="200px" h={isOpen ? '300px' : '32px'}>
			<Button
				colorScheme="facebook"
				onClick={isOpen ? onClose : onOpen}
				leftIcon={<ChatIcon />}
				rightIcon={isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
				size="sm"
				isFullWidth
				iconSpacing="auto"
				borderBottomRadius={0}
				flex={0}
			>
				Chat
			</Button>
			<StyledMessagesList flex={1}>
				{connectionStatus}
				{messageHistory.current?.map((message, idx) => (
					<span key={idx}>{message.data}</span>
				))}
			</StyledMessagesList>
			<StyledActions flex={0}>
				<Textarea placeholder="Enter message" />
				<Button size="sm" ml={2} onClick={handleClickSendMessage} disabled={readyState !== ReadyState.OPEN}>
					Send
				</Button>
			</StyledActions>
		</StyledWrapper>
	);
};
