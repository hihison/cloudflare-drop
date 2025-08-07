import { useState, useEffect } from 'preact/hooks'
import { useLanguage } from '../helpers/i18n'

export function IOSInstallPrompt() {
  const { t } = useLanguage()
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detect iOS device
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isStandalone = ('standalone' in navigator) && (navigator as any).standalone
    const isInWebAppiOS = iOS && isStandalone
    
    setIsIOS(iOS)

    // Show banner only on iOS Safari (not in PWA mode)
    if (iOS && !isInWebAppiOS) {
      const bannerShown = localStorage.getItem('iosInstallBannerShown')
      if (!bannerShown) {
        // Show banner after 3 seconds
        setTimeout(() => {
          setShowBanner(true)
        }, 3000)
      }
    }
  }, [])

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('iosInstallBannerShown', 'true')
  }

  const handleInstallGuide = () => {
    // Show install instructions
    alert(t('pwa.iosInstallInstructions', 
      '1. Tap the Share button in Safari\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to install the app'
    ))
    handleDismiss()
  }

  if (!isIOS || !showBanner) {
    return null
  }

  return (
    <div className="ios-install-banner">
      <div style={{ marginBottom: '8px' }}>
        📱 {t('pwa.installPrompt', 'Install Cloudflare Drop for quick access!')}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          onClick={handleInstallGuide}
          style={{
            background: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          {t('pwa.howToInstall', 'How to Install')}
        </button>
        <button 
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          {t('common.close', 'Close')}
        </button>
      </div>
    </div>
  )
}
