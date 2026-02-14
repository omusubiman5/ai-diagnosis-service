'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
    Drawer,
    IconButton,
    Link,
    Divider,
    Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useSession, signOut } from 'next-auth/react';
import NextLink from 'next/link';

const NAV_LINKS = [
    '会社概要',
    'プライバシーポリシー',
    '利用規約',
    'よくある質問',
    'お問い合わせ',
] as const;

export default function Header() {
    const { data: session, status } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    return (
        <>
            <Box
                component="header"
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.3s ease',
                    bgcolor: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
                }}
            >
                <Container maxWidth="xl">
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-nanum-myeongjo)',
                                fontWeight: 800,
                                fontSize: '1.25rem',
                                color: '#000',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            SKILL60+
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="center">
                            {status !== 'loading' && !session && (
                                <>
                                    <Button
                                        component={NextLink}
                                        href="/auth/signin"
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            color: scrolled ? '#000' : '#000',
                                            borderColor: scrolled ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.3)',
                                            fontSize: '0.85rem',
                                            px: 2,
                                            py: 0.7,
                                            borderRadius: '50px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            boxShadow: 'none',
                                            '&:hover': {
                                                borderColor: '#000',
                                                bgcolor: 'rgba(0,0,0,0.04)',
                                                boxShadow: 'none',
                                            },
                                        }}
                                    >
                                        ログイン
                                    </Button>
                                    <Button
                                        component={NextLink}
                                        href="/auth/signin"
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            bgcolor: '#000',
                                            color: '#fff',
                                            fontSize: '0.85rem',
                                            px: 2.5,
                                            py: 0.8,
                                            borderRadius: '50px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            boxShadow: 'none',
                                            '&:hover': {
                                                bgcolor: '#222',
                                                boxShadow: 'none',
                                            },
                                        }}
                                    >
                                        新規登録
                                    </Button>
                                </>
                            )}

                            {session && (
                                <IconButton
                                    component={NextLink}
                                    href="/dashboard"
                                    aria-label="マイページ"
                                    sx={{
                                        p: 0.5,
                                    }}
                                >
                                    <Avatar
                                        src={session.user?.image ?? ''}
                                        alt={session.user?.name ?? ''}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            fontSize: '0.85rem',
                                            bgcolor: '#00D632',
                                            color: '#000',
                                        }}
                                    >
                                        {session.user?.name?.charAt(0) ?? '?'}
                                    </Avatar>
                                </IconButton>
                            )}

                            <IconButton
                                onClick={toggleDrawer(true)}
                                aria-label="メニューを開く"
                                sx={{
                                    color: '#000',
                                    width: 40,
                                    height: 40,
                                    '&:hover': {
                                        bgcolor: 'rgba(0,0,0,0.04)',
                                    },
                                }}
                            >
                                <MenuIcon sx={{ fontSize: '1.4rem' }} />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* Navigation Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                slotProps={{
                    paper: {
                        sx: {
                            width: '100%',
                            maxWidth: { xs: '100%', sm: 420 },
                            bgcolor: '#000',
                            color: '#FFF',
                        },
                    },
                    backdrop: {
                        sx: {
                            bgcolor: 'rgba(0,0,0,0.6)',
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        px: { xs: 3, sm: 5 },
                        py: 4,
                    }}
                    role="navigation"
                    aria-label="サイトナビゲーション"
                >
                    {/* Drawer Header */}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 6 }}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-nanum-myeongjo)',
                                fontWeight: 800,
                                fontSize: '1.25rem',
                                color: '#FFF',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            SKILL60+
                        </Typography>
                        <IconButton
                            onClick={toggleDrawer(false)}
                            aria-label="メニューを閉じる"
                            sx={{
                                color: '#FFF',
                                width: 40,
                                height: 40,
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.08)',
                                },
                            }}
                        >
                            <CloseIcon sx={{ fontSize: '1.4rem' }} />
                        </IconButton>
                    </Stack>

                    {/* Navigation Links */}
                    <Stack spacing={0} sx={{ mb: 6 }}>
                        {NAV_LINKS.map((label) => (
                            <Link
                                key={label}
                                href="#"
                                onClick={toggleDrawer(false)}
                                sx={{
                                    color: '#FFF',
                                    textDecoration: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 400,
                                    py: 2,
                                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                                    transition: 'color 0.2s ease',
                                    display: 'block',
                                    '&:hover': {
                                        color: 'rgba(255,255,255,0.6)',
                                    },
                                }}
                            >
                                {label}
                            </Link>
                        ))}
                    </Stack>

                    {/* Auth Links */}
                    {status !== 'loading' && (
                        <>
                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 3 }} />
                            {session ? (
                                <Stack spacing={0} sx={{ mb: 4 }}>
                                    <Link
                                        component={NextLink}
                                        href="/dashboard"
                                        onClick={toggleDrawer(false)}
                                        sx={{
                                            color: '#FFF',
                                            textDecoration: 'none',
                                            fontSize: '1.1rem',
                                            fontWeight: 400,
                                            py: 2,
                                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            '&:hover': { color: 'rgba(255,255,255,0.6)' },
                                        }}
                                    >
                                        <DashboardIcon sx={{ fontSize: '1.2rem' }} />
                                        マイページ
                                    </Link>
                                    <Link
                                        component={NextLink}
                                        href="/profile"
                                        onClick={toggleDrawer(false)}
                                        sx={{
                                            color: '#FFF',
                                            textDecoration: 'none',
                                            fontSize: '1.1rem',
                                            fontWeight: 400,
                                            py: 2,
                                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            '&:hover': { color: 'rgba(255,255,255,0.6)' },
                                        }}
                                    >
                                        <PersonIcon sx={{ fontSize: '1.2rem' }} />
                                        プロフィール
                                    </Link>
                                    <Link
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setDrawerOpen(false);
                                            signOut({ callbackUrl: '/' });
                                        }}
                                        sx={{
                                            color: 'rgba(255,255,255,0.6)',
                                            textDecoration: 'none',
                                            fontSize: '1.1rem',
                                            fontWeight: 400,
                                            py: 2,
                                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            '&:hover': { color: 'rgba(255,255,255,0.4)' },
                                        }}
                                    >
                                        <LogoutIcon sx={{ fontSize: '1.2rem' }} />
                                        ログアウト
                                    </Link>
                                </Stack>
                            ) : (
                                <Stack spacing={2} sx={{ mb: 4 }}>
                                    <Button
                                        component={NextLink}
                                        href="/auth/signin"
                                        onClick={toggleDrawer(false)}
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            bgcolor: '#FFF',
                                            color: '#000',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            py: 1.5,
                                            borderRadius: '50px',
                                            textTransform: 'none',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                bgcolor: 'rgba(255,255,255,0.9)',
                                                boxShadow: 'none',
                                            },
                                        }}
                                    >
                                        ログイン / 新規登録
                                    </Button>
                                </Stack>
                            )}
                        </>
                    )}

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 4 }} />

                    {/* Contact Info */}
                    <Stack spacing={3} sx={{ mb: 'auto' }}>
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    color: 'rgba(255,255,255,0.4)',
                                    mb: 0.5,
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                お問い合わせ
                            </Typography>
                            <Link
                                href="mailto:support@skill60plus.jp"
                                sx={{
                                    color: '#FFF',
                                    textDecoration: 'none',
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                support@skill60plus.jp
                            </Link>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    color: 'rgba(255,255,255,0.4)',
                                    mb: 0.5,
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                チャットサポート
                            </Typography>
                            <Typography sx={{ fontSize: '0.95rem', color: '#FFF' }}>
                                アプリ内で24時間対応
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Copyright */}
                    <Typography
                        sx={{
                            fontFamily: 'var(--font-ibm-plex-mono)',
                            fontSize: '0.7rem',
                            color: 'rgba(255,255,255,0.25)',
                            pt: 4,
                        }}
                    >
                        &copy; {new Date().getFullYear()} SKILL60+. All rights reserved.
                    </Typography>
                </Box>
            </Drawer>
        </>
    );
}
