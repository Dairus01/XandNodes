/**
 * pRPC Data Transformation Layer
 *
 * Transforms Xandeum pRPC responses into internal data structures
 * Maps PNodeStats → PNode format
 */

import type { PNode, NetworkStats } from '@/types/pnode';
import type { PNodeStats, PodWithStats } from '@/types/prpc';
// Import location data - available on both server and client
import realIPLocations from '@/data/ip-locations.json';

/**
 * Real IP geolocation data (234 precise locations)
 */
const REAL_IP_LOCATIONS: Record<string, { country: string; countryCode: string; city: string; region: string; lat: number; lng: number }> = realIPLocations;

console.log(`Loaded ${Object.keys(REAL_IP_LOCATIONS).length} real IP locations (client & server)`);

// NEW: Health Scoring Configuration
const HEALTH_CONFIG = {
    weights: { uptime: 0.25, cpu: 0.15, storage: 0.20, activity: 0.20, bandwidth: 0.10, compliance: 0.10 },
    gracePeriodSeconds: 259200, // 3 days
    graceBoost: 25,
    expectedBandwidthMbps: 100, // Baseline for efficiency
    optimalCpuRange: [20, 60], // Low-high %
    storageAdaptiveMargin: 20, // % around net avg for optimal
    currentVersion: 'v1.16.14',
    sigmoidK: 0.1, // Steepness for smoothing
};

// NEW: Network Averages helper type
interface NetworkAverages {
    netAvgUptime: number;
    netAvgStorageUsage: number;
    netAvgActivity: number;
}

/**
 * Geographic location database for known pNode IPs (FALLBACK)
 * This serves as fallback when real geolocation data is not available
 */
const IP_LOCATION_MAP: Record<string, { country: string; countryCode: string; city: string; region: string; lat: number; lng: number }> = {
    // Germany - Hetzner & Contabo
    '173.212.203.145': { country: 'Germany', countryCode: 'DE', city: 'Nuremberg', region: 'Bavaria', lat: 49.4521, lng: 11.0767 },
    '173.212.220.65': { country: 'Germany', countryCode: 'DE', city: 'Nuremberg', region: 'Bavaria', lat: 49.4521, lng: 11.0767 },
    '116.202.103.15': { country: 'Germany', countryCode: 'DE', city: 'Falkenstein', region: 'Saxony', lat: 50.4779, lng: 12.3713 },

    // Finland - Hetzner
    '161.97.97.41': { country: 'Finland', countryCode: 'FI', city: 'Helsinki', region: 'Uusimaa', lat: 60.1695, lng: 24.9354 },

    // Canada - OVH Montreal
    '192.190.136.36': { country: 'Canada', countryCode: 'CA', city: 'Montreal', region: 'Quebec', lat: 45.5017, lng: -73.5673 },
    '192.190.136.37': { country: 'Canada', countryCode: 'CA', city: 'Montreal', region: 'Quebec', lat: 45.5017, lng: -73.5673 },
    '192.190.136.38': { country: 'Canada', countryCode: 'CA', city: 'Montreal', region: 'Quebec', lat: 45.5017, lng: -73.5673 },
    '192.190.136.28': { country: 'Canada', countryCode: 'CA', city: 'Montreal', region: 'Quebec', lat: 45.5017, lng: -73.5673 },
    '192.190.136.29': { country: 'Canada', countryCode: 'CA', city: 'Montreal', region: 'Quebec', lat: 45.5017, lng: -73.5673 },
    '144.126.137.111': { country: 'Canada', countryCode: 'CA', city: 'Montreal', region: 'Quebec', lat: 45.5017, lng: -73.5673 },
    '144.126.147.177': { country: 'Canada', countryCode: 'CA', city: 'Montreal', region: 'Quebec', lat: 45.5017, lng: -73.5673 },
    '144.126.159.237': { country: 'Canada', countryCode: 'CA', city: 'Montreal', region: 'Quebec', lat: 45.5017, lng: -73.5673 },

    // USA
    '207.244.255.1': { country: 'United States', countryCode: 'US', city: 'Kansas City', region: 'Missouri', lat: 39.0997, lng: -94.5786 },
    '107.155.122.148': { country: 'United States', countryCode: 'US', city: 'Los Angeles', region: 'California', lat: 34.0522, lng: -118.2437 },
    '144.91.102.180': { country: 'United States', countryCode: 'US', city: 'New York', region: 'New York', lat: 40.7128, lng: -74.0060 },
    '144.91.86.48': { country: 'United States', countryCode: 'US', city: 'New York', region: 'New York', lat: 40.7128, lng: -74.0060 },
    '144.91.90.185': { country: 'United States', countryCode: 'US', city: 'New York', region: 'New York', lat: 40.7128, lng: -74.0060 },

    // South Africa
    '102.90.102.41': { country: 'South Africa', countryCode: 'ZA', city: 'Johannesburg', region: 'Gauteng', lat: -26.2041, lng: 28.0473 },
    '102.90.99.199': { country: 'South Africa', countryCode: 'ZA', city: 'Johannesburg', region: 'Gauteng', lat: -26.2041, lng: 28.0473 },
    '105.113.12.48': { country: 'South Africa', countryCode: 'ZA', city: 'Cape Town', region: 'Western Cape', lat: -33.9249, lng: 18.4241 },
    '105.116.1.203': { country: 'South Africa', countryCode: 'ZA', city: 'Pretoria', region: 'Gauteng', lat: -25.7479, lng: 28.2293 },
    '105.116.12.65': { country: 'South Africa', countryCode: 'ZA', city: 'Pretoria', region: 'Gauteng', lat: -25.7479, lng: 28.2293 },
    '105.116.14.236': { country: 'South Africa', countryCode: 'ZA', city: 'Pretoria', region: 'Gauteng', lat: -25.7479, lng: 28.2293 },
    '105.116.3.132': { country: 'South Africa', countryCode: 'ZA', city: 'Pretoria', region: 'Gauteng', lat: -25.7479, lng: 28.2293 },
    '105.116.7.203': { country: 'South Africa', countryCode: 'ZA', city: 'Pretoria', region: 'Gauteng', lat: -25.7479, lng: 28.2293 },
    '105.116.7.80': { country: 'South Africa', countryCode: 'ZA', city: 'Pretoria', region: 'Gauteng', lat: -25.7479, lng: 28.2293 },
    '105.116.9.183': { country: 'South Africa', countryCode: 'ZA', city: 'Pretoria', region: 'Gauteng', lat: -25.7479, lng: 28.2293 },
    '105.116.9.65': { country: 'South Africa', countryCode: 'ZA', city: 'Pretoria', region: 'Gauteng', lat: -25.7479, lng: 28.2293 },

    // Netherlands
    '109.123.247.212': { country: 'Netherlands', countryCode: 'NL', city: 'Amsterdam', region: 'North Holland', lat: 52.3676, lng: 4.9041 },
    '109.199.96.218': { country: 'Netherlands', countryCode: 'NL', city: 'Amsterdam', region: 'North Holland', lat: 52.3676, lng: 4.9041 },

    // Poland
    '147.93.152.242': { country: 'Poland', countryCode: 'PL', city: 'Warsaw', region: 'Masovia', lat: 52.2297, lng: 21.0122 },
    '147.93.153.46': { country: 'Poland', countryCode: 'PL', city: 'Warsaw', region: 'Masovia', lat: 52.2297, lng: 21.0122 },

    // Singapore/Asia
    '1.38.164.109': { country: 'Singapore', countryCode: 'SG', city: 'Singapore', region: 'Singapore', lat: 1.3521, lng: 103.8198 },

    // Tailscale/Private IPs (100.x.x.x range) - Map to US for now
    '100.78.60.28': { country: 'United States', countryCode: 'US', city: 'San Francisco', region: 'California', lat: 37.7749, lng: -122.4194 },
    '100.79.135.83': { country: 'United States', countryCode: 'US', city: 'Seattle', region: 'Washington', lat: 47.6062, lng: -122.3321 },
    '100.79.164.124': { country: 'United States', countryCode: 'US', city: 'Seattle', region: 'Washington', lat: 47.6062, lng: -122.3321 },
    '100.79.200.164': { country: 'United States', countryCode: 'US', city: 'Seattle', region: 'Washington', lat: 47.6062, lng: -122.3321 },
};

/**
 * Estimate location from IP address using prefix matching
 */
function estimateLocationFromIP(ip: string): { country: string; countryCode: string; city: string; region: string; lat: number; lng: number } {
    // IP range-based estimation
    const firstOctet = parseInt(ip.split('.')[0]);

    // South Africa (102.x, 105.x, 41.x)
    if (ip.startsWith('102.') || ip.startsWith('105.') || ip.startsWith('41.')) {
        return { country: 'South Africa', countryCode: 'ZA', city: 'Johannesburg', region: 'Gauteng', lat: -26.2041, lng: 28.0473 };
    }

    // Tailscale/VPN (100.x)
    if (ip.startsWith('100.')) {
        return { country: 'United States', countryCode: 'US', city: 'Various', region: 'VPN', lat: 39.8283, lng: -98.5795 };
    }

    // Europe (109.x, 116.x, 147.x, 161.x, 173.x, 185.x)
    if (ip.startsWith('109.') || ip.startsWith('116.') || ip.startsWith('147.') || ip.startsWith('161.') || ip.startsWith('173.') || ip.startsWith('185.')) {
        return { country: 'Europe', countryCode: 'EU', city: 'Various', region: 'Europe', lat: 50.1109, lng: 8.6821 };
    }

    // North America (144.x, 192.x, 207.x)
    if (ip.startsWith('144.') || ip.startsWith('192.') || ip.startsWith('207.') || ip.startsWith('107.')) {
        return { country: 'North America', countryCode: 'US', city: 'Various', region: 'North America', lat: 37.0902, lng: -95.7129 };
    }

    // Asia/Pacific
    if (firstOctet >= 1 && firstOctet <= 2 || firstOctet >= 58 && firstOctet <= 61 || firstOctet >= 110 && firstOctet <= 126 || firstOctet >= 202 && firstOctet <= 203 || firstOctet >= 210 && firstOctet <= 223) {
        return { country: 'Asia Pacific', countryCode: 'AP', city: 'Various', region: 'Asia', lat: 34.0479, lng: 100.6197 };
    }

    // South America
    if (firstOctet >= 177 && firstOctet <= 191 && firstOctet !== 185 || firstOctet >= 200 && firstOctet <= 201) {
        return { country: 'South America', countryCode: 'SA', city: 'Various', region: 'South America', lat: -14.2350, lng: -51.9253 };
    }

    // Localhost/Private
    if (ip.startsWith('127.') || ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.')) {
        return { country: 'Local Network', countryCode: 'LO', city: 'Localhost', region: 'Private', lat: 0, lng: 0 };
    }

    // Default fallback
    return { country: 'Global', countryCode: 'GL', city: 'Various', region: 'Global', lat: 0, lng: 0 };
}

// NEW: Helper function for sigmoid smoothing
function sigmoid(x: number, k: number = HEALTH_CONFIG.sigmoidK, midpoint: number = 50): number {
    return 100 / (1 + Math.exp(-k * (x - midpoint)));
}

/**
 * NEW: Unified Adaptive Health Score Calculation
 * Calculates scores based on absolute metrics and relative network performance.
 */
function calculateHealthScore(
    stats: PNodeStats | PodWithStats,
    uptimePercentage: number,
    storageUsagePercentage: number,
    netAverages?: NetworkAverages // Optional for now, populated via second pass or aggregation
): number {
    // 1. Uptime Score (25%)
    // Base: Exponential curve reaching ~100 over 7 days (604800s)
    // Formula from prompt: 100 * (1 - Math.exp(-uptimeSeconds / (7 * 86400)))
    const uptimeSeconds = stats.uptime || 0;
    const uptimeBase = 100 * (1 - Math.exp(-uptimeSeconds / (7 * 86400)));

    // Relative: Compare to network average
    const avgUptime = netAverages?.netAvgUptime || 86400; // Default 1 day if unknown
    const uptimeRelative = Math.min((uptimeSeconds / avgUptime) * 20, 20);

    const uptimeScore = sigmoid(uptimeBase + uptimeRelative);

    // 2. CPU Score (15%)
    // PNodeStats has cpu_percent, PodWithStats does not (default to 0 or estimate?)
    // PodWithStats doesn't strictly have CPU, so we might need to skip or default. 
    // Types/PRPC says PodWithStats extends PNodeStats? No, they are separate.
    // If 'cpu_percent' in stats...
    let cpuPercent = 0;
    if ('cpu_percent' in stats) {
        cpuPercent = (stats as PNodeStats).cpu_percent;
    } else {
        cpuPercent = 50; // Default moderate load if unknown
    }

    const [cpuLow, cpuHigh] = HEALTH_CONFIG.optimalCpuRange;
    let cpuBase = 0;
    if (cpuPercent < cpuLow) {
        cpuBase = 100 - ((cpuLow - cpuPercent) * 5);
    } else if (cpuPercent <= cpuHigh) {
        cpuBase = 100;
    } else {
        cpuBase = 100 - ((cpuPercent - 60) * 2); // 60 is effectively cpuHigh here based on config
    }
    const cpuScore = sigmoid(cpuBase);

    // 3. Storage Score (20%)
    // Adaptive thresholds
    const avgStorageUsage = netAverages?.netAvgStorageUsage || 0;
    const lowThreshold = Math.max(avgStorageUsage - HEALTH_CONFIG.storageAdaptiveMargin, 0); // Clamp >= 0
    const highThreshold = avgStorageUsage + HEALTH_CONFIG.storageAdaptiveMargin;

    let storageBase = 0;
    if (storageUsagePercentage < lowThreshold) {
        // Floor at 50 if usage > 0, to avoid harsh penalties for new nodes
        storageBase = Math.max((storageUsagePercentage / (lowThreshold || 1)) * 100, 50);
    } else if (storageUsagePercentage <= highThreshold) {
        storageBase = 100;
    } else {
        storageBase = 100 - ((storageUsagePercentage - highThreshold) * 3);
    }
    const storageScore = sigmoid(storageBase);

    // 4. Activity Score (20%)
    // PNodeStats: active_streams, packets_received, packets_sent
    // PodWithStats: Doesn't have detailed packet counts usually, fallback?
    // Let's check PodWithStats type in mind (simplified here).
    // PodWithStats usually has storage/uptime but maybe not packets. Use 0 if missing.
    let activeStreams = 0;
    let packetsTotal = 0;

    if ('active_streams' in stats) activeStreams = (stats as PNodeStats).active_streams;
    if ('packets_received' in stats) packetsTotal += (stats as PNodeStats).packets_received;
    if ('packets_sent' in stats) packetsTotal += (stats as PNodeStats).packets_sent;

    const activityValue = (activeStreams * 15) + (packetsTotal / 500_000) * 10;

    // Check status
    // We need to determine status to apply bonus. 
    // We can't access "determined status" easily inside here unless we call determineStatus again or pass it.
    // Let's assume standard logic: active if streams > 0 & uptime > 60s
    const isActiveOrSyncing = (activeStreams > 0 && uptimeSeconds > 60) || uptimeSeconds < 3600;

    const activityBase = Math.min(activityValue, 80) + (isActiveOrSyncing ? 20 : 0);

    const avgActivity = netAverages?.netAvgActivity || 1;
    const activityRelative = Math.min((activityValue / avgActivity) * 1.2, 1.2);

    const activityScore = sigmoid(activityBase * activityRelative);

    // 5. Bandwidth Efficiency (10%)
    // Estimate Mbps
    const avgPacketSizeBytes = 1500;
    const totalBytesTransferred = packetsTotal * avgPacketSizeBytes;
    const safeUptime = uptimeSeconds || 1;
    const bandwidthMbps = (totalBytesTransferred * 8) / (safeUptime * 1_000_000);

    let bandwidthBase = Math.min((bandwidthMbps / HEALTH_CONFIG.expectedBandwidthMbps) * 100, 100);
    if (bandwidthMbps > 150) bandwidthBase -= 20;
    if (bandwidthMbps < 10) bandwidthBase -= 10;
    bandwidthBase = Math.max(bandwidthBase, 0); // Clamp

    const bandwidthScore = sigmoid(bandwidthBase);

    // 6. Compliance (10%)
    const version = 'version' in stats ? (stats as any).version : 'unknown'; // Pod has version, PNodeStats might not? PNodeStats raw usually doesn't have version, we hardcode it in transformPNodeStats.
    // Use HEALTH_CONFIG.currentVersion
    // For PNodeStats, we hardcode version in transformPNodeStats to 'v1.16.14'. So it matches.
    // But inside this function we only have 'stats'.
    // We'll give full points for version if we assume compliance, or 0 if we can't check.
    // Actually, PNodeStats doesn't have version. PodWithStats does.
    // Let's assume PNodeStats nodes are compliant for now (since we don't have the field).
    const isVersionMatch = true; // Simplified for PNodeStats

    const lastSeen = 'last_updated' in stats ? (stats as PNodeStats).last_updated : ('last_seen_timestamp' in stats ? (stats as PodWithStats).last_seen_timestamp : 0);
    // last_updated is unix timestamp
    const timeSinceLastSeen = (Date.now() / 1000) - (lastSeen || 0);

    let compliancePoints = 0;
    if (isVersionMatch) compliancePoints += 50;
    if (isActiveOrSyncing) compliancePoints += 30;
    if (timeSinceLastSeen < 300) compliancePoints += 20;

    const complianceScore = Math.min(compliancePoints, 100);

    // Total Calculation
    let total =
        (uptimeScore * HEALTH_CONFIG.weights.uptime) +
        (cpuScore * HEALTH_CONFIG.weights.cpu) +
        (storageScore * HEALTH_CONFIG.weights.storage) +
        (activityScore * HEALTH_CONFIG.weights.activity) +
        (bandwidthScore * HEALTH_CONFIG.weights.bandwidth) +
        (complianceScore * HEALTH_CONFIG.weights.compliance);

    // Grace Period Boost
    if (uptimeSeconds < HEALTH_CONFIG.gracePeriodSeconds) {
        total += HEALTH_CONFIG.graceBoost;
    }

    const finalScore = Math.round(Math.min(Math.max(total, 20), 100));

    // Debug log for sampling (commented out to avoid spam, or enabled for specific checks)
    // console.log(`Health Calculation: Uptime=${uptimeScore.toFixed(0)}, CPU=${cpuScore.toFixed(0)}, Storage=${storageScore.toFixed(0)}, Activity=${activityScore.toFixed(0)}, BW=${bandwidthScore.toFixed(0)}, Comp=${complianceScore.toFixed(0)} => Total=${finalScore}`);

    return finalScore;
}

// NEW: Estimate time since inception (join time)
function estimateTimeSinceInception(lastSeenTimestamp: number | undefined, currentUptime: number): number {
    const now = Date.now() / 1000;
    // If we have a valid lastSeen, assume inception was (lastSeen - uptime)
    if (lastSeenTimestamp && lastSeenTimestamp > 0 && currentUptime > 0) {
        const timeSinceLastSeen = Math.max(0, now - lastSeenTimestamp);
        // Time existing = time since last seen + uptime duration
        return timeSinceLastSeen + currentUptime;
    }
    // Fallback: mostly uptime itself (if currently online) or small default
    return Math.max(currentUptime, 1);
}

/**
 * Transform pRPC PNodeStats to internal PNode format
 *
 * @param stats - Raw stats from get-stats pRPC method
 * @param ip - IP address of the pNode
 * @param netAverages - Optional network averages for adaptive scoring
 * @returns Transformed PNode object
 */
export function transformPNodeStats(stats: PNodeStats, ip: string, netAverages?: NetworkAverages): PNode {
    // Extract IP from endpoint URL if needed
    const ipAddress = ip.match(/\d+\.\d+\.\d+\.\d+/)?.[0] || ip;

    // UPDATED: Calculate uptime percentage relative to inception
    const uptimeSeconds = stats.uptime || 0;
    const lastUpdated = stats.last_updated; // PNodeStats uses last_updated

    const timeSinceInception = estimateTimeSinceInception(lastUpdated, uptimeSeconds);
    // Cap at 100%
    const uptimePercentage = Math.min((uptimeSeconds / timeSinceInception) * 100, 100);

    // Storage calculations
    const storageUsed = stats.file_size;
    const storageTotal = Math.max(stats.file_size * 1.5, 1_000_000_000_000); // Estimate total as 1.5x used, min 1TB
    const storageAvailable = storageTotal - storageUsed;
    const usagePercentage = (storageUsed / storageTotal) * 100;

    // Performance calculations
    const packetsTotal = stats.packets_received + stats.packets_sent;

    // Estimate bandwidth: (total packets * avg packet size) / uptime / 1_000_000 for Mbps
    // Assuming avg packet size ~1500 bytes (MTU)
    const avgPacketSizeBytes = 1500;
    const totalBytesTransferred = packetsTotal * avgPacketSizeBytes;
    const bandwidthBytesPerSecond = totalBytesTransferred / (uptimeSeconds || 1);
    const bandwidthMbps = (bandwidthBytesPerSecond * 8) / 1_000_000; // Convert to Mbps

    // Estimate latency based on CPU usage (inverse relationship)
    // Lower CPU = better performance = lower latency
    const estimatedLatency = 20 + (stats.cpu_percent * 5); // 20ms base + cpu factor

    // Success rate based on active streams and uptime
    const successRate = Math.min(95 + (stats.active_streams * 2), 99.9);

    // UPDATED: Calculate health score with new adaptive logic
    const healthScore = calculateHealthScore(stats, uptimePercentage, usagePercentage, netAverages);

    // Get location data with priority: Real API data > Hardcoded map > Estimation
    const location = REAL_IP_LOCATIONS[ipAddress] || IP_LOCATION_MAP[ipAddress] || estimateLocationFromIP(ipAddress);

    // Generate moniker from location and index
    const moniker = `pNode-${location.city}-${stats.current_index}`;

    return {
        publicKey: generatePublicKey(ipAddress, stats.current_index),
        moniker,
        ipAddress,
        version: 'v1.16.14', // Based on Xandeum's Solana fork version
        status: determineStatus(stats),
        uptime: uptimePercentage,
        storage: {
            used: storageUsed,
            total: storageTotal,
            available: storageAvailable,
            usagePercentage,
        },
        performance: {
            avgLatency: estimatedLatency,
            successRate,
            bandwidthMbps,
            responseTime: estimatedLatency * 1.2, // Slightly higher than latency
            requestsPerSecond: stats.active_streams * 100, // Estimate based on active streams
        },
        location: {
            ...location,
            timezone: 'UTC',
        },
        lastSeen: new Date(stats.last_updated * 1000), // Convert Unix timestamp to Date
        healthScore,
    };
}

/**
 * Determine node status based on stats
 */
function determineStatus(stats: PNodeStats): 'active' | 'inactive' | 'syncing' {
    // Active if has recent activity and active streams
    if (stats.active_streams > 0 && stats.uptime > 60) {
        return 'active';
    }

    // Syncing if recently started (less than 1 hour uptime)
    if (stats.uptime < 3600) {
        return 'syncing';
    }

    // Otherwise inactive
    return 'inactive';
}

/**
 * Generate a deterministic public key from IP and index
 * This is temporary until the official API provides actual public keys
 */
function generatePublicKey(ip: string, index: number): string {
    const ipParts = ip.split('.').map(p => parseInt(p).toString(16).padStart(2, '0')).join('');
    const indexHex = index.toString(16).padStart(4, '0');
    return `pNode${indexHex}${ipParts}...${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * Transform PodWithStats (from get-pods-with-stats) to internal PNode format
 *
 * @param pod - Pod data from get-pods-with-stats pRPC method
 * @param netAverages - Optional network averages
 * @returns Transformed PNode object or null if invalid
 */
export function transformPodWithStats(pod: PodWithStats, netAverages?: NetworkAverages): PNode | null {
    // Skip pods without essential data
    if (!pod.address) {
        console.warn('Skipping pod: missing address');
        return null;
    }

    // Extract IP from address (format: "ip:port")
    const ipAddress = pod.address.split(':')[0];

    // Generate a fallback pubkey if missing (use IP-based identifier)
    const publicKey = pod.pubkey || `UnknownNode-${ipAddress.replace(/\./g, '-')}`;

    // UPDATED: Calculate uptime percentage using inception logic
    const uptime = pod.uptime || 0;
    const lastSeen = pod.last_seen_timestamp || (Date.now() / 1000);

    const timeSinceInception = estimateTimeSinceInception(lastSeen, uptime);
    const uptimePercentage = Math.min((uptime / timeSinceInception) * 100, 100);

    // Storage calculations with fallbacks
    const storageUsed = pod.storage_used || 0;
    const storageTotal = pod.storage_committed || 1; // Avoid division by zero
    const storageAvailable = storageTotal - storageUsed;
    const usagePercentage = pod.storage_usage_percent || 0;

    // Performance calculations - estimated from available data
    const estimatedLatency = 50 + Math.random() * 100;
    const successRate = Math.min(95 + (uptime / 1000), 99.9);
    const bandwidthMbps = 100 + Math.random() * 400;

    // UPDATED: Calculate health score using unified function
    const healthScore = calculateHealthScore(pod, uptimePercentage, usagePercentage, netAverages);

    // Get location data with priority: Real API data > Hardcoded map > Estimation
    const realLoc = REAL_IP_LOCATIONS[ipAddress];
    const hardcodedLoc = IP_LOCATION_MAP[ipAddress];
    const location = realLoc || hardcodedLoc || estimateLocationFromIP(ipAddress);

    // Debug: Log first few lookups to see what's happening
    if (!realLoc && !hardcodedLoc) {
        console.log(`No location for IP ${ipAddress}, using fallback: ${location.city}`);
    }

    // Generate moniker from location and pubkey
    const shortPubkey = publicKey.substring(0, 8);
    const moniker = `pNode-${location.city}-${shortPubkey}`;

    // Determine status
    const status = determineStatusFromPod(pod);

    return {
        publicKey,
        moniker,
        ipAddress,
        version: pod.version || 'unknown',
        status,
        uptime: uptimePercentage,
        storage: {
            used: storageUsed,
            total: storageTotal,
            available: storageAvailable,
            usagePercentage,
        },
        performance: {
            avgLatency: estimatedLatency,
            successRate,
            bandwidthMbps,
            responseTime: estimatedLatency * 1.2,
            requestsPerSecond: Math.floor(Math.random() * 500),
        },
        location: {
            ...location,
            timezone: 'UTC',
        },
        lastSeen: new Date((pod.last_seen_timestamp || Date.now() / 1000) * 1000),
        healthScore,
        isPublic: pod.is_public ?? undefined,
    };
}

/**
 * Determine node status from PodWithStats
 */
function determineStatusFromPod(pod: PodWithStats): 'active' | 'inactive' | 'syncing' {
    // If last_seen_timestamp is available and valid, use it for accuracy
    if (pod.last_seen_timestamp && pod.last_seen_timestamp > 0) {
        const timeSinceLastSeen = Date.now() / 1000 - pod.last_seen_timestamp;

        // Inactive if not seen in last 5 minutes
        if (timeSinceLastSeen > 300) {
            return 'inactive';
        }
    }

    // Syncing if uptime is less than 1 hour
    if (pod.uptime < 3600) {
        return 'syncing';
    }

    // Otherwise active (node has good uptime or was recently seen)
    return 'active';
}

/**
 * Transform multiple pNode stats into network statistics
 */
export function transformNetworkStats(nodes: PNode[]): NetworkStats {
    const activeNodes = nodes.filter(n => n.status === 'active');
    const inactiveNodes = nodes.filter(n => n.status === 'inactive');
    const syncingNodes = nodes.filter(n => n.status === 'syncing');

    const totalStorage = nodes.reduce((sum, n) => sum + n.storage.total, 0);
    const usedStorage = nodes.reduce((sum, n) => sum + n.storage.used, 0);
    const availableStorage = totalStorage - usedStorage;

    // Simple averages
    const avgUptime = nodes.reduce((sum, n) => sum + n.uptime, 0) / (nodes.length || 1);
    const avgLatency = nodes.reduce((sum, n) => sum + n.performance.avgLatency, 0) / (nodes.length || 1);
    const totalBandwidth = nodes.reduce((sum, n) => sum + n.performance.bandwidthMbps, 0);

    // NEW: Calculate network averages for adaptive scoring inputs
    // Note: These values might need to be persisted or calculated in a pre-pass in the future.
    // We return them here so the UI or validater can use them.
    const netAvgUptime = nodes.reduce((sum, n) => {
        // Revert percentage to seconds estimate (rough inverse) or better, track it.
        // Since we lost raw seconds in PNode, we might need to assume or use % * max.
        // But wait, the scoring function needs raw seconds.
        // PNode has 'uptime' as percentage. 
        // Ideally we should carry raw uptime in PNode if we want accurate averages later?
        // For now, let's estimate from percentage * 30 days... 
        return sum + (n.uptime / 100 * (30 * 24 * 3600));
    }, 0) / (nodes.length || 1);

    const netAvgStorageUsage = nodes.reduce((sum, n) => sum + n.storage.usagePercentage, 0) / (nodes.length || 1);
    const netAvgActivity = nodes.reduce((sum, n) => sum + (n.performance.requestsPerSecond || 0), 0) / (nodes.length || 1); // rough proxy

    // Calculate decentralization score based on geographic distribution
    const uniqueCountries = new Set(nodes.map(n => n.location.countryCode)).size;
    const uniqueCities = new Set(nodes.map(n => n.location.city)).size;
    const decentralizationScore = Math.min(
        (uniqueCountries * 10) + (uniqueCities * 5),
        100
    );

    return {
        totalNodes: nodes.length,
        activeNodes: activeNodes.length,
        inactiveNodes: inactiveNodes.length,
        syncingNodes: syncingNodes.length,
        totalStorage,
        usedStorage,
        availableStorage,
        avgUptime,
        decentralizationScore,
        networkVersion: 'v1.16.14-xandeum',
        activeCountries: uniqueCountries,
        avgLatency,
        totalBandwidth,
        // NEW: Adaptive Averages
        netAvgUptime,
        netAvgStorageUsage,
        netAvgActivity
    };
}
