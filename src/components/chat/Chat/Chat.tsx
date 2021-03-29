import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { ChatIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Textarea } from '@chakra-ui/textarea';
import React, { FC, useCallback, useMemo, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useResourceList } from '@datx/jsonapi-react';
import { Message } from '@/models/Message';
import { StyledActions, StyledMessagesList, StyledWrapper } from './Chat.elements';

interface IChatProps {}

export const Chat: FC<IChatProps> = () => {
	const { data: messages } = useResourceList(() => [Message]);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const messageHistory = useRef(null);

	const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:8080/api/bulk');

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
						"data": [{
							"type": "message"
							"attributes": {
								"body": "test message",
							}
						}]
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
			<StyledMessagesList flex={1}>
				<span>WS Status: {connectionStatus}</span>
				{messages?.map((message) => (
					<span key={message.id}>{message.body}</span>
				))}
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
