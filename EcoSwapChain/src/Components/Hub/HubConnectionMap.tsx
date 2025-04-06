import { useEffect, useState, forwardRef, useRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { API } from "../API/api";
import { Button } from "@mui/material";
import { LeafletMouseEvent } from "leaflet";
import React from "react";

export interface GraphRef{
    clearAddPath: () => void;
    clearDeletePath: () => void;
    handleRouteOptimization: () => void;
}

interface Node {
    id: number;
    position: [number, number];
    title: string;
}

interface Edge {
    id: number;
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
    setAddMode: (value: boolean) => void;
    setDeleteMode: (value: boolean) => void;
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
const GraphMap = forwardRef<GraphRef, GraphMapProps>(({
    nodes,
    center = [9.955388, 76.244921],
    zoom = 10,
    addMode = true,
    deleteMode = false,
    setAddMode,
    setDeleteMode,
}, ref) => {
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [newPath, setNewPath] = useState<Edge[]>([]);

    const [mst, setMst] = useState<Edge[]>([]);

    const polylineRefs = useRef<Record<number, L.Polyline | null>>({});

    // Initialize or update refs when edges change
    useEffect(() => {
        polylineRefs.current = {};
    }, [edges]);

    const [removePath, setRemovePath] = useState<number[]>([]);

    const fetchRoutes = async () => {
        try {
            const { data } = await API.get("admin/route/list/");
            console.log(data)
            const tempEdges: Edge[] = []
            for (const route of data) {
                const edge: Edge = {
                    id: route.id,
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
                id: 1,
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

    const handleAddRoute = async () => {
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
            setAddMode(false)
        } catch (error) {
            console.error("Error adding hub:", error);
        }
    }
    const handleEdgeRemoveClick = (e: LeafletMouseEvent, id: number) => {
        const polyLine = e.target; // This is the Leaflet Polyline instance
        polyLine.setStyle({ color: "red" }); // Change style
        setRemovePath((prev) => [...prev, id]); // Update state
    };


    const handleDeleteRoute = async () => {
        // Early return if no paths to remove
        if (removePath.length === 0) {
            console.warn("No paths to remove");
            return { success: false, error: "No paths to remove" };
        }

        try {
            // Make API request with proper typing
            await API.post(`admin/route/delete/`, {
                routeIds :removePath
            }); 
            setEdges(prevEdges => prevEdges.filter(edge => !removePath.includes(edge.id)));
            setRemovePath([]);
            setDeleteMode(false)
        } catch (error) {
            console.error("Error deleting route:", error);
        }
    }

    useImperativeHandle(ref, () => ({
        clearAddPath: () => {
            setNewPath([]);
        },

        clearDeletePath: () => {
            removePath.map((id) => {
                polylineRefs.current[id]?.setStyle({ color: "blue" });
            })
        },
        handleRouteOptimization: async () => {
                try {
                    const { data } = await API.get("admin/route/optimize/");
                    console.log(data.data.path)
                    const edges: Edge[] = []
                    data.data.path.map((path) => {
                        edges.push({
                            id: path.route.id,
                            fromNode: {
                                id: path.route.fromNode.id,
                                position: path.route.fromNode.position,
                                title: path.route.fromNode.title,
                            },
                            to: {
                                id: path.route.to.id,
                                position: path.route.to.position,
                                title: path.route.to.title,
                            },
                            distance: path.route.distance,
                            time: path.route.time,
                            cost: path.route.cost,
                        })
                    })
                    setMst(edges)
                } catch (error) {
                    console.error("Error optimizing routes:", error);
                }
            }

    }));


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
                    ref={(el) => (polylineRefs.current[edge.id] = el)}
                    positions={[edge.fromNode.position, edge.to.position]}
                    color="blue"
                    weight={3}
                    eventHandlers={{
                        click: (e) => handleEdgeRemoveClick(e, edge.id),
                    }}
                />
            ))} 

            {mst.map((edge, index) => (
                <Polyline
                    key={`edge-${index}`}
                    ref={(el) => (polylineRefs.current[edge.id] = el)}
                    positions={[edge.fromNode.position, edge.to.position]}
                    color="yellow"
                    weight={3}
                    eventHandlers={{
                        click: (e) => handleEdgeRemoveClick(e, edge.id),
                    }}
                />
            ))} 

            {addMode && newPath.map((path, index) => (
                <Polyline
                    key={`new-path-${index}`}
                    positions={[path.fromNode.position, path.to.position]}
                    color="green"
                    weight={3}
                />
            ))}

            {(addMode || deleteMode) &&

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
                        onClick={deleteMode ? handleDeleteRoute : handleAddRoute}
                    >
                        Submit
                    </Button>
                </div>}
        </MapContainer>
    );
});

export default GraphMap;