import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { API } from "../API/api";
import { Button } from "@mui/material";


interface Node {
    id: number;
    position: [number, number];
    title: string;
}

interface Edge {
    fromNode: Node;
    to: Node;
    distance: number;
    cost: number;
    time: string;
}

interface GraphMapProps {
    nodes: Node[];
    center?: [number, number];
    zoom?: number;
    addMode?: boolean;
    deleteMode?: boolean;
}

const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const haversineDistance = (coord1: [number, number], coord2: [number, number]) => {
    const R = 6371; // Earth's radius in km
    const toRad = (angle: number) => (angle * Math.PI) / 180;
    const dLat = toRad(coord2[0] - coord1[0]);
    const dLon = toRad(coord2[1] - coord1[1]);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(coord1[0])) * Math.cos(toRad(coord2[0])) * Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Distance in km
};
const GraphMap: React.FC<GraphMapProps> = ({
    nodes,
    center = [9.962319, 436.242715],
    zoom = 13,
    addMode = true,
    deleteMode = false
}) => {
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [newPath, setNewPath] = useState<Edge[]>([]);

    const fetchRoutes = async () => {
        try {
            const { data } = await API.get("admin/route/list/");
            console.log(data)
            const tempEdges: Edge[] = []
            for (const route of data) {
                const edge: Edge = {
                    fromNode: {
                        position: route.fromNode.position,
                        title: route.fromNode.title,
                        id: route.fromNode.id
                    },
                    to: {
                        position: route.to.position,
                        title: route.to.title,
                        id: route.to.id,
                    },
                    distance: route.distance,
                    cost: route.cost,
                    time: route.time
                };
                tempEdges.push(edge)
            setEdges(tempEdges)
            }
            
        } catch (error) {
            console.error("Error fetching routes:", error);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const handleNodeClick = (node: Node) => {
        if (!addMode) return;

        if (!selectedNode) {
            setSelectedNode(node);
        } else if (selectedNode.id !== node.id) {
            const distance = haversineDistance(selectedNode.position, node.position);
            const newEdge: Edge = {
                fromNode: selectedNode,
                to: node,
                distance,
                cost: 0,
                time: ""
            };
            setNewPath(prev => [...prev, newEdge]);
            console.log(newEdge.fromNode.position);
            setSelectedNode(null);
        } else {
            setSelectedNode(null);
        }
    };

    const handleAddHub = async () => {
        // Early return if no paths to add
        if (newPath.length === 0) {
            console.warn("No new paths to add");
            return { success: false, error: "No paths to add" };
        }

        try {
            // Make API request with proper typing
            await API.post("admin/route/add/", {
                newPath
            });
            setEdges(prevEdges => [
                ...prevEdges,
                ...(newPath)
            ]);
            setNewPath([]);
        } catch (error) {
            console.error("Error adding hub:", error);
        }
    }

    return (
        <MapContainer center={center} zoom={zoom} style={{ height: "600px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {nodes.map((node) => (
                <Marker
                    key={node.id}
                    position={node.position}
                    icon={customIcon}
                    eventHandlers={{ click: () => handleNodeClick(node) }}
                >
                    <Popup>{node.title}</Popup>
                </Marker>
            ))}

           {edges.map((edge, index) => (
                <Polyline
                    key={`edge-${index}`}
                    positions={[edge.fromNode.position, edge.to.position]}
                    color="blue"
                    weight={3}
                />
            ))} 

            {newPath.map((path, index) => (
                <Polyline
                    key={`new-path-${index}`}
                    positions={[path.fromNode.position, path.to.position]}
                    color="red"
                    weight={3}
                />
            ))}

            <div style={{
                position: "absolute",
                top: 10,
                left: 10,
                zIndex: 1000,
                background: "white",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
                fontWeight: "bold"
            }}>

                <Button
                    onClick={handleAddHub}
                >
                    Submit
                </Button>
            </div>
        </MapContainer>
    );
};

export default GraphMap;