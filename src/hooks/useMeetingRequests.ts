import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { MeetingRequest } from '@/lib/supabase'

// Hook para obtener todas las solicitudes de reunión del usuario
export const useMeetingRequests = () => {
  return useQuery({
    queryKey: ['meetingRequests'],
    queryFn: async (): Promise<MeetingRequest[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('meeting_requests')
        .select('*')
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: false
  })
}

// Hook para crear una nueva solicitud de reunión
export const useCreateMeetingRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (requestData: Omit<MeetingRequest, 'id' | 'organizer_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('meeting_requests')
        .insert([{
          ...requestData,
          organizer_id: user.id
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetingRequests'] })
    }
  })
}

// Hook para actualizar una solicitud de reunión
export const useUpdateMeetingRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...requestData }: Partial<MeetingRequest> & { id: string }) => {
      const { data, error } = await supabase
        .from('meeting_requests')
        .update(requestData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetingRequests'] })
    }
  })
}

// Hook para eliminar una solicitud de reunión
export const useDeleteMeetingRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('meeting_requests')
        .delete()
        .eq('id', requestId)

      if (error) throw error
      return requestId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetingRequests'] })
    }
  })
}

// Hook para obtener solicitudes por estado
export const useMeetingRequestsByStatus = (status: 'pending' | 'accepted' | 'declined') => {
  return useQuery({
    queryKey: ['meetingRequests', status],
    queryFn: async (): Promise<MeetingRequest[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('meeting_requests')
        .select('*')
        .eq('organizer_id', user.id)
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: false
  })
}

// Hook para obtener solicitudes donde el usuario es invitado
export const useInvitedMeetingRequests = () => {
  return useQuery({
    queryKey: ['meetingRequests', 'invited'],
    queryFn: async (): Promise<MeetingRequest[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('meeting_requests')
        .select('*')
        .contains('attendees', [user.email])
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: false
  })
}

// Hook para aceptar una solicitud de reunión
export const useAcceptMeetingRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, selectedOption }: { id: string; selectedOption: any }) => {
      const { data, error } = await supabase
        .from('meeting_requests')
        .update({
          status: 'accepted',
          selected_option: selectedOption,
          selected_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetingRequests'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}

// Hook para declinar una solicitud de reunión
export const useDeclineMeetingRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (requestId: string) => {
      const { data, error } = await supabase
        .from('meeting_requests')
        .update({
          status: 'declined',
          selected_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetingRequests'] })
    }
  })
}

// Hook para obtener estadísticas de solicitudes
export const useMeetingRequestStats = () => {
  return useQuery({
    queryKey: ['meetingRequests', 'stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('meeting_requests')
        .select('status')
        .eq('organizer_id', user.id)

      if (error) throw error

      const stats = {
        pending: 0,
        accepted: 0,
        declined: 0,
        total: 0
      }

      data?.forEach(request => {
        stats[request.status as keyof typeof stats]++
        stats.total++
      })

      return stats
    },
    enabled: false
  })
}
