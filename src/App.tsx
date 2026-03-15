import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2 rounded-xl">
              <ListTodo size={24} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground font-medium">
              {completedCount} / {todos.length} Done
            </p>
          </div>
        </header>

        {/* Input Area */}
        <form onSubmit={addTodo} className="relative mb-6 group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-white border-none rounded-2xl py-4 pl-5 pr-14 shadow-sm focus:ring-2 focus:ring-black/5 transition-all outline-none text-lg"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-30 disabled:hover:scale-100"
          >
            <Plus size={20} />
          </button>
        </form>

        {/* Todo List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {todos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-black/10"
              >
                <p className="text-muted-foreground italic">No tasks yet. Add one above!</p>
              </motion.div>
            ) : (
              todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-black/5 hover:border-black/10 transition-colors"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 transition-colors ${
                      todo.completed ? 'text-emerald-500' : 'text-black/20 group-hover:text-black/40'
                    }`}
                  >
                    {todo.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <span className={`flex-grow text-lg transition-all ${
                    todo.completed ? 'text-black/30 line-through' : 'text-black'
                  }`}>
                    {todo.text}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        {todos.length > 0 && (
          <footer className="mt-8 pt-6 border-t border-black/5 flex justify-between items-center text-xs text-black/40 uppercase tracking-widest font-semibold">
            <span>Simple Todo App</span>
            <span>{new Date().toLocaleDateString()}</span>
          </footer>
        )}
      </div>
    </div>
  );
}

