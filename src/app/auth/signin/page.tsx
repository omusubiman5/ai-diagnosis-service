'use client'

import { signIn } from "next-auth/react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import GitHubIcon from "@mui/icons-material/GitHub"

function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function LineIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C6.48 2 2 5.82 2 10.5c0 4.21 3.74 7.74 8.79 8.4.34.07.81.22.92.51.1.26.07.67.03.93l-.15.88c-.05.27-.22 1.05.92.57 1.14-.47 6.16-3.63 8.4-6.21C22.64 13.59 22 12.11 22 10.5 22 5.82 17.52 2 12 2z"
        fill="#06C755"
      />
      <path
        d="M8.6 8.5H7.8c-.11 0-.2.09-.2.2v3.6c0 .11.09.2.2.2h.8c.11 0 .2-.09.2-.2V8.7c0-.11-.09-.2-.2-.2zm5.82 0h-.8c-.11 0-.2.09-.2.2v2.14l-1.93-2.24a.2.2 0 00-.16-.1h-.8c-.11 0-.2.09-.2.2v3.6c0 .11.09.2.2.2h.8c.11 0 .2-.09.2-.2V10l1.93 2.27a.2.2 0 00.16.08h.8c.11 0 .2-.09.2-.2V8.7c0-.11-.09-.2-.2-.2zm-3.45 3.03H9.5V8.7c0-.11-.09-.2-.2-.2h-.8c-.11 0-.2.09-.2.2v3.6c0 .11.09.2.2.2h2.47c.11 0 .2-.09.2-.2v-.57c0-.11-.09-.2-.2-.2zm5.64-2.23h-2.47c-.11 0-.2.09-.2.2v3.6c0 .11.09.2.2.2h2.47c.11 0 .2-.09.2-.2v-.57c0-.11-.09-.2-.2-.2H15.2v-.6h1.41c.11 0 .2-.09.2-.2v-.57c0-.11-.09-.2-.2-.2H15.2v-.6h1.41c.11 0 .2-.09.2-.2V9.5c0-.11-.09-.2-.2-.2z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="#000000"
      />
    </svg>
  )
}

const providers = [
  {
    id: "google",
    label: "Googleではじめる",
    icon: <GoogleIcon />,
    bgColor: "#FFFFFF",
    hoverBgColor: "#F8F9FA",
    borderColor: "#DADCE0",
    hoverBorderColor: "#BDBDBD",
    textColor: "#1A1A1A",
  },
  {
    id: "line",
    label: "LINEではじめる",
    icon: <LineIcon />,
    bgColor: "#06C755",
    hoverBgColor: "#05B34C",
    borderColor: "#06C755",
    hoverBorderColor: "#05B34C",
    textColor: "#FFFFFF",
  },
  {
    id: "github",
    label: "GitHubではじめる",
    icon: <GitHubIcon sx={{ fontSize: 24, color: "#FFFFFF" }} />,
    bgColor: "#24292F",
    hoverBgColor: "#1B1F23",
    borderColor: "#24292F",
    hoverBorderColor: "#1B1F23",
    textColor: "#FFFFFF",
  },
  {
    id: "twitter",
    label: "Xではじめる",
    icon: <XIcon />,
    bgColor: "#FFFFFF",
    hoverBgColor: "#F5F5F5",
    borderColor: "#CFD9DE",
    hoverBorderColor: "#999999",
    textColor: "#0F1419",
  },
]

export default function SignInPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FEF9E7 0%, #FFF8E1 50%, #FFFDE7 100%)",
        px: 2,
        py: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: "100%",
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          backgroundColor: "#FFFFFF",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            px: { xs: 3, sm: 5 },
            py: { xs: 4, sm: 5 },
            gap: 2.5,
          }}
        >
          {/* Logo */}
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: "#00D632",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#000000",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            60+
          </Avatar>

          {/* Title */}
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#1A1A1A",
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
              textAlign: "center",
              fontFamily: "var(--font-nanum-myeongjo), serif",
            }}
          >
            SKILL60+
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              color: "#555555",
              fontSize: { xs: "1rem", sm: "1.125rem" },
              textAlign: "center",
              lineHeight: 1.7,
              mb: 1,
            }}
          >
            パスワード不要で、かんたんにはじめられます
          </Typography>

          {/* Provider buttons */}
          {providers.map((provider) => (
            <Button
              key={provider.id}
              onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })}
              variant="outlined"
              fullWidth
              startIcon={provider.icon}
              aria-label={`${provider.label}`}
              sx={{
                minHeight: 56,
                fontSize: { xs: "1.05rem", sm: "1.15rem" },
                fontWeight: 600,
                borderRadius: 3,
                borderColor: provider.borderColor,
                borderWidth: 2,
                color: provider.textColor,
                backgroundColor: provider.bgColor,
                textTransform: "none",
                boxShadow: "none",
                px: 3,
                "&:hover": {
                  backgroundColor: provider.hoverBgColor,
                  borderColor: provider.hoverBorderColor,
                  borderWidth: 2,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  transform: "none",
                },
                "&:focus-visible": {
                  outline: "3px solid #4285F4",
                  outlineOffset: 2,
                },
              }}
            >
              {provider.label}
            </Button>
          ))}

          {/* Footer note */}
          <Typography
            sx={{
              color: "#888888",
              fontSize: "0.8rem",
              textAlign: "center",
              mt: 1,
              lineHeight: 1.6,
            }}
          >
            ログインすると、利用規約とプライバシーポリシーに同意したことになります
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
