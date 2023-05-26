import { createClient } from "@supabase/supabase-js";
import { Todo } from "./todos";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_ANON_KEY

const supabase = createClient(supabaseUrl as string, supabaseKey as string)

export default supabase

export const createSupaTodo = async (todo: Todo) => {
  try {
      // Ajouter la nouvelle todo à la base de données Supabase
      const { error } = await supabase
        .from('todos') 
        .insert(todo);
  
      if (error) {
        throw error
        // Gérer l'erreur d'ajout à la base de données
      } else {
          return "La todo a été créée avec succès"
      }
    } catch (error) {
      throw error
      // Gérer les erreurs lors de l'ajout à la base de données
    }
}

export const deleteSupaTodo = async (id: string) => {
  try {
      // Supprimer le todo de la base de données Supabase
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
  
      if (error) {
        throw error
        // Gérer l'erreur de suppression de la base de données
      } else {
        return "La todo a été supprimée avec succès"
      }
    } catch (error) {
      throw error
      // Gérer les erreurs lors de la suppression de la base de données
    }
}

export const checkSupaTodo = async (id: string, completed: boolean) => {
  try {
    // Mettre à jour le statut de la todo dans la base de données Supabase
    const { error } = await supabase
      .from('todos')
      .update({ completed: completed })
      .eq('id', id);

    if (error) {
      throw error
      // Gérer l'erreur de mise à jour de la base de données
    } else {
      return 'Le statut de la todo a été complété avec succès'
    }
  } catch (error) {
    throw error
    // Gérer les erreurs lors de la mise à jour de la base de données
  }
}

export const updateSupaTodo = async (updatedTodo: Todo) => {
  try {
    // Mettre à jour le todo dans la base de données Supabase
    const { error } = await supabase
      .from('todos')
      .update(updatedTodo)
      .eq('id', updatedTodo.id);

    if (error) {
      throw new Error("Erreur pendant la mise à jour")
      // Gérer l'erreur de mise à jour de la base de données
    } else {
      return "La todo a été mise à jour avec succès"
    }
  } catch (error) {
    throw new Error("Erreur pendant la mise à jour")
    // Gérer les erreurs lors de la mise à jour de la base de données
  }
}
