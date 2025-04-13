import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    Divider,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Chip,
    Fade,
    Zoom,
    useTheme,
    SelectChangeEvent,
    Container,
    Grid2
} from '@mui/material';
import { Add, LocationOn, FilterAlt, Refresh } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ReadOnlyMarkersMap from './HubConnectionMap';
import { Link } from 'react-router';
import { API } from '../API/api';
import { GraphRef } from './HubConnectionMap';
import { get } from 'http';

// Define TypeScript interfaces
export interface Hub {
    id: number;
    latitude: number;
    longitude: number;
    district: string;
    state: string;
    pincode: string;
    hubType: HubType;
}

type HubType = 'Distribution' | 'Storage' | 'Collection';

interface FilterState {
    district: string;
    state: string;
    pincode: string;
    hubType: string;
}

interface Marker {
    id: number;
    position: [number, number];  // Tuple representing [latitude, longitude]
    title: string;
}



// Get unique values for filters
const getUniqueValues = <T, K extends keyof T>(data: T[], key: K): T[K][] => {
    return [...new Set(data.map(item => item[key]))];
};

const MotionListItem = motion(ListItem);

export default function HubManagementDashboard(): JSX.Element {
    const theme = useTheme();
    const [hubs, setHubs] = useState<Hub[]>([{
        id: 1,
        latitude: 28.6139,
        longitude: 77.2090,
        district: 'Central Delhi',
        state: 'Delhi',
        pincode: '110001',
        hubType: 'Distribution'
    }]);

    const graphMapRef = useRef<GraphRef>(null);

    const [markers, setMarkers] = useState<Marker[]>([
        {
            id: 1,
            position: [28.6139, 77.2090] as [number, number],
            title: 'Central Delhi'
        }
    ])

    const [filters, setFilters] = useState<FilterState>({
        district: '',
        state: '',
        pincode: '',
        hubType: ''
    });
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

    const [addMode, setAddMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

    const [onFilter, setOnFilter] = useState<boolean>(false);


    // Generate unique values for filter options
    const districts: string[] = getUniqueValues(hubs, 'district');
    const states: string[] = getUniqueValues(hubs, 'state');
    const pincodes: string[] = getUniqueValues(hubs, 'pincode');
    const hubTypes: HubType[] = getUniqueValues(hubs, 'hubType');

    // Apply filters

    const setConnection = (hubs: Hub[]): Marker[] => {
        return hubs.map(hub => ({
            id: hub.id,
            position: [hub.latitude, hub.longitude] as [number, number],
            title: hub.district
        }));
    };

    const fetchHubs = async () => {
        const { data } = await API.get("admin/hub/list");
        setHubs(data);
        setMarkers(setConnection(data));
    }

    useEffect(() => {
        fetchHubs();
        console.log(markers)
    }, [])

    useEffect(() => {
        let filteredHubs = [...hubs];

        if (filters.district) {
            filteredHubs = filteredHubs.filter(hub => hub.district === filters.district);
        }

        if (filters.state) {
            filteredHubs = filteredHubs.filter(hub => hub.state === filters.state);
        }

        if (filters.pincode) {
            filteredHubs = filteredHubs.filter(hub => hub.pincode === filters.pincode);
        }

        if (filters.hubType) {
            filteredHubs = filteredHubs.filter(hub => hub.hubType === filters.hubType as HubType);
        }

        setHubs(filteredHubs);
    }, [filters]);

    const handleFilterChange = (event: SelectChangeEvent): void => {
        setOnFilter(true)
        const { name, value } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const resetFilters = (): void => {
        setOnFilter(false)
        setFilters({
            district: '',
            state: '',
            pincode: '',
            hubType: ''
        });
    };

    const getHubTypeColor = (hubType: HubType): string => {
        switch (hubType) {
            case 'Distribution':
                return theme.palette.primary.main;
            case 'Storage':
                return theme.palette.secondary.main;
            case 'Collection':
                return theme.palette.accent.main;
            default:
                return theme.palette.primary.main;
        }
    };

    const handleAddMode = () => {
        setAddMode(!addMode);
        if (!addMode) graphMapRef.current?.clearAddPath();
    };

    const handleDeleteMode = () => {
        setDeleteMode(!deleteMode);
        if (deleteMode) graphMapRef.current?.clearDeletePath();
    };

    const handleOptimization = async () => {
        await graphMapRef.current?.handleRouteOptimization();
    }

    return (
        <Container maxWidth={"xl"} disableGutters sx={{
            backgroundColor: "#F6F4F0", // Light background
        }}>
            <Typography
                variant="h4"
                sx={{ fontWeight: 'bold', pb: 3 }}
                textAlign={"center"}
            >
                Hub Management Dashboard
            </Typography>

            <Box>
                <Grid container spacing={4} >
                    <Grid item xs={12} md={1} sx={{display: 'flex', justifyContent: 'space-around', flexDirection: 'column'}}>
                        <Button
                            variant='gradient'
                            onClick={handleAddMode}
                        >
                            { addMode ? 'Cancel' : 'Add Route' }
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleDeleteMode}
                        >
                            { deleteMode ? 'Cancel' : 'Delete Route' }
                        </Button>
                        <Button
                       onClick={handleOptimization}
                        >
                            Optimize Path
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                            <Paper
                                elevation={3}
                                sx={{
                                    height: 500,
                                    overflow: 'hidden',
                                    position: 'relative',
                                }}
                            >
                                <ReadOnlyMarkersMap
                                    nodes={markers}
                                    addMode={addMode}
                                    deleteMode={deleteMode}
                                    setAddMode={setAddMode}
                                    setDeleteMode={setDeleteMode}
                                    ref={graphMapRef}
                                />
                            </Paper>
                        </Zoom>
                    </Grid>

                    {/* Hub List Section - 30% */}
                    <Grid item xs={12} md={4}>
                        <Fade in={true} style={{ transitionDelay: '500ms' }}>
                            <Card
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 0,
                                    overflow: 'hidden'
                                }}
                            >
                                <Box sx={{
                                    p: 2,
                                    bgcolor: 'surface.main',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottom: '1px solid',
                                    borderColor: 'divider'
                                }}>

                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Hub List
                                    </Typography>
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                            startIcon={<FilterAlt />}
                                            sx={{ mr: 1 }}
                                        >
                                            Filter
                                        </Button>

                                        <Link to="/admin/hub/add/">
                                            <Button
                                                variant="gradient"
                                                startIcon={<Add />}
                                                size="small"
                                                component={motion.button}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Add Hub
                                            </Button>
                                        </Link>
                                    </Box>
                                </Box>

                                {/* Filters Section */}
                                <Fade in={isFiltersOpen}>
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: 'background.paper',
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        display: isFiltersOpen ? 'block' : 'none'
                                    }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>District</InputLabel>
                                                    <Select
                                                        name="district"
                                                        value={filters.district}
                                                        label="District"
                                                        onChange={handleFilterChange}
                                                    >
                                                        <MenuItem value="">All</MenuItem>
                                                        {districts.map((district: string) => (
                                                            <MenuItem key={district} value={district}>{district}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>State</InputLabel>
                                                    <Select
                                                        name="state"
                                                        value={filters.state}
                                                        label="State"
                                                        onChange={handleFilterChange}
                                                    >
                                                        <MenuItem value="">All</MenuItem>
                                                        {states.map((state: string) => (
                                                            <MenuItem key={state} value={state}>{state}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Pincode</InputLabel>
                                                    <Select
                                                        name="pincode"
                                                        value={filters.pincode}
                                                        label="Pincode"
                                                        onChange={handleFilterChange}
                                                    >
                                                        <MenuItem value="">All</MenuItem>
                                                        {pincodes.map((pincode: string) => (
                                                            <MenuItem key={pincode} value={pincode}>{pincode}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Hub Type</InputLabel>
                                                    <Select
                                                        name="hubType"
                                                        value={filters.hubType}
                                                        label="Hub Type"
                                                        onChange={handleFilterChange}
                                                    >
                                                        <MenuItem value="">All</MenuItem>
                                                        {hubTypes.map((type: HubType) => (
                                                            <MenuItem key={type} value={type}>{type}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    size="small"
                                                    onClick={resetFilters}
                                                    startIcon={<Refresh />}
                                                >
                                                    Reset Filters
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Fade>

                                {/* Hub List */}
                                <Box sx={{
                                    overflow: 'auto',
                                    p: 0
                                }}>
                                    <List sx={{
                                        height: 400,
                                        overflow: 'scroll',
                                        flexGrow: 1,
                                        p: 3
                                    }}>
                                        {hubs.length > 0 ? (
                                            hubs.map((hub, index) => (
                                                <React.Fragment key={hub.id}>
                                                    <MotionListItem
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                                                        sx={{
                                                            p: 2,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(77, 161, 169, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <Box sx={{ width: '100%' }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                                                                    {hub.district}, {hub.state}
                                                                </Typography>
                                                                <Chip
                                                                    label={hub.hubType}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: getHubTypeColor(hub.hubType),
                                                                        color: 'white',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                />
                                                            </Box>

                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                <LocationOn fontSize="small" color="primary" sx={{ mr: 1 }} />
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {hub.latitude.toFixed(4)}, {hub.longitude.toFixed(4)}
                                                                </Typography>
                                                            </Box>

                                                            <Typography variant="body2" color="text.secondary">
                                                                Pincode: {hub.pincode}
                                                            </Typography>
                                                        </Box>
                                                    </MotionListItem>
                                                    {index < hubs.length - 1 && <Divider />}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                                <Typography color="text.secondary">
                                                    No hubs match the current filters.
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={resetFilters}
                                                    sx={{ mt: 2 }}
                                                >
                                                    Clear Filters
                                                </Button>
                                            </Box>
                                        )}
                                    </List>
                                </Box>
                            </Card>
                        </Fade>
                    </Grid>
                </Grid>
            </Box>
        </Container >
    );
}