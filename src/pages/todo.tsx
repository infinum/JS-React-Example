import { ReactElement, Fragment } from 'react';
import { Heading } from '@chakra-ui/react';
import { VStack, IconButton, useColorMode } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';

import { Seo } from '@organisms/Seo/Seo';
import { TodoList } from '../components/todo/TodoList/TodoList';
// import { AddTodo } from '../components/todo/AddTodo/AddTodo';

export default function LandingPage(): ReactElement {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Fragment>
			<Seo title="Todo Example" description="JS-React-Example todo page" />
			<VStack p={4}>
				<IconButton
					aria-label="dark-mode-switch"
					icon={colorMode === 'light' ? <FaSun /> : <FaMoon />}
					isRound
					size="lg"
					alignSelf="flex-end"
					onClick={toggleColorMode}
				/>
				<Heading
					mb="8"
					fontWeight="extrabold"
					size="2xl"
					bgGradient="linear(to-r, pink.500, pink.300, blue.500)"
					bgClip="text"
				>
					Todo Application
				</Heading>
				{/* <AddTodo /> */}
				<TodoList />
			</VStack>
		</Fragment>
	);
}
