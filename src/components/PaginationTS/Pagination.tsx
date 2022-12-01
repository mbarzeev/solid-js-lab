import {Accessor, Component, createEffect, createSignal, For, on} from 'solid-js';
import styles from './Pagination.module.css';
import {debugComputation} from '@solid-devtools/logger';

type PaginationProps = {
    cursor?: number;
    initialCursor?: number;
    totalPages: number;
    pagesBuffer: number;
    onChange?: (value: number) => void;
};

type PaginationLogicType = {
    cursor: Accessor<number>;
    totalPages: number;
    goNext: () => void;
    goPrev: () => void;
};

const NO_TOTAL_PAGES_ERROR = 'No total pages were given';

function paginationLogic(props: PaginationProps): PaginationLogicType {
    if (!props.totalPages) {
        throw new Error(NO_TOTAL_PAGES_ERROR);
    }

    const [cursor, setInternalCursor] = createSignal<number>(props.initialCursor || 0);

    const setCursor = (newCursor: number) => {
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

const Pagination: Component<PaginationProps> = (props) => {
    const {cursor, totalPages, goNext, goPrev} = paginationLogic(props);
    const [bufferGap, setBufferGap] = createSignal<number>(0);
    const buffer: number[] = new Array(props.pagesBuffer).fill(0);

    createEffect(() => {
        debugComputation();
        let newBufferGap = 0;
        if (props.totalPages - cursor() < buffer.length) {
            newBufferGap = props.totalPages - cursor() - buffer.length;
        }
        setBufferGap(newBufferGap);
    });

    return (
        <div class={styles.pagination}>
            <button onClick={goPrev} disabled={cursor() === 0}>
                PREV
            </button>
            <For each={buffer}>
                {(item, index) => {
                    const pageCursor = () => cursor() + index() + bufferGap();
                    const className = () => (pageCursor() === cursor() ? styles.selected : '');

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
