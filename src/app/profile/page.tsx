'use client'

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import CircularProgress from "@mui/material/CircularProgress"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

interface ProfileData {
  name: string
  email: string
  image: string
  createdAt: string | null
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({ open: false, message: "", severity: "success" })

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/user/profile")
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/auth/signin")
          return
        }
        throw new Error("Failed to fetch profile")
      }
      const data: ProfileData = await res.json()
      setProfile(data)
      setName(data.name)
    } catch {
      setSnackbar({
        open: true,
        message: "プロフィールの取得に失敗しました",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleSave = async () => {
    if (!name.trim()) {
      setSnackbar({
        open: true,
        message: "名前を入力してください",
        severity: "error",
      })
      return
    }

    if (name.trim().length > 50) {
      setSnackbar({
        open: true,
        message: "名前は50文字以内で入力してください",
        severity: "error",
      })
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "更新に失敗しました")
      }

      const updated: ProfileData = await res.json()
      setProfile(updated)
      setName(updated.name)

      await update({ name: updated.name })

      setSnackbar({
        open: true,
        message: "プロフィールを更新しました",
        severity: "success",
      })
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err instanceof Error ? err.message : "更新に失敗しました",
        severity: "error",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #FEF9E7 0%, #FFF8E1 50%, #FFFDE7 100%)",
        }}
      >
        <CircularProgress
          sx={{ color: "#00D632" }}
          size={48}
          aria-label="読み込み中"
        />
      </Box>
    )
  }

  const displayEmail = profile?.email || session?.user?.email || ""
  const displayImage = profile?.image || session?.user?.image || ""

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #FEF9E7 0%, #FFF8E1 50%, #FFFDE7 100%)",
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        {/* Back button */}
        <Button
          onClick={() => router.push("/dashboard")}
          startIcon={<ArrowBackIcon />}
          aria-label="ダッシュボードに戻る"
          sx={{
            mb: 3,
            minHeight: 56,
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#1A1A1A",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              boxShadow: "none",
              transform: "none",
            },
          }}
        >
          ダッシュボード
        </Button>

        <Card
          sx={{
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
              gap: 3,
            }}
          >
            {/* Page title */}
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
              プロフィール
            </Typography>

            {/* Avatar */}
            <Avatar
              src={displayImage}
              alt={name || "ユーザー"}
              sx={{
                width: 108,
                height: 108,
                border: "4px solid #00D632",
                fontSize: "2.5rem",
                fontWeight: 700,
                bgcolor: "#00D632",
                color: "#000000",
              }}
            >
              {name ? name.charAt(0).toUpperCase() : "?"}
            </Avatar>

            {/* Email (read-only) */}
            <Box sx={{ width: "100%" }}>
              <Typography
                component="label"
                sx={{
                  display: "block",
                  mb: 0.5,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#555555",
                  letterSpacing: "0.02em",
                }}
              >
                メールアドレス
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "1.125rem", sm: "1.25rem" },
                  color: "#1A1A1A",
                  backgroundColor: "#F5F5F5",
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  wordBreak: "break-all",
                  border: "1px solid #E0E0E0",
                }}
              >
                {displayEmail}
              </Typography>
            </Box>

            {/* Name (editable) */}
            <Box sx={{ width: "100%" }}>
              <Typography
                component="label"
                htmlFor="profile-name"
                sx={{
                  display: "block",
                  mb: 0.5,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#555555",
                  letterSpacing: "0.02em",
                }}
              >
                お名前
              </Typography>
              <TextField
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="お名前を入力してください"
                fullWidth
                inputProps={{
                  maxLength: 50,
                  "aria-label": "お名前",
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#FFFFFF",
                    fontSize: { xs: "1.125rem", sm: "1.25rem" },
                    minHeight: 56,
                    "& fieldset": {
                      borderColor: "#DADCE0",
                      borderWidth: 2,
                    },
                    "&:hover fieldset": {
                      borderColor: "#BDBDBD",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00D632",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#1A1A1A",
                    padding: "14px 16px",
                    "&::placeholder": {
                      color: "#999999",
                      opacity: 1,
                    },
                  },
                }}
              />
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "0.75rem",
                  color: "#999999",
                  textAlign: "right",
                }}
              >
                {name.length}/50
              </Typography>
            </Box>

            {/* Save button */}
            <Button
              onClick={handleSave}
              variant="contained"
              fullWidth
              disabled={saving || name.trim() === (profile?.name ?? "")}
              aria-label="プロフィールを保存"
              sx={{
                mt: 1,
                minHeight: 56,
                fontSize: { xs: "1.125rem", sm: "1.25rem" },
                fontWeight: 700,
                borderRadius: 3,
                textTransform: "none",
                backgroundColor: "#00D632",
                color: "#000000",
                boxShadow: "0 4px 14px rgba(0, 214, 50, 0.39)",
                "&:hover": {
                  backgroundColor: "#00B82B",
                  boxShadow: "0 6px 20px rgba(0, 214, 50, 0.23)",
                },
                "&:disabled": {
                  backgroundColor: "#E0E0E0",
                  color: "#999999",
                  boxShadow: "none",
                },
              }}
            >
              {saving ? (
                <CircularProgress size={24} sx={{ color: "#000000" }} />
              ) : (
                "保存する"
              )}
            </Button>

            {/* Account creation date */}
            {profile?.createdAt && (
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: "#888888",
                  textAlign: "center",
                  mt: 1,
                }}
              >
                アカウント作成日:{" "}
                {new Date(profile.createdAt).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            fontSize: "1rem",
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
