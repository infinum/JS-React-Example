import React from 'react';
import useHeadroom from '../';
import { shallow } from 'enzyme';
import { callOnPin, callOnUnpin, callOnFix, callOnUnfix } from '../utils';

const HookWrapper = (props) => {
	const hook = props.hook ? props.hook() : undefined;
	return <div hook={hook} />;
};

// hooks
it('should return true as initial value', () => {
	const wrapper = shallow(<HookWrapper hook={() => useHeadroom({ fixAt: 400 })} />);

	const { hook } = wrapper.find('div').props();
	const isPinned = hook;
	expect(isPinned).toEqual(true);
});

describe('helpers test', () => {
	it('should call onPin', () => {
		const onPin = jest.fn();
		callOnPin(450, 400, 300, onPin);
		expect(onPin).toHaveBeenCalled();
	});

	it('should not call onPin', () => {
		const onPin = jest.fn();
		callOnPin(250, 400, 300, onPin);
		expect(onPin).toHaveBeenCalledTimes(0);
	});

	it('should call onUnpin', () => {
		const onUnpin = jest.fn();
		callOnUnpin(400, 400, 300, onUnpin);
		expect(onUnpin).toHaveBeenCalled();
	});

	it('should not call onUnpin', () => {
		const onUnpin = jest.fn();
		callOnUnpin(500, 400, 300, onUnpin);
		expect(onUnpin).toHaveBeenCalledTimes(0);
	});

	it('should call onFix', () => {
		const onFix = jest.fn();
		callOnFix(250, 300, onFix);
		expect(onFix).toHaveBeenCalled();
	});

	it('should not call onFix', () => {
		const onFix = jest.fn();
		callOnFix(450, 300, onFix);
		expect(onFix).toHaveBeenCalledTimes(0);
	});

	it('should call onUnfix', () => {
		const onUnfix = jest.fn();
		callOnUnfix(300, 400, 300, onUnfix);
		expect(onUnfix).toHaveBeenCalled();
	});

	it('should not call onUnfix', () => {
		const onUnfix = jest.fn();
		callOnUnfix(310, 400, 300, onUnfix);
		expect(onUnfix).toHaveBeenCalledTimes(0);
	});
});
