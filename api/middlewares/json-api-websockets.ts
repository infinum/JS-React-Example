import { Server } from 'ws';

import { Application, ApplicationInstance, JsonApiDocument, Operation } from 'kurier';

export default function jsonApiWebSocket(websocketServer: Server, app: Application) {
	websocketServer.on('connection', (connection) => {
		connection.on('message', async (message: Buffer) => {
			try {
				const appInstance = new ApplicationInstance(app);

				if (!message) {
					return;
				}

				const { meta, operations } = JSON.parse(message.toString()) as JsonApiDocument;

				// Get user.
				if (meta && meta.token) {
					appInstance.user = await appInstance.getUserFromToken(meta.token as string);
				}

				// Execute and reply.
				const response = await appInstance.app.executeOperations(operations as Operation[], appInstance);

				/**
				 * TODO:
				 *  1. Implement channels
				 *  2. Subscribe to messages channel only
				 *  3. Broadcast messages to all clients only for add and delete op
				 */
				websocketServer.clients.forEach((client) => {
					if (client.readyState === connection.OPEN) {
						client.send(
							JSON.stringify({
								operations: response,
							})
						);
					}
				});
			} catch (e) {
				console.log(e);
				connection.send(
					JSON.stringify({
						errors: [e],
					})
				);
			}
		});
	});
}
