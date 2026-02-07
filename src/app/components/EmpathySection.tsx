'use client';
import React from 'react';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import { Groups, TrendingDown, MonetizationOn } from '@mui/icons-material';
import Lottie from 'lottie-react';

const iconMap: Record<string, React.ReactElement> = {
    '孤独感': <Groups sx={{ fontSize: 80, color: 'primary.main' }} />,
    '自信喪失': <TrendingDown sx={{ fontSize: 80, color: 'warning.main' }} />,
    '収入への不満': <MonetizationOn sx={{ fontSize: 80, color: 'success.main' }} />,
};

const animationData = {
    v: "5.5.7", fr: 30, ip: 0, op: 60, w: 500, h: 500, nm: "Circle", ddd: 0, assets: [],
    layers: [{
        ddd: 0, ind: 1, ty: 4, nm: "Circle", sr: 1,
        ks: { o: { a: 0, k: 100 }, r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [360] }] }, p: { a: 0, k: [250, 250] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] } },
        shapes: [{ ty: "gr", it: [{ d: 1, ty: "el", s: { a: 0, k: [300, 300] }, p: { a: 0, k: [0, 0] }, nm: "Ellipse Path" }, { ty: "st", c: { a: 0, k: [0.2, 0.33, 0.58, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 10 }, nm: "Stroke" }, { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, nm: "Transform" }] }]
    }]
};

const WorryCard = ({ worry }: { worry: { title: string, description: string } }) => {
    return (
        <motion.div
            whileHover={{
                scale: 1.05,
                boxShadow: '0 8px 16px rgba(50, 205, 50, 0.3)'
            }}
            whileFocus={{
                outline: '3px solid #32CD32'
            }}
            whileTap={{
                scale: 0.98
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20
            }}
        >
            <Card sx={{ height: '100%', textAlign: 'center', borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ width: 120, height: 120, mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
                            <Lottie animationData={animationData} loop={true} />
                        </Box>
                        {iconMap[worry.title]}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                        {worry.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                        {worry.description}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const worries = [
    { title: '孤独感', description: '定年後、社会との繋がりが\n急になくなるのが怖い...' },
    { title: '自信喪失', description: '自分の経験が今の時代に\n通用するのか不安...' },
    { title: '収入への不満', description: '再雇用での大幅な年収ダウンに\n納得がいかない...' },
];

export default function EmpathySection() {
    return (
        <Box sx={{ py: 12, bgcolor: '#FFFFFF' }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h2"
                    align="center"
                    color="primary"
                    gutterBottom
                    sx={{ mb: 8, fontWeight: 'bold' }}
                >
                    こんなモヤモヤ、<br />抱えていませんか？
                </Typography>
                <Grid container spacing={4}>
                    {worries.map((worry, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <WorryCard worry={worry} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
