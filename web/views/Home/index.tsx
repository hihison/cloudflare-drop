import { useState, useRef } from 'preact/hooks'
import { useDialogs } from '@toolpad/core/useDialogs'
import { useLanguage } from '../../helpers/i18n'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import { styled, alpha, keyframes } from '@mui/material/styles'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import SendIcon from '@mui/icons-material/Send'
import FileIcon from '@mui/icons-material/Description'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import Drawer from '@mui/material/Drawer'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import Slide from '@mui/material/Slide'

import {
  Code,
  FileDialog,
  ShareDialog,
  historyApi,
  History,
  Progress,
  Duration,
  PasswordSwitch,
} from './components'
import { resolveFileByCode, uploadFile } from '../../api'
import { Layout, LayoutProps } from '../../components'
import { humanFileSize } from '../../helpers'

// Modern animations
const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`

const gradientShift = keyframes`
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
`

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

// Modern glassmorphism container
const GlassContainer = styled(Container)(() => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  position: 'relative',
  '@media (max-width: 768px)': {
    padding: 16,
    minHeight: 'auto',
    paddingTop: 32,
    paddingBottom: 32,
  },
  '@media (max-width: 480px)': {
    padding: 12,
    paddingTop: 24,
    paddingBottom: 24,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.15) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}))

// Modern card with enhanced glassmorphism
const ModernCard = styled(Card)(() => ({
  background: alpha('#ffffff', 0.1),
  backdropFilter: 'blur(20px) saturate(180%)',
  border: `1px solid ${alpha('#ffffff', 0.2)}`,
  borderRadius: 32,
  boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1), 0 15px 35px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  maxWidth: 1000,
  width: '100%',
  margin: '0 auto',
  animation: `${floatAnimation} 6s ease-in-out infinite`,
  '@media (max-width: 768px)': {
    borderRadius: 24,
    maxWidth: '100%',
    margin: '0 8px',
  },
  '@media (max-width: 480px)': {
    borderRadius: 20,
    margin: '0 4px',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
    animation: `${gradientShift} 3s ease-in-out infinite`,
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    background: alpha('#ffffff', 0.15),
    boxShadow: '0 35px 60px rgba(102, 126, 234, 0.15), 0 25px 45px rgba(102, 126, 234, 0.1)',
    '@media (max-width: 768px)': {
      transform: 'translateY(-4px) scale(1.01)',
    },
  },
}))

// Modern tab styling
const ModernTabList = styled(TabList)(() => ({
  background: alpha('#ffffff', 0.1),
  borderRadius: 20,
  padding: 4,
  marginBottom: 24,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha('#ffffff', 0.1)}`,
  '@media (max-width: 768px)': {
    borderRadius: 16,
    padding: 3,
    marginBottom: 20,
  },
  '@media (max-width: 480px)': {
    borderRadius: 14,
    padding: 2,
    marginBottom: 16,
  },
  '& .MuiTabs-indicator': {
    height: '100%',
    borderRadius: 16,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
    '@media (max-width: 768px)': {
      borderRadius: 12,
    },
    '@media (max-width: 480px)': {
      borderRadius: 10,
    },
  },
}))

const ModernTab = styled(Tab)(() => ({
  borderRadius: 16,
  margin: '0 4px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontWeight: 500,
  textTransform: 'none',
  fontSize: '0.95rem',
  color: alpha('#ffffff', 0.7),
  '@media (max-width: 768px)': {
    borderRadius: 12,
    margin: '0 2px',
    fontSize: '0.9rem',
  },
  '@media (max-width: 480px)': {
    borderRadius: 10,
    margin: '0 1px',
    fontSize: '0.85rem',
    minWidth: 'auto',
    padding: '8px 12px',
  },
  '&.Mui-selected': {
    color: '#ffffff',
    fontWeight: 600,
  },
  '&:hover': {
    backgroundColor: alpha('#ffffff', 0.1),
    color: '#ffffff',
  },
}))

// Enhanced upload button
const ModernUploadButton = styled(Button)(() => ({
  borderRadius: 20,
  padding: '16px 32px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundSize: '200% 200%',
  animation: `${gradientShift} 4s ease infinite`,
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.25)',
  border: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  maxWidth: 400,
  '@media (max-width: 768px)': {
    padding: '14px 28px',
    fontSize: '0.95rem',
    borderRadius: 16,
  },
  '@media (max-width: 480px)': {
    padding: '12px 24px',
    fontSize: '0.9rem',
    borderRadius: 14,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.35)',
    '@media (max-width: 768px)': {
      transform: 'translateY(-2px)',
    },
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(-1px)',
  },
}))

const envMax = Number.parseInt(import.meta.env.SHARE_MAX_SIZE_IN_MB, 10)
const MAX_SIZE = Number.isNaN(envMax) || envMax <= 0 ? 10 : envMax

export function AppMain(props: LayoutProps) {
  const setBackdropOpen = props.setBackdropOpen!
  const message = props.message!
  const { t } = useLanguage()
  const [tab, setTab] = useState('text')
  const dialogs = useDialogs()
  const [duration, updateDuration] = useState('')
  const [isEphemeral, updateEphemeral] = useState(false)

  const [progress, updateProgress] = useState<null | number>(null)

  const [drawerOpened, updateDrawerOpened] = useState(false)

  const [password, updatePassword] = useState('')

  const toggleDrawer = (newOpen: boolean) => () => {
    updateDrawerOpened(newOpen)
  }

  const handleBackdropClose = () => {
    setBackdropOpen(false)
  }
  const handleBackdropOpen = () => {
    setBackdropOpen(true)
  }

  const handleProgressOpen = () => {
    updateProgress(0)
  }

  const handleProgressClose = () => {
    setTimeout(() => {
      updateProgress(null)
    }, 1000)
  }

  const handleChangeTab = (_event: unknown, newValue: string) => {
    setTab(newValue)
    setText('')
    updateEphemeral(false)
    updateDuration('')
  }

  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [code, setCode] = useState('')

  const reset = useRef(() => {
    setText('')
    setFile(null)
    setCode('')
    setTab('text')
    updateDuration('')
    updateEphemeral(false)
    updatePassword('')
  })

  const handleResolveFile = useRef(async (code: string) => {
    if (!code || code.length !== 6) return
    setCode(code)
    handleBackdropOpen()
    try {
      const data = await resolveFileByCode(code)
      handleBackdropClose()
      if (!data.result || !data.data) {
        message.error(data.message)
        return
      }
      // 打开弹窗
      historyApi.insertReceived(
        data.data.code,
        data.data.type !== 'plain/string',
      )
      await dialogs
        .open(FileDialog, { ...data.data, message })
        .then(reset.current)
    } catch (e) {
      const data = (e as { message: string }).message || JSON.stringify(e)
      message.error(data)
      handleBackdropClose()
    }
  })

  const handleTextInput = (e: InputEvent) => {
    const target: HTMLInputElement = e.target as HTMLInputElement
    setText(target.value)
    setFile(null)
  }

  const handleFileChange = (e: InputEvent) => {
    const target: HTMLInputElement = e.target as HTMLInputElement
    const file = target?.files?.[0] ?? null
    if (file && file.size > MAX_SIZE * 1000 * 1000) {
      message.error(`文件大于 ${MAX_SIZE}M`)
      ;(e.target as HTMLInputElement).value = ''
      return
    }
    setFile(file)
  }

  const handleShare = async () => {
    if ((tab === 'text' && !text) || (tab === 'file' && !file)) return
    let data: Blob | null = file
    if (tab === 'text') {
      data = new Blob([text], {
        type: 'plain/string',
      })
    }
    if (!data) return
    handleProgressOpen()
    try {
      const uploaded = await uploadFile(
        {
          data,
          isEphemeral,
          duration,
          password,
        },
        (event) => {
          updateProgress((event.progress ?? 0) * 100)
        },
      )
      handleProgressClose()
      if (!uploaded.result || !uploaded.data) {
        message.error(uploaded.message)
        return
      }
      historyApi.insertShared(uploaded.data.code, tab === 'file')
      await dialogs
        .open(ShareDialog, { ...uploaded.data, message })
        .then(reset.current)
    } catch (e) {
      const data = (e as { message: string }).message || JSON.stringify(e)
      message.error(data)
      handleProgressClose()
    }
  }

  const handleChangeEphemeral = (_event: unknown, checked: boolean) => {
    updateEphemeral(checked)
  }

  return (
    <Fade in timeout={800}>
      <GlassContainer maxWidth="xl">
        <ModernCard>
          <CardContent 
            sx={{ 
              p: 4,
              '@media (max-width: 768px)': {
                p: 3,
              },
              '@media (max-width: 480px)': {
                p: 2,
              },
            }}
          >
            {/* Download Section */}
            <Slide in timeout={1200} direction="up">
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: { xs: 'start', sm: 'center' },
                    mb: 3,
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: alpha('#ffffff', 0.9),
                      fontWeight: 600,
                      minWidth: 'fit-content'
                    }}
                  >
                    {t('home.downloadSection.title')}：
                  </Typography>
                  <Code
                    length={6}
                    onChange={handleResolveFile.current}
                    value={code}
                  />
                </Box>

                <Divider sx={{ 
                  my: 3, 
                  borderColor: alpha('#ffffff', 0.1),
                  '&::before, &::after': {
                    borderColor: alpha('#ffffff', 0.1),
                  }
                }} />
              </Box>
            </Slide>

            {/* Upload Section */}
            <Slide in timeout={1400} direction="up">
              <Box>
                <TabContext value={tab}>
                  <Box sx={{ mb: 3 }}>
                    <ModernTabList
                      onChange={handleChangeTab}
                      aria-label="分享類型選擇"
                      centered
                    >
                      <ModernTab label={t('home.uploadSection.textTab')} value="text" />
                      <ModernTab label={t('home.uploadSection.fileTab')} value="file" />
                    </ModernTabList>
                  </Box>
                  
                  <TabPanel value="text" sx={{ p: 0, minHeight: 240 }}>
                    <TextField
                      multiline
                      fullWidth
                      rows={8}
                      value={text}
                      onInput={handleTextInput}
                      placeholder={t('home.uploadSection.textPlaceholder')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          background: alpha('#ffffff', 0.1),
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${alpha('#ffffff', 0.2)}`,
                          transition: 'all 0.3s ease',
                          '@media (max-width: 768px)': {
                            borderRadius: 2,
                          },
                          '@media (max-width: 480px)': {
                            borderRadius: 1.5,
                          },
                          '& fieldset': {
                            border: 'none',
                          },
                          '&:hover': {
                            background: alpha('#ffffff', 0.15),
                            transform: 'translateY(-1px)',
                            '@media (max-width: 768px)': {
                              transform: 'translateY(0px)',
                            },
                          },
                          '&.Mui-focused': {
                            background: alpha('#ffffff', 0.2),
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
                            '@media (max-width: 768px)': {
                              transform: 'translateY(0px)',
                              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.15)',
                            },
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: alpha('#ffffff', 0.9),
                          fontSize: '1rem',
                          '@media (max-width: 768px)': {
                            fontSize: '16px', // Prevents zoom on iOS
                          },
                          '@media (max-width: 480px)': {
                            fontSize: '16px',
                            lineHeight: 1.4,
                          },
                          '&::placeholder': {
                            color: alpha('#ffffff', 0.5),
                          },
                        },
                      }}
                    />
                  </TabPanel>
                  
                  <TabPanel value="file" sx={{ p: 0, minHeight: 240 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 200,
                      border: `2px dashed ${alpha('#ffffff', 0.2)}`,
                      borderRadius: 3,
                      background: alpha('#ffffff', 0.05),
                      transition: 'all 0.3s ease',
                      '@media (max-width: 768px)': {
                        minHeight: 180,
                        borderRadius: 2,
                      },
                      '@media (max-width: 480px)': {
                        minHeight: 160,
                        borderRadius: 1.5,
                        padding: 2,
                      },
                      '&:hover': {
                        borderColor: alpha('#ffffff', 0.4),
                        background: alpha('#ffffff', 0.1),
                      }
                    }}>
                      <ModernUploadButton
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        size="large"
                        sx={{
                          '@media (max-width: 480px)': {
                            size: 'medium',
                            fontSize: '0.85rem',
                          },
                        }}
                      >
                        {t('home.uploadSection.fileUpload')}
                        <VisuallyHiddenInput
                          type="file"
                          onChange={handleFileChange}
                        />
                      </ModernUploadButton>
                      
                      {file && (
                        <Box sx={{ 
                          mt: 3, 
                          display: 'flex', 
                          alignItems: 'center',
                          background: alpha('#ffffff', 0.1),
                          padding: 2,
                          borderRadius: 2,
                          backdropFilter: 'blur(10px)',
                          maxWidth: '100%',
                          '@media (max-width: 480px)': {
                            mt: 2,
                            padding: 1.5,
                            borderRadius: 1.5,
                            flexDirection: 'column',
                            textAlign: 'center',
                          },
                        }}>
                          <FileIcon sx={{ 
                            mr: 1, 
                            color: alpha('#ffffff', 0.7),
                            '@media (max-width: 480px)': {
                              mr: 0,
                              mb: 1,
                            },
                          }} />
                          <Box sx={{ 
                            minWidth: 0,
                            '@media (max-width: 480px)': {
                              width: '100%',
                            },
                          }}>
                            <Typography 
                              sx={{ 
                                color: alpha('#ffffff', 0.9),
                                wordBreak: 'break-word',
                                '@media (max-width: 480px)': {
                                  fontSize: '0.9rem',
                                },
                              }}
                            >
                              {file.name}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: alpha('#ffffff', 0.6),
                                '@media (max-width: 480px)': {
                                  fontSize: '0.8rem',
                                },
                              }}
                            >
                              {humanFileSize(file.size)}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </TabPanel>
                </TabContext>

                {/* Settings */}
                <Box sx={{ 
                  mt: 3, 
                  mb: 3,
                  '@media (max-width: 480px)': {
                    mt: 2,
                    mb: 2,
                  },
                }}>
                  <Duration value={duration} onChange={updateDuration} />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isEphemeral}
                        onChange={handleChangeEphemeral}
                        sx={{
                          color: alpha('#ffffff', 0.6),
                          '&.Mui-checked': {
                            color: '#ffffff',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography 
                        sx={{ 
                          color: alpha('#ffffff', 0.8),
                          '@media (max-width: 480px)': {
                            fontSize: '0.9rem',
                          },
                        }}
                      >
                        {t('home.settings.ephemeral')}
                      </Typography>
                    }
                    sx={{ 
                      mt: 2,
                      '@media (max-width: 480px)': {
                        mt: 1.5,
                      },
                    }}
                  />
                </Box>

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  '@media (max-width: 480px)': {
                    gap: 1.5,
                  },
                }}>
                  <Button 
                    variant="text" 
                    onClick={toggleDrawer(true)}
                    startIcon={<ReceiptLongIcon />}
                    sx={{
                      color: alpha('#ffffff', 0.7),
                      '@media (max-width: 480px)': {
                        fontSize: '0.85rem',
                        minWidth: 'auto',
                        padding: '8px 16px',
                      },
                      '&:hover': {
                        color: '#ffffff',
                        background: alpha('#ffffff', 0.1),
                      }
                    }}
                  >
                    {t('home.settings.history')}
                  </Button>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    width: { xs: '100%', sm: 'auto' },
                    '@media (max-width: 480px)': {
                      gap: 1.5,
                    },
                  }}>
                    <PasswordSwitch value={password} onChange={updatePassword} />
                    <ModernUploadButton
                      variant="contained"
                      disabled={
                        (tab === 'text' && !text) || (tab === 'file' && !file)
                      }
                      endIcon={<SendIcon />}
                      onClick={handleShare}
                      sx={{
                        width: { xs: '100%', sm: 'auto' },
                        minWidth: { sm: 'auto' },
                        '@media (max-width: 480px)': {
                          fontSize: '0.9rem',
                        },
                      }}
                    >
                      {t('home.uploadSection.shareButton')}
                    </ModernUploadButton>
                  </Box>
                </Box>
              </Box>
            </Slide>
          </CardContent>
        </ModernCard>

        <Drawer 
          open={drawerOpened} 
          onClose={toggleDrawer(false)} 
          anchor="right"
          PaperProps={{
            sx: {
              background: alpha('#ffffff', 0.1),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha('#ffffff', 0.1)}`,
              '@media (max-width: 768px)': {
                width: '85vw',
                maxWidth: '400px',
              },
              '@media (max-width: 480px)': {
                width: '90vw',
                maxWidth: 'none',
              },
            }
          }}
        >
          <History
            onItemClick={(item: any) => {
              updateDrawerOpened(false)
              setCode(item.code)
            }}
          />
        </Drawer>
        
        <Progress open={progress !== null} value={progress ?? 0} />
      </GlassContainer>
    </Fade>
  )
}
export function Home() {
  return (
    <Layout>
      <AppMain />
    </Layout>
  )
}
