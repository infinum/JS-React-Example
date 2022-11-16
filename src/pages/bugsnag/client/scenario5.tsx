/**
 * Client scenario 5
 *
 * An Error is thrown from an event handler.
 *
 * Error boundaries do not catch errors inside event handlers. React doesn't need error boundaries
 * to recover from errors in event handlers. Unlike the render method and lifecycle methods,
 * the event handlers don't happen during rendering. So if they throw, React still knows what to
 * display on the screen.
 * https://reactjs.org/docs/error-boundaries.html#how-about-event-handlers
 */

const Scenario5 = () => (
	<>
		<h1>Client scenario 5</h1>
		<button
			onClick={() => {
				throw new Error('Client scenario 5');
			}}
		>
			Click me to throw an Error
		</button>
	</>
);

export default Scenario5;
