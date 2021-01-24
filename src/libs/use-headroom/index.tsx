import React, { useEffect } from 'react';
import { callOnPin, callOnUnpin, callOnFix, callOnUnfix } from './utils';

interface IUseHeadroomProps {
	onPin?: () => void;
	onUnpin?: () => void;
	fixAt?: number;
	onFix?: (fixedAt: number) => void;
	onUnfix?: (fixedAt: number) => void;
}

export default ({ onPin, onUnpin, fixAt = 0, onFix, onUnfix }: IUseHeadroomProps = {}) => {
	const [scroll, setScroll] = React.useState(0);

	// Tracking scroll value
	useEffect(() => {
		const handleScroll = () => setScroll(window.scrollY);
		window.addEventListener('scroll', handleScroll);
		// Cleanup function
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollRef = React.useRef({ scroll: scroll });

	useEffect(() => callOnPin(scrollRef.current.scroll, scroll, fixAt, onPin), [
		scroll < fixAt || scrollRef.current.scroll <= scroll,
	]);

	// Handle onUnpin callback
	useEffect(() => callOnUnpin(scrollRef.current.scroll, scroll, fixAt, onUnpin), [
		scroll < fixAt ? scroll < fixAt : scrollRef.current.scroll >= scroll,
	]);

	// Handle onFix callback
	useEffect(() => callOnFix(scroll, fixAt, onFix), [scroll <= fixAt]);

	// Handle onUnfix callback
	useEffect(() => callOnUnfix(scrollRef.current.scroll, scroll, fixAt, onUnfix), [scroll > fixAt]);

	// Handling the backward scroll behavior
	useEffect(() => {
		scrollRef.current.scroll = scroll;
	}, [scroll]);

	return scrollRef.current.scroll >= scroll || scroll <= fixAt;
};
