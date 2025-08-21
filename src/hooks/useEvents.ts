import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Event } from '@/lib/supabase'

// Hook para obtener todos los eventos del usuario
export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async (): Promise<Event[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_at', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: false
  })
}

// Hook para crear un nuevo evento
export const useCreateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (eventData: Omit<Event, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          user_id: user.id
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}

// Hook para actualizar un evento
export const useUpdateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...eventData }: Partial<Event> & { id: string }) => {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}

// Hook para eliminar un evento
export const useDeleteEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error
      return eventId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}

// Hook para obtener eventos por rango de fechas
export const useEventsByDateRange = (startDate: Date, endDate: Date) => {
  return useQuery({
    queryKey: ['events', 'dateRange', startDate.toISOString(), endDate.toISOString()],
    queryFn: async (): Promise<Event[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_at', startDate.toISOString())
        .lte('end_at', endDate.toISOString())
        .order('start_at', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: false
  })
}

// Hook para obtener eventos por tipo
export const useEventsByType = (eventType: string) => {
  return useQuery({
    queryKey: ['events', 'type', eventType],
    queryFn: async (): Promise<Event[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_type', eventType)
        .order('start_at', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: false
  })
}

// Hook para obtener eventos de hoy
export const useTodayEvents = () => {
  return useQuery({
    queryKey: ['events', 'today'],
    queryFn: async (): Promise<Event[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_at', startOfDay.toISOString())
        .lte('end_at', endOfDay.toISOString())
        .order('start_at', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: false
  })
}

// Hook para obtener eventos de esta semana
export const useWeekEvents = () => {
  return useQuery({
    queryKey: ['events', 'week'],
    queryFn: async (): Promise<Event[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Lunes
      startOfWeek.setHours(0, 0, 0, 0)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6) // Domingo
      endOfWeek.setHours(23, 59, 59, 999)

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_at', startOfWeek.toISOString())
        .lte('end_at', endOfWeek.toISOString())
        .order('start_at', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: false
  })
}
