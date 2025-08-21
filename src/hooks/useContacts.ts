import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Contact } from '@/lib/supabase'

// Hook para obtener todos los contactos del usuario
export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async (): Promise<Contact[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: false
  })
}

// Hook para crear un nuevo contacto
export const useCreateContact = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (contactData: Omit<Contact, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          ...contactData,
          user_id: user.id
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    }
  })
}

// Hook para actualizar un contacto
export const useUpdateContact = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...contactData }: Partial<Contact> & { id: string }) => {
      const { data, error } = await supabase
        .from('contacts')
        .update(contactData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    }
  })
}

// Hook para eliminar un contacto
export const useDeleteContact = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (contactId: string) => {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId)

      if (error) throw error
      return contactId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    }
  })
}

// Hook para buscar contactos por nombre
export const useSearchContacts = (searchTerm: string) => {
  return useQuery({
    queryKey: ['contacts', 'search', searchTerm],
    queryFn: async (): Promise<Contact[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      if (!searchTerm.trim()) {
        return []
      }

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`)
        .order('name', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: searchTerm.length > 0
  })
}

// Hook para obtener contactos por empresa
export const useContactsByCompany = (company: string) => {
  return useQuery({
    queryKey: ['contacts', 'company', company],
    queryFn: async (): Promise<Contact[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .eq('company', company)
        .order('name', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: false
  })
}

// Hook para obtener estadísticas de contactos
export const useContactStats = () => {
  return useQuery({
    queryKey: ['contacts', 'stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('contacts')
        .select('company')
        .eq('user_id', user.id)

      if (error) throw error

      const stats = {
        total: data?.length || 0,
        withCompany: 0,
        withEmail: 0,
        withPhone: 0,
        companies: new Set<string>()
      }

      data?.forEach(contact => {
        if (contact.company) {
          stats.withCompany++
          stats.companies.add(contact.company)
        }
      })

      return {
        ...stats,
        uniqueCompanies: stats.companies.size
      }
    },
    enabled: false
  })
}

// Hook para obtener contactos para autocompletado
export const useContactsForAutocomplete = () => {
  return useQuery({
    queryKey: ['contacts', 'autocomplete'],
    queryFn: async (): Promise<{ id: string; name: string; email?: string; company?: string }[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('contacts')
        .select('id, name, email, company')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: false
  })
}
