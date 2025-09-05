"use client";

import { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MapPin, Loader2 } from "lucide-react";

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    info?: string;
  }>;
  height?: string;
  className?: string;
}

interface MapComponentProps extends GoogleMapProps {
  map: google.maps.Map;
  setMap: (map: google.maps.Map) => void;
}

const MapComponent: React.FC<GoogleMapProps> = ({
  center,
  zoom = 15,
  markers = [],
  height = "300px",
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  }, [map, center]);

  useEffect(() => {
    if (map && markers.length > 0) {
      // Clear existing markers
      markers.forEach((markerData) => {
        const marker = new window.google.maps.Marker({
          position: markerData.position,
          map,
          title: markerData.title,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#F59E0B",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
          },
        });

        if (markerData.info) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-semibold text-sm">${
                  markerData.title || "Location"
                }</h3>
                <p class="text-xs text-gray-600 mt-1">${markerData.info}</p>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        }
      });
    }
  }, [map, markers]);

  return (
    <div
      ref={ref}
      style={{ height }}
      className={`w-full rounded-lg border border-gray-200 ${className}`}
    />
  );
};

const LoadingComponent = () => (
  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border border-gray-200">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-500">Loading map...</p>
    </div>
  </div>
);

const ErrorComponent = ({ status }: { status: Status }) => (
  <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
    <div className="text-center">
      <MapPin className="h-8 w-8 text-red-400 mx-auto mb-2" />
      <p className="text-sm text-red-600">Failed to load map: {status}</p>
    </div>
  </div>
);

export const GoogleMap: React.FC<GoogleMapProps> = (props) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-64 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-sm text-yellow-600">
            Google Maps API key not configured
          </p>
        </div>
      </div>
    );
  }

  const render = (status: Status) => {
    if (status === Status.LOADING) return <LoadingComponent />;
    if (status === Status.FAILURE) return <ErrorComponent status={status} />;
    return <MapComponent {...props} />;
  };

  return (
    <Wrapper apiKey={apiKey} render={render} libraries={["places"]}>
      <MapComponent {...props} />
    </Wrapper>
  );
};
