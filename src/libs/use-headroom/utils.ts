import React from 'react';

export const callOnPin = (prevScroll, scroll, fixAt, onPin) => {
	!!onPin && prevScroll > scroll && scroll > fixAt && onPin();
};

export const callOnUnpin = (prevScroll, scroll, fixAt, onUnpin) => {
	!!onUnpin && prevScroll <= scroll && scroll > fixAt && onUnpin();
};

export const callOnFix = (scroll, fixAt, onFix) => {
	!!onFix && scroll <= fixAt && onFix(fixAt);
};

export const callOnUnfix = (prevScroll, scroll, fixAt, onUnfix) => {
	!!onUnfix && prevScroll === fixAt && scroll > prevScroll && onUnfix(fixAt);
};
