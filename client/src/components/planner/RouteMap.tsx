import ByaHeroMap, { PlannerRouteOption } from "../ByaHeroMap";

export function RouteMap({
  origin,
  destination,
  originPlaceId,
  destinationPlaceId,
  onOriginChange,
  onDestinationChange,
  onOriginPlaceIdChange,
  onDestinationPlaceIdChange,
  onPlan,
  options,
  planning,
}: {
  origin: string;
  destination: string;
  originPlaceId: string | null;
  destinationPlaceId: string | null;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onOriginPlaceIdChange: (value: string | null) => void;
  onDestinationPlaceIdChange: (value: string | null) => void;
  onPlan: () => void;
  options: PlannerRouteOption[];
  planning: boolean;
}) {
  return (
    <ByaHeroMap
      origin={origin}
      destination={destination}
      originPlaceId={originPlaceId}
      destinationPlaceId={destinationPlaceId}
      onOriginChange={onOriginChange}
      onDestinationChange={onDestinationChange}
      onOriginPlaceIdChange={onOriginPlaceIdChange}
      onDestinationPlaceIdChange={onDestinationPlaceIdChange}
      onPlan={onPlan}
      options={options}
      planning={planning}
    />
  );
}
