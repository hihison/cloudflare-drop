import { ComponentChildren, cloneElement, isValidElement } from 'preact'
import { useState } from 'preact/hooks'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'

import { Message, useMessage, Github } from './'

export interface LayoutProps {
  children?: ComponentChildren
  setBackdropOpen?: (open: boolean) => void
  message?: { error(message: string): void; success(message: string): void }
}

export function Layout({ children }: LayoutProps) {
  const [messageProps, message] = useMessage()

  const [backdropOpen, setBackdropOpen] = useState(false)

  const injectedChildren = Array.isArray(children)
    ? children.map((child) =>
        isValidElement(child)
          ? cloneElement(child, { setBackdropOpen, message })
          : child,
      )
    : isValidElement(children)
      ? cloneElement(children, { setBackdropOpen, message })
      : children

  return (
    <Container
      className="ml-auto mr-auto"
      sx={{
        maxWidth: `1200px !important`,
        p: 2,
        '@media (max-width: 768px)': {
          p: 1,
        },
        '@media (max-width: 480px)': {
          p: 0.5,
        },
      }}
    >
      <div
        class="flex flex-col mr-auto ml-auto"
        style="max-height: calc(100vh - 32px)"
      >
        <Box 
          className="flex justify-between items-center" 
          sx={{ 
            p: 0,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Link 
            href="/" 
            className="flex flex-row no-underline"
            sx={{
              alignItems: 'center',
              '@media (max-width: 480px)': {
                flexDirection: 'column',
                textAlign: 'center',
              },
            }}
          >
            <img 
              src="/logo.png" 
              alt="brand" 
              height="80"
              style={{
                height: '80px',
              }}
            />
            <Typography
              variant="h4"
              color="primary"
              sx={{
                fontFamily: 'DingDing',
                '@media (max-width: 768px)': {
                  fontSize: '1.75rem',
                },
                '@media (max-width: 480px)': {
                  fontSize: '1.5rem',
                  marginTop: 1,
                },
              }}
            >
              <span 
                class="relative" 
                style={{
                  top: '14px',
                }}
              >
                Cloudflare Drop
              </span>
            </Typography>
          </Link>
          <IconButton
            sx={{
              position: 'relative',
              top: -10,
              '@media (max-width: 480px)': {
                top: 0,
                marginTop: 1,
              },
            }}
            href="https://github.com/oustn/cloudflare-drop"
            target="_blank"
          >
            <Github />
          </IconButton>
        </Box>
        {injectedChildren}
      </div>
      <Message {...messageProps} />
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  )
}
