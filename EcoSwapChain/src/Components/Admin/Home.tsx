import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    ButtonGroup,
    Paper,
    CircularProgress,
    useTheme
} from '@mui/material';
import { TrendingUp, SwapHoriz, LocalFlorist } from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

// Define types for data
interface DataPoint {
    name: string;
    minted: number;
    transferred: number;
    carbon: number;
}

interface DashboardData {
    timeSeriesData: DataPoint[];
    totals: {
        minted: number;
        transferred: number;
        carbonCredits: number;
    };
}

const generateMockData = (period: 'week' | 'month' | 'quarter'): DashboardData => {
    const daysInPeriod = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    const labels: string[] = [];
    const data: DataPoint[] = [];

    let mintedTotal = 0;
    let transferredTotal = 0;
    let carbonCreditsTotal = 0;

    for (let i = 0; i < daysInPeriod; i++) {
        labels.push(period === 'quarter' ? `Week ${Math.floor(i / 7) + 1}` : `Day ${i + 1}`);
        const minted = Math.floor(Math.random() * 50) + 10;
        const transferred = Math.floor(Math.random() * 40) + 5;
        const carbon = Math.floor(Math.random() * 30) + 15;

        mintedTotal += minted;
        transferredTotal += transferred;
        carbonCreditsTotal += carbon;

        data.push({ name: labels[i], minted, transferred, carbon });
    }

    return { timeSeriesData: data, totals: { minted: mintedTotal, transferred: transferredTotal, carbonCredits: carbonCreditsTotal } };
};

const NFTAdminDashboard: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const theme = useTheme();

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const data = generateMockData(timeRange);
            setDashboardData(data);
            setIsLoading(false);
        }, 800);
    }, [timeRange]);

    if (isLoading || !dashboardData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: theme.palette.background.default }}>
                <CircularProgress color="primary" size={60} />
            </Box>
        );
    }

    const { timeSeriesData, totals } = dashboardData;
    const displayData = timeRange === 'week' ? timeSeriesData : timeSeriesData.filter((_, index) => timeRange === 'month' ? index % 3 === 0 : index % 7 === 0);

    return (
        <Box sx={{ minHeight: '100vh', background: theme.palette.background.default,  }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: theme.shape.borderRadius, background: theme.palette.background.paper }}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">NFT Analytics Dashboard</Typography>
                            <Typography variant="body1" color="text.secondary">Monitor platform performance and track key metrics</Typography>
                        </Box>
                        <ButtonGroup variant="contained">
                            {['week', 'month', 'quarter'].map((range) => (
                                <Button key={range} color={timeRange === range ? 'primary' : 'secondary'} onClick={() => setTimeRange(range as 'week' | 'month' | 'quarter')}>
                                    {range.charAt(0).toUpperCase() + range.slice(1)}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </Paper>
                </Grid>

                {['minted', 'transferred', 'carbonCredits'].map((key, index) => (
                    <Grid key={key} item xs={12} md={4}>
                        <Card elevation={2} sx={{ height: '100%' }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: theme.palette.primary.main }}>
                                    {[<TrendingUp />, <SwapHoriz />, <LocalFlorist />][index]}
                                    <Typography variant="h6" sx={{ ml: 1 }}>{key.replace(/([A-Z])/g, ' $1')}</Typography>
                                </Box>
                                <Typography variant="h3" fontWeight="bold">{totals[key as keyof typeof totals].toLocaleString()}</Typography>
                                <Typography variant="body2" color="text.secondary">During selected time period</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {['minted', 'transferred', 'carbon'].map((key, index) => (
                    <Grid key={key} item xs={12}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" mb={3}>{key.replace(/([A-Z])/g, ' $1')}</Typography>
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={displayData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey={key} fill={[theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.main][index]} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default NFTAdminDashboard;
