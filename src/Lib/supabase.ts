import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase

export const createSupaTodo = async (todo) => {
  try {
      // Ajouter la nouvelle todo à la base de données Supabase
      const { data, error } = await supabase
        .from('todos') 
        .insert(todo);
  
      if (error) {
        console.error(error);
        // Gérer l'erreur d'ajout à la base de données
      } else {
        console.log('Todo ajoutée avec succès :', data);
      }
    } catch (error) {
      console.error(error);
      // Gérer les erreurs lors de l'ajout à la base de données
    }
}

export const deleteSupaTodo = async (id) => {
  try {
      // Supprimer le todo de la base de données Supabase
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
  
      if (error) {
        console.error(error);
        // Gérer l'erreur de suppression de la base de données
      } else {
        console.log('Todo supprimé avec succès');
      }
    } catch (error) {
      console.error(error);
      // Gérer les erreurs lors de la suppression de la base de données
    }
}

export const checkSupaTodo = async (id, completed) => {
  try {
    // Mettre à jour le statut de la todo dans la base de données Supabase
    const { error } = await supabase
      .from('todos')
      .update({ completed: completed })
      .eq('id', id);

    if (error) {
      console.error(error);
      // Gérer l'erreur de mise à jour de la base de données
    } else {
      console.log('Statut de la todo mis à jour avec succès');
    }
  } catch (error) {
    console.error(error);
    // Gérer les erreurs lors de la mise à jour de la base de données
  }
}

export const updateSupaTodo = async (updatedTodo, selectedTodo) => {
  try {
    // Mettre à jour le todo dans la base de données Supabase
    const { error } = await supabase
      .from('todos')
      .update(updatedTodo)
      .eq('id', selectedTodo.id);

    if (error) {
      console.error(error);
      // Gérer l'erreur de mise à jour de la base de données
    } else {
      console.log('Todo mis à jour avec succès');
    }
  } catch (error) {
    console.error(error);
    // Gérer les erreurs lors de la mise à jour de la base de données
  }
}
