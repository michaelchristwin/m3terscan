import type React from "react";
import { lazy } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
const Map = lazy(() => import("react-map-gl/maplibre"));

const containerStyle = {
  width: "100%",
  height: "400px",
};

interface MapComponentProps {
  onLocationFetched: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number; dateTime: string } | null>
  >;
  lat?: number;
  lng?: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ lat, lng }) => {
  if (!lat && !lng) return <p>Setting map to default location...</p>;

  return (
    <Map
      mapStyle={`https://tiles.openfreemap.org/styles/liberty`}
      style={containerStyle}
      initialViewState={{
        latitude: lat as number,
        longitude: lng as number,
        zoom: 15,
      }}
    />
  );
};

export default MapComponent;
