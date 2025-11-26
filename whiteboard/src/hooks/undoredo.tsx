import { useRef } from "react";

export function useUndoRedo<T>() {
    const undoStack = useRef<T[]>([]);
    const redoStack = useRef<T[]>([]);

    function push(action: T) {
        undoStack.current.push(action);
        redoStack.current = [];
    }

    function undo(): T | undefined {
        const action = undoStack.current.pop();
        if (action) {
            redoStack.current.push(action);
        }
        return action;
    }

    function redo(): T | undefined {
        const action = redoStack.current.pop();
        if (action) {
            undoStack.current.push(action);
        }
        return action;
    }

    function canUndo() {
        return undoStack.current.length > 0;
    }

    function canRedo() {
        return redoStack.current.length > 0;
    }

    return { push, undo, redo, canUndo, canRedo }
}