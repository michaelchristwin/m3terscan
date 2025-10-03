import * as React from "react";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

interface MCenter {
  lat: number;
  lng: number;
}
type MapCenter = MCenter | null;

const containerStyle = {
  width: "100%",
  height: "400px",
};

export const mapCenter = signal<MapCenter>({
  lat: 6.5244,
  lng: 3.3792,
});

interface MapComponentProps {
  onLocationFetched: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number; dateTime: string } | null>
  >;
  center?: { lat: number; lng: number } | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ center }) => {
  useSignals();
  console.log(center);
  if (!mapCenter.value) return <p>Setting map to default location...</p>;

  return (
    <Map
      mapStyle={`https://tiles.openfreemap.org/styles/liberty`}
      style={containerStyle}
      initialViewState={{
        latitude: mapCenter.value?.lat as number,
        longitude: mapCenter.value?.lng as number,
        zoom: 15,
      }}
    />
  );
};

export default MapComponent;
