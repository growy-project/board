'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Snackbar, Alert } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useQueryClient } from '@tanstack/react-query'
import { useAppTheme } from '@/app/context/ThemeContext'
import { useAuth } from '@/app/context/AuthContext'
import { trackEvent } from '@/telemetry/appInsights'
import { markLandingSeen } from '@/utils/landingGate'
import { prefetchAllExchangeDateRanges } from '@/app/(DashboardLayout)/queries/dateRangeQuery'
import ScanSetupWizard from '@/app/(DashboardLayout)/components/wizard/ScanSetupWizard'
import ContactDialog from '@/app/(DashboardLayout)/components/landing/ContactDialog'

const fadeInDown = `
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes pulseFade {
    0%, 100% { opacity: 0.9; }
    50% { opacity: 0.2; }
  }
  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-200px);
    }
    to {
      opacity: 1;
      transform: translateX(300px);
    }
  }
`

const animated = (delay: string): React.CSSProperties => ({
  opacity: 0,
  animation: `fadeInDown 0.6s ease forwards`,
  animationDelay: delay,
})

export default function Page() {
  const { mode } = useAppTheme()
  const { user, token } = useAuth()
  const t = useTranslations('landing')
  const tBrand = useTranslations('brand')
  const queryClient = useQueryClient()
  const arrowColor = mode === 'light' ? '#1a1a1a' : '#ffffff'
  const [wizardOpen, setWizardOpen] = useState(false)
  const openWizard = () => setWizardOpen(true)
  const [contactOpen, setContactOpen] = useState(false)
  const [loginPromptOpen, setLoginPromptOpen] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)

  const handleContactClick = () => {
    if (!user || !token) {
      setLoginPromptOpen(true)
      return
    }
    setContactOpen(true)
  }

  useEffect(() => {
    markLandingSeen()
    prefetchAllExchangeDateRanges(queryClient)
  }, [queryClient])

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 160px)',
          padding: '0 5vw',
          boxSizing: 'border-box',
          filter: wizardOpen ? 'blur(2px)' : 'none',
          opacity: wizardOpen ? 0.85 : 1,
          transition: 'filter 0.3s ease, opacity 0.3s ease',
        }}
      >
        <style>{fadeInDown}</style>

        <div onClick={openWizard} style={{ cursor: 'pointer', ...animated('0s') }}>
          <h1>{tBrand('name')}</h1>
        </div>

        <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '2rem', flex: 1, marginTop: '40px', ...animated('0.3s') }}>
          <div
            aria-hidden="true"
            onClick={openWizard}
            style={{
              position: 'absolute',
              top: '50%',
              left: '0%',
              width: '240px',
              height: '240px',
              cursor: 'pointer',
              background: 'transparent',
              animation: 'slideInFromLeft 2s ease-out 0.9s forwards, pulseFade 2.6s ease-in-out 2.9s infinite',
              opacity: 0,
              transform: 'translateX(-200px)',
            }}
          >
            <svg
              viewBox="0 0 30 30"
              fill="none"
              stroke={arrowColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: '100%', height: '100%', opacity: 0.9 }}
            >
              <polyline points="10,6 22,15 10,24" />
            </svg>
          </div>
          <div onClick={openWizard} style={{ flex: '1 1 300px', minWidth: 0, cursor: 'pointer' }}>
            <h2 style={{ lineHeight: '1.8' }}>
              {t('heroBody')}
            </h2>
            <div style={{ marginTop: '110px', ...animated('2.9s') }}>
              <Image
                src="/grid.webp"
                alt="Top growth grid"
                width={240}
                height={120}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>
          <div onClick={openWizard} style={{ flex: '0 0 auto', cursor: 'pointer', ...animated('0.3s') }}>
            <Image
              src="/chart.webp"
              alt="Stock momentum chart"
              width={600}
              height={500}
              style={{ maxWidth: '100%', height: 'auto', marginTop: '100px' }}
            />
          </div>
        </div>


    <footer style={{
            padding: '4px 0',         // Controls height via internal spacing
            display: 'flex',
            justifyContent: 'flex-end',
            fontSize: '.9rem',
            ...animated('0.6s')
                    }}>
          <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>
            {t('footerTerms')}
          </Link>
          <span
            role="button"
            tabIndex={0}
            onClick={handleContactClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleContactClick()
              }
            }}
            style={{ marginLeft: '50px', cursor: 'pointer' }}
          >
            {t('footerContact')}
          </span>
        </footer>
      </div>

      <ScanSetupWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />

      <ContactDialog
        open={contactOpen}
        token={token ?? ''}
        onClose={() => setContactOpen(false)}
        onSent={() => {
          setContactOpen(false)
          setContactSuccess(true)
          trackEvent('ContactMessageSent')
        }}
      />

      <Snackbar
        open={loginPromptOpen}
        autoHideDuration={4000}
        onClose={() => setLoginPromptOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="warning"
          variant="filled"
          onClose={() => setLoginPromptOpen(false)}
        >
          {t('contact.loginPrompt')}
        </Alert>
      </Snackbar>

      <Snackbar
        open={contactSuccess}
        autoHideDuration={4000}
        onClose={() => setContactSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setContactSuccess(false)}
        >
          {t('contact.success')}
        </Alert>
      </Snackbar>
    </>
  )
}
