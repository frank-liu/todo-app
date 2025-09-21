import { useState, useCallback, useRef } from 'react';

export type Todo = {
    id: number;
    text: string;
    completed: boolean;
};

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [taskInputValue, setTaskInputValue] = useState<string>('');
    const inputValueRef = useRef<string>('');
    const nextIdRef = useRef<number>(1);

    const clearInput = useCallback(() => {
        inputValueRef.current = '';
        setTaskInputValue('');
    }, []);

    const nextId = useCallback((): number => {
        const id = nextIdRef.current;
        nextIdRef.current += 1;
        return id;
    }, []);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            inputValueRef.current = v;
            setTaskInputValue(v);
        },
        []
    );

    const handleAddTodo = useCallback(() => {
        const current = inputValueRef.current;
        const trimmed = current.trim();
        if (!trimmed) {
            clearInput();
            return;
        }
        setTodos((prev) => [
            ...prev,
            {
                id: nextId(),
                text: current,
                completed: false,
            },
        ]);
        clearInput();
    }, [clearInput, nextId]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                handleAddTodo();
            }
        },
        [handleAddTodo]
    );

    const handleToggleTodo = useCallback((id: number) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    }, []);

    const handleDeleteTodo = useCallback((id: number) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    }, []);

    return {
        todos,
        taskInputValue,
        setTaskInputValue,
        handleInputChange,
        handleKeyDown,
        handleAddTodo,
        handleToggleTodo,
        handleDeleteTodo,
    };
};
