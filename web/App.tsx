import { useState, useRef } from 'preact/hooks'
import { useDialogs } from '@toolpad/core/useDialogs'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import SendIcon from '@mui/icons-material/Send'
import FileIcon from '@mui/icons-material/Description'
import Divider from '@mui/material/Divider'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import Drawer from '@mui/material/Drawer'

import {
  Code,
  Message,
  useMessage,
  FileDialog,
  ShareDialog,
  Github,
  historyApi,
  History,
  Progress,
  Duration,
  PasswordSwitch,
} from './components'
import { resolveFileByCode, uploadFile } from './api'

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

const envMax = Number.parseInt(import.meta.env.SHARE_MAX_SIZE_IN_MB, 10)
const MAX_SIZE = Number.isNaN(envMax) || envMax <= 0 ? 10 : envMax

export function App() {
  const [tab, setTab] = useState('text')
  const [messageProps, message] = useMessage()
  const dialogs = useDialogs()
  const [duration, updateDuration] = useState('')
  const [isEphemeral, updateEphemeral] = useState(false)

  const [backdropOpen, setBackdropOpen] = useState(false)
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
      message.error(`File Too Large! Size Limit: ${MAX_SIZE}M`)
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
    <Container
      className="ml-auto mr-auto"
      sx={{
        maxWidth: `600px !important`,
        p: 2,
      }}
    >
      <Box className="flex justify-between items-center" sx={{ p: 0 }}>
        <div class="flex flex-row">
          <img src="/logo.png" alt="brand" height="80" />
          <Typography
            variant="h4"
            color="primary"
            sx={{
              position: 'relative',
              top: 14,
              fontFamily: 'DingDing',
            }}
          >
            Cloudflare Drop
          </Typography>
        </div>
        <IconButton
          sx={{
            position: 'relative',
            top: -10,
          }}
          href="https://github.com/oustn/cloudflare-drop"
          target="_blank"
        >
          <Github />
        </IconButton>
      </Box>
      <Paper elevation={6}>
        <Container className="flex flex-col" sx={{ p: 2 }}>
          <Box
            className="flex gap-2"
            sx={(theme) => ({
              alignItems: 'center',
              [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
                alignItems: 'start',
              },
            })}
          >
            <InputLabel>
              <Typography variant="h4" align="left">
                Sharing Code：
              </Typography>
            </InputLabel>
            <Code
              length={6}
              onChange={handleResolveFile.current}
              value={code}
            />
          </Box>

          <Divider
            sx={{
              mt: 2,
            }}
          />

          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={tab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleChangeTab}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Text" value="text" />
                  <Tab label="File" value="file" />
                </TabList>
              </Box>
              <TabPanel value="text" sx={{ height: 230, pl: 0, pr: 0 }}>
                <TextField
                  multiline
                  fullWidth
                  rows={8}
                  value={text}
                  onInput={handleTextInput}
                />
              </TabPanel>
              <TabPanel value="file" sx={{ height: 230, pl: 0, pr: 0, pb: 0 }}>
                <Box className="flex">
                  <Button
                    className="shrink-0"
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Select File
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {file && (
                    <div class="flex flex-col ml-2 min-w-0">
                      <FileIcon fontSize="small" color="disabled" />
                      <Typography color="textDisabled" noWrap lineHeight="16px">
                        {file.name}
                      </Typography>
                    </div>
                  )}
                </Box>
              </TabPanel>
            </TabContext>
          </Box>
          <Box>
            <Duration value={duration} onChange={updateDuration} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isEphemeral}
                  onChange={handleChangeEphemeral}
                />
              }
              label="Read and Burn"
            />
          </Box>
          <Box className="flex flex-row-reverse justify-between">
            <div>
              <PasswordSwitch value={password} onChange={updatePassword} />
              <Button
                variant="contained"
                disabled={
                  (tab === 'text' && !text) || (tab === 'file' && !file)
                }
                endIcon={<SendIcon />}
                sx={{
                  pl: 3,
                  pr: 3,
                }}
                onClick={handleShare}
              >
                Share
              </Button>
            </div>
            <Button variant="text" color="primary" onClick={toggleDrawer(true)}>
              History
              <ReceiptLongIcon fontSize="small" />
            </Button>
          </Box>
        </Container>
      </Paper>

      <Drawer open={drawerOpened} onClose={toggleDrawer(false)} anchor="right">
        <History
          onItemClick={(item) => {
            updateDrawerOpened(false)
            setCode(item.code)
          }}
        />
      </Drawer>

      <Message {...messageProps} />
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Progress open={progress !== null} value={progress ?? 0} />
    </Container>
  )
}
