import { createTheme } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'bio',
  colors: {
    bio: [
      '#F0FDF4',
      '#DCFCE7',
      '#BBF7D0',
      '#86EFAC',
      '#4ADE80',
      '#22C55E',
      '#16A34A',
      '#14803C',
      '#0B3D2E',
      '#052E16',
    ],
  },
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'md',
  black: '#0A0A0A',
  white: '#FFFFFF',
  defaultColorScheme: 'dark',
  components: {
    Button: {
      defaultProps: {
        color: 'bio',
      },
    },
    Paper: {
      defaultProps: {
        bg: '#141414',
      },
    },
  },
})

export default theme
