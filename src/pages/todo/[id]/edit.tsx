import React from 'react';
import { NextPage } from 'next';

import { Meta } from '@/components/utilities/Meta/Meta';
import { Navigation } from '@/components/shared/Navigation/Navigation';
import { TodoEditPreview } from '@/components/Todo/TodoEditPreview/TodoEditPreview';

const TodoEdit: NextPage = () => {
	return (
		<>
			<Meta />
			<Navigation />
			<TodoEditPreview />
		</>
	);
};

export default TodoEdit;
