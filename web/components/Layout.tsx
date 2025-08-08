import { ComponentChildren, cloneElement, isValidElement } from 'preact'
import { useState } from 'preact/hooks'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

import { Message, useMessage, LanguageSelector, InstallPrompt } from './'

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
        p: 1,
        '@media (max-width: 768px)': {
          p: 0.5,
        },
        '@media (max-width: 480px)': {
          p: 0.25,
        },
      }}
    >
      <div
        class="flex flex-col mr-auto ml-auto"
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
              height="48"
              style={{
                height: '48px',
              }}
            />
            <Typography
              variant="h5"
              color="primary"
              sx={{
                fontFamily: 'DingDing',
                '@media (max-width: 768px)': {
                  fontSize: '1.5rem',
                },
                '@media (max-width: 480px)': {
                  fontSize: '1.25rem',
                  marginTop: 0.5,
                },
              }}
            >
              <span 
                class="relative" 
                style={{
                  top: '8px',
                }}
              >
                Cloudflare Drop
              </span>
            </Typography>
          </Link>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '@media (max-width: 480px)': {
                marginTop: 1,
              },
            }}
          >
            <LanguageSelector />
          </Box>
        </Box>
        {injectedChildren}
      </div>
      <Message {...messageProps} />
      <InstallPrompt />
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  )
}
