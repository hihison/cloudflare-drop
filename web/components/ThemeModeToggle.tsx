import { IconButton, Tooltip } from '@mui/material'
import { LightMode, DarkMode, SettingsBrightness } from '@mui/icons-material'
import { useThemeMode } from '../theme/AppTheme'

export const ThemeModeToggle = () => {
  const { mode, toggleMode } = useThemeMode()

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return <LightMode />
      case 'dark':
        return <DarkMode />
      default:
        return <SettingsBrightness />
    }
  }

  const getTooltip = () => {
    switch (mode) {
      case 'light':
        return 'Switch to Dark Mode'
      case 'dark':
        return 'Switch to System Mode'
      default:
        return 'Switch to Light Mode'
    }
  }

  return (
    <Tooltip title={getTooltip()}>
      <IconButton onClick={toggleMode} size="small">
        {getIcon()}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeModeToggle