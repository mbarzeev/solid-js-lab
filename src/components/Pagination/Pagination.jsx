import {createEffect, createSignal, For, on} from 'solid-js';
import styles from './Pagination.css';
import {debugComputation} from '@solid-devtools/logger';

function paginationLogic(props) {
    if (!props.totalPages) {
        throw new Error(NO_TOTAL_PAGES_ERROR);
    }

    const [cursor, setInternalCursor] = createSignal(props.initialCursor || 0);

    const setCursor = (newCursor) => {
        if (newCursor >= 0 && newCursor < props.totalPages) {
            setInternalCursor(newCursor);
        }
    };

    const goNext = () => {
        const nextCursor = cursor() + 1;
        setCursor(nextCursor);
    };

    const goPrev = () => {
        const prevCursor = cursor() - 1;
        setCursor(prevCursor);
    };

    createEffect(on(cursor, (value) => props.onChange?.(value), {defer: true}));

    return {
        cursor,
        totalPages: props.totalPages,
        goNext,
        goPrev,
    };
}

const Pagination = (props) => {
    const {cursor, totalPages, goNext, goPrev} = paginationLogic(props);
    const [bufferGap, setBufferGap] = createSignal(0);
    const buffer = new Array(props.pagesBuffer).fill(0);

    createEffect(() => {
        debugComputation();
        let newBufferGap = 0;
        if (props.totalPages - cursor() < buffer.length) {
            newBufferGap = props.totalPages - cursor() - buffer.length;
        }
        setBufferGap(newBufferGap);
    });

    return (
        <div>
            <button onClick={goPrev} disabled={cursor() === 0}>
                PREV
            </button>
            <For each={buffer}>
                {(item, index) => {
                    const pageCursor = () => cursor() + index() + bufferGap();
                    const className = () => (pageCursor() === cursor() ? 'selected' : '');

                    return pageCursor() >= 0 && pageCursor() < totalPages ? (
                        <span class={className()}>{` [${pageCursor()}] `}</span>
                    ) : null;
                }}
            </For>
            <button onClick={goNext} disabled={cursor() === totalPages - 1}>
                NEXT
            </button>
        </div>
    );
};

export default Pagination;
