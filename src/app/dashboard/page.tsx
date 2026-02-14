'use client'

import { useSession, signOut } from 'next-auth/react'
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import ChatIcon from '@mui/icons-material/Chat'
import LogoutIcon from '@mui/icons-material/Logout'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress
          size={48}
          sx={{ color: '#5D4037' }}
          aria-label="読み込み中"
        />
      </Box>
    )
  }

  const userName = session?.user?.name ?? 'ゲスト'
  const userEmail = session?.user?.email ?? ''
  const userImage = session?.user?.image ?? ''

  const navItems = [
    {
      label: 'プロフィール設定',
      href: '/profile',
      icon: <PersonIcon sx={{ fontSize: 36, color: '#5D4037' }} />,
      description: 'お名前やプロフィールを編集',
    },
    {
      label: 'おしゃべりスキル診断',
      href: '/',
      icon: <ChatIcon sx={{ fontSize: 36, color: '#5D4037' }} />,
      description: '5問でわかるあなたの市場価値',
    },
  ]

  return (
    <Box
      sx={{
        minHeight: '80vh',
        backgroundColor: '#FFF8F0',
        borderRadius: 4,
        p: { xs: 3, sm: 4 },
      }}
    >
      {/* Welcome section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
          pt: 2,
        }}
      >
        <Avatar
          src={userImage}
          alt={userName}
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            border: '3px solid #D7CCC8',
            bgcolor: '#EFEBE9',
            fontSize: '2rem',
            color: '#5D4037',
          }}
        >
          {userName.charAt(0)}
        </Avatar>

        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontSize: { xs: '1.4rem', sm: '1.6rem' },
            fontWeight: 700,
            color: '#3E2723',
            mb: 0.5,
            textAlign: 'center',
          }}
        >
          {`こんにちは、${userName}さん！`}
        </Typography>

        {userEmail && (
          <Typography
            sx={{
              fontSize: '1rem',
              color: '#795548',
            }}
          >
            {userEmail}
          </Typography>
        )}
      </Box>

      {/* Navigation cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {navItems.map((item) => (
          <Grid key={item.href} size={{ xs: 12, sm: 6 }}>
            <Card
              sx={{
                borderRadius: 3,
                backgroundColor: '#FFFFFF',
                border: '1px solid #D7CCC8',
                boxShadow: '0 2px 8px rgba(93, 64, 55, 0.08)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(93, 64, 55, 0.15)',
                },
              }}
            >
              <CardActionArea
                component={Link}
                href={item.href}
                sx={{
                  minHeight: 140,
                  p: 0,
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                    px: 3,
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: '#EFEBE9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#3E2723',
                      letterSpacing: '0.02em',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.95rem',
                      color: '#795548',
                      textAlign: 'center',
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Logout button */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={() => signOut({ callbackUrl: '/' })}
          sx={{
            minHeight: 56,
            minWidth: 200,
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: 9999,
            borderColor: '#BCAAA4',
            color: '#5D4037',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            '&:hover': {
              borderColor: '#5D4037',
              backgroundColor: 'rgba(93, 64, 55, 0.04)',
              transform: 'none',
              boxShadow: 'none',
            },
          }}
        >
          ログアウト
        </Button>
      </Box>
    </Box>
  )
}
