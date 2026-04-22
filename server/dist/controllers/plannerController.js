import { env } from "../lib/env";
function stripHtml(input) {
    return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}
function getPeakWindow(date) {
    const hour = date.getHours();
    if ((hour >= 7 && hour < 10) || (hour >= 17 && hour < 20))
        return "Peak: 7:00-10:00 AM / 5:00-8:00 PM";
    if (hour >= 10 && hour < 16)
        return "Midday: 10:00 AM-4:00 PM";
    return "Off-peak hours";
}
function getCrowdLevel(trafficIndex, date) {
    const hour = date.getHours();
    const rushHourBoost = (hour >= 7 && hour < 10) || (hour >= 17 && hour < 20) ? 0.2 : 0;
    const score = trafficIndex + rushHourBoost;
    if (score >= 1.6)
        return "Very High";
    if (score >= 1.35)
        return "High";
    if (score >= 1.15)
        return "Moderate";
    return "Low";
}
function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
}
function round2(n) {
    return Math.round(n * 100) / 100;
}
function estimateFareForLeg(mode, distanceKm) {
    const m = mode.toLowerCase();
    const km = Math.max(0, distanceKm);
    // NOTE: Google Directions does not provide PH fare data.
    // These are heuristics tuned for Metro Manila commuter ranges.
    if (m.includes("walk"))
        return { mode: "Walk", distanceKm: km, estimatedFare: 0 };
    if (m.includes("mrt") || m.includes("lrt") || m.includes("train") || m.includes("subway") || m.includes("rail")) {
        // MRT/LRT typically ~₱13–₱45 depending on distance.
        const fare = clamp(13 + km * 2.4, 13, 45);
        return { mode, distanceKm: km, estimatedFare: round2(fare), note: "Estimated MRT/LRT fare range" };
    }
    if (m.includes("bus")) {
        // City bus fares vary; keep conservative metro estimate.
        const fare = clamp(15 + km * 1.6, 15, 80);
        return { mode: "Bus", distanceKm: km, estimatedFare: round2(fare), note: "Estimated city bus fare" };
    }
    if (m.includes("jeep")) {
        // Jeepney: base ~₱13 then increments.
        const fare = clamp(13 + Math.max(0, km - 4) * 1.7, 13, 60);
        return { mode: "Jeepney", distanceKm: km, estimatedFare: round2(fare), note: "Estimated jeepney fare" };
    }
    if (m.includes("uv")) {
        const fare = clamp(25 + km * 2.2, 25, 120);
        return { mode: "UV Express", distanceKm: km, estimatedFare: round2(fare), note: "Estimated UV fare" };
    }
    if (m.includes("tricycle") || m.includes("tric")) {
        const fare = clamp(20 + km * 6, 20, 120);
        return { mode: "Tricycle", distanceKm: km, estimatedFare: round2(fare), note: "Estimated tricycle fare" };
    }
    if (m.includes("grab") || m.includes("taxi")) {
        const fare = clamp(45 + km * 18, 45, 500);
        return { mode, distanceKm: km, estimatedFare: round2(fare), note: "Estimated taxi/ride-hail fare" };
    }
    // fallback
    const fare = clamp(15 + km * 2, 10, 200);
    return { mode, distanceKm: km, estimatedFare: round2(fare), note: "Estimated fare" };
}
function estimateFare(mappedLegs) {
    const breakdown = mappedLegs.map((l) => estimateFareForLeg(l.mode, l.distanceKm));
    const total = breakdown.reduce((sum, b) => sum + Number(b.estimatedFare || 0), 0);
    return { total: round2(total), breakdown };
}
export async function getRouteOptions(req, res) {
    try {
        if (!env.GOOGLE_MAPS_API_KEY) {
            return res.status(503).json({ message: "Google Maps API key is not configured on server." });
        }
        const { origin, destination, originPlaceId, destinationPlaceId, departureTime } = req.body;
        const resolvedOrigin = originPlaceId ? `place_id:${originPlaceId}` : origin;
        const resolvedDestination = destinationPlaceId ? `place_id:${destinationPlaceId}` : destination;
        const departDate = departureTime ? new Date(departureTime) : new Date();
        const departureUnix = Math.floor(departDate.getTime() / 1000);
        const transitUrl = new URL("https://maps.googleapis.com/maps/api/directions/json");
        transitUrl.searchParams.set("origin", resolvedOrigin);
        transitUrl.searchParams.set("destination", resolvedDestination);
        transitUrl.searchParams.set("mode", "transit");
        transitUrl.searchParams.set("alternatives", "true");
        transitUrl.searchParams.set("departure_time", String(departureUnix));
        transitUrl.searchParams.set("key", env.GOOGLE_MAPS_API_KEY);
        const drivingUrl = new URL("https://maps.googleapis.com/maps/api/directions/json");
        drivingUrl.searchParams.set("origin", resolvedOrigin);
        drivingUrl.searchParams.set("destination", resolvedDestination);
        drivingUrl.searchParams.set("mode", "driving");
        drivingUrl.searchParams.set("departure_time", "now");
        drivingUrl.searchParams.set("traffic_model", "best_guess");
        drivingUrl.searchParams.set("key", env.GOOGLE_MAPS_API_KEY);
        const [transitResp, drivingResp] = await Promise.all([fetch(transitUrl), fetch(drivingUrl)]);
        const transitData = await transitResp.json();
        const drivingData = await drivingResp.json();
        if (!Array.isArray(transitData.routes) || transitData.routes.length === 0) {
            return res.status(404).json({ message: "No transit routes found for this trip." });
        }
        const driveLeg = drivingData?.routes?.[0]?.legs?.[0];
        const baseSecs = Number(driveLeg?.duration?.value || 1);
        const trafficSecs = Number(driveLeg?.duration_in_traffic?.value || baseSecs);
        const trafficIndex = trafficSecs / Math.max(baseSecs, 1);
        const options = transitData.routes.map((route, idx) => {
            const leg = route.legs?.[0];
            const steps = Array.isArray(leg?.steps) ? leg.steps : [];
            const totalSecs = Number(leg?.duration?.value || 0);
            const distanceKm = Number(leg?.distance?.value || 0) / 1000;
            const avgSpeedKph = totalSecs > 0 ? Number(((distanceKm / (totalSecs / 3600)) || 0).toFixed(1)) : 0;
            const mappedLegs = steps.map((step) => {
                const mode = String(step.travel_mode || "TRANSIT").toLowerCase();
                const stepKm = Number(step?.distance?.value || 0) / 1000;
                if (mode === "walking") {
                    return { mode: "Walk", distanceKm: stepKm, label: `${step.duration?.text || ""} • ${stripHtml(step.html_instructions || "Walk segment")}` };
                }
                if (mode === "transit") {
                    const transit = step.transit_details;
                    const vehicle = transit?.line?.vehicle?.name || "Transit";
                    const line = transit?.line?.short_name || transit?.line?.name || "";
                    const from = transit?.departure_stop?.name || "departure";
                    const to = transit?.arrival_stop?.name || "arrival";
                    return {
                        mode: vehicle,
                        distanceKm: stepKm,
                        label: `${line ? `${line} • ` : ""}${from} -> ${to} (${step.duration?.text || ""})`,
                    };
                }
                return { mode: "Transfer", distanceKm: stepKm, label: stripHtml(step.html_instructions || step.duration?.text || "Transfer") };
            });
            const estimatedFare = estimateFare(mappedLegs.map((l) => ({ mode: l.mode, distanceKm: l.distanceKm })));
            const actualTransitFare = Number(route?.fare?.value || 0);
            const routeSignature = mappedLegs
                .map((leg) => `${String(leg.mode).toLowerCase()}|${String(leg.label).toLowerCase()}`)
                .join("||");
            return {
                id: `route-${idx}`,
                cost: actualTransitFare > 0 ? actualTransitFare : estimatedFare.total,
                fareBreakdown: estimatedFare.breakdown,
                minutes: Math.round(totalSecs / 60),
                crowdLevel: getCrowdLevel(trafficIndex, departDate),
                peakWindow: getPeakWindow(departDate),
                avgSpeedKph,
                legs: mappedLegs.map((l) => ({ mode: l.mode, label: l.label })),
                signature: routeSignature,
            };
        });
        const uniqueOptions = options.filter((option, index, all) => all.findIndex((candidate) => candidate.signature === option.signature) === index);
        if (uniqueOptions.length === 0) {
            return res.status(404).json({ message: "No transit routes found for this trip." });
        }
        const minMinutes = Math.min(...uniqueOptions.map((o) => o.minutes));
        const minCost = Math.min(...uniqueOptions.map((o) => o.cost));
        const scoredOptions = uniqueOptions.map((o) => ({
            ...o,
            balanceScore: (o.minutes / minMinutes) + (o.cost / minCost)
        }));
        const fastest = scoredOptions.find((o) => o.minutes === minMinutes);
        const tipidToken = scoredOptions.filter((o) => o.signature !== fastest?.signature).sort((a, b) => a.cost - b.cost)[0];
        const balanceToken = scoredOptions
            .filter((o) => o.signature !== fastest?.signature && o.signature !== tipidToken?.signature)
            .sort((a, b) => a.balanceScore - b.balanceScore)[0];
        const labelledCandidates = [
            fastest ? { ...fastest, name: "Fastest Hero", tag: "fastest", label: "Pinakamabilis" } : null,
            tipidToken ? { ...tipidToken, name: "Tipid Hero", tag: "tipid", label: "Pinakatipid" } : null,
            balanceToken ? { ...balanceToken, name: "Balanced Hero", tag: "balance", label: "Sakto Lang" } : null,
        ].filter(Boolean);
        const finalOptions = labelledCandidates.length > 0
            ? labelledCandidates
            : [{ ...scoredOptions[0], name: "Best Available Hero", tag: "balance", label: "Best Available" }];
        return res.json({ options: finalOptions });
    }
    catch (error) {
        console.error("Planner error:", error);
        return res.status(500).json({ message: "Failed to fetch route options." });
    }
}
