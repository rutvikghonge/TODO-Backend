import { supabase } from '../config/supabase.js';

export const getTodos = async (req, res) => {
    try {
        const userId = req.user.id;
        // Fetch user's todos ordered by position
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', userId)
            .order('position', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createTodo = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title } = req.body;

        // Get highest position to append to the end
        const { data: latestTodos, error: fetchError } = await supabase
            .from('todos')
            .select('position')
            .eq('user_id', userId)
            .order('position', { ascending: false })
            .limit(1);

        if (fetchError) throw fetchError;

        const newPosition = latestTodos.length > 0 ? latestTodos[0].position + 1 : 0;

        const { data, error } = await supabase
            .from('todos')
            .insert([{ user_id: userId, title, position: newPosition }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { title, completed } = req.body;

        const updates = {};
        if (title !== undefined) updates.title = title;
        if (completed !== undefined) updates.completed = completed;

        const { data, error } = await supabase
            .from('todos')
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Expects an array of items [{ id, position }]
export const reorderTodos = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items } = req.body;

        if (!Array.isArray(items)) {
            return res.status(400).json({ error: 'Invalid data format. Expected array of items.' });
        }

        // Update each item's position
        // Note: A batch update or upsert is more efficient, but running loops works for small arrays
        for (const item of items) {
            const { error } = await supabase
                .from('todos')
                .update({ position: item.position })
                .eq('id', item.id)
                .eq('user_id', userId);

            if (error) throw error;
        }

        res.json({ message: 'Todos reordered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
