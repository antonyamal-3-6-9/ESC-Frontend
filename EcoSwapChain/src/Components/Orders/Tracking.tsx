import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Edge, Node } from "../Hub/HubConnectionMap";
import home from './home (1).png'




interface TrackingModalProps {
    open: boolean;
    onClose: () => void;
    edges: Edge[];
}

// Create custom icons
const createIcon = (iconUrl: string, size: [number, number] = [25, 41]) => {
    return L.icon({
        iconUrl,
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1]],
        popupAnchor: [0, -size[1]]
    });
};

export default function TrackingModal({
    open,
    onClose,
    edges,
}: TrackingModalProps) {
    // Define icons - including new home icon for source and destination
    const homeIcon = createIcon(home, [35, 56]);
    const hubIcon = createIcon("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png", [30, 49]);

    // Extract all unique nodes from edges
    const allNodes: Node[] = useMemo(() => {
        const nodeMap: Record<number, Node> = {};
        edges.forEach(edge => {
            nodeMap[edge.fromNode.id] = edge.fromNode;
            nodeMap[edge.to.id] = edge.to;
        });
        return Object.values(nodeMap);
    }, [edges]);

    // Find first and last nodes
    const firstNodeId = edges.length > 0 ? edges[0].fromNode.id : null;
    const lastNodeId = edges.length > 0 ? edges[edges.length - 1].to.id : null;

    const bounds = useMemo(() => {
        return L.latLngBounds(allNodes.map(n => n.position));
    }, [allNodes]);

    if (edges.length === 0) return null;

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="tracking-modal-title">
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxWidth: 1000,
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 1,
                p: 0,
                outline: 'none',
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #eee' }}>
                    <Typography id="tracking-modal-title" variant="h6" component="h2">
                        Shipping Route
                    </Typography>
                    <IconButton onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ height: '70vh', width: '100%' }}>
                    <MapContainer
                        center={edges[0].fromNode.position}
                        zoom={12}
                        style={{ height: "100%", width: "100%" }}
                        bounds={bounds}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* Markers with Home icons for first and last nodes */}
                        {allNodes.map((node) => (
                            <Marker
                                key={node.id}
                                position={node.position}
                                icon={
                                    node.id === firstNodeId || node.id === lastNodeId
                                        ? homeIcon
                                        : hubIcon
                                }
                                
                            >
                                <Popup>
                                    {node.id === firstNodeId
                                        ? "Origin"
                                        : node.id === lastNodeId
                                            ? "Destination"
                                            : "Hub"}
                                </Popup>
                            </Marker>
                        ))}

                        {/* Route lines */}
                        {edges.map((edge, index) => (
                            <Polyline
                                key={edge.id}
                                positions={[edge.fromNode.position, edge.to.position]}
                                color={index === 0 ? "blue" : index === edges.length - 1 ? "red" : "green"}
                                weight={4}
                                opacity={0.7}
                            >
                                <Tooltip
                                    direction="top"
                                    offset={[0, -10]}
                                    permanent
                                    className="polyline-label"
                                >
                                    {Number(edge.cost).toFixed() || ``} 
                                </Tooltip>
                            </Polyline>
                        ))}
                    </MapContainer>
                </Box>
            </Box>
        </Modal>
    );
}