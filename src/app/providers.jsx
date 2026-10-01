import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { AuthProvider } from '@/features/auth'
import theme from '@/theme'

export default function AppProviders({ children }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ModalsProvider>
        <Notifications />
        <AuthProvider>
          <QueryClientProvider client={queryClientInstance}>
            {children}
          </QueryClientProvider>
        </AuthProvider>
      </ModalsProvider>
    </MantineProvider>
  )
}
