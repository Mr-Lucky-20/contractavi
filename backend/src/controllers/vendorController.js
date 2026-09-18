import { Owner } from '../models/Owner.js';
import { Inventory } from '../models/Inventory.js';
import { calculateHaversineDistance } from '../utils/haversine.js';

export const CITY_COORDINATES = {
  bilaspur: { lat: 22.0797, lng: 82.1409, name: 'Bilaspur, CG' },
  raipur: { lat: 21.2514, lng: 81.6296, name: 'Raipur, CG' },
  bhilai: { lat: 21.2167, lng: 81.4333, name: 'Bhilai / Durg, CG' },
  korba: { lat: 22.3595, lng: 82.7501, name: 'Korba, CG' },
  raigarh: { lat: 21.8974, lng: 83.3950, name: 'Raigarh, CG' },
  rajnandgaon: { lat: 21.0970, lng: 81.0375, name: 'Rajnandgaon, CG' },
  mumbai: { lat: 19.0760, lng: 72.8777, name: 'Mumbai, MH' },
  pune: { lat: 18.5204, lng: 73.8567, name: 'Pune, MH' },
  delhi: { lat: 28.6139, lng: 77.2090, name: 'Delhi NCR' },
  bengaluru: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru, KA' },
};

function computeTimestampVerification(lastUpdatedDate) {
  if (!lastUpdatedDate) {
    return {
      badgeText: 'Rates unverified',
      isStale: true,
      daysAgo: 99,
    };
  }

  const date = new Date(lastUpdatedDate);
  const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  const diffDays = Math.floor(diffHours / 24);

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  if (diffHours < 24) {
    return {
      badgeText: `Verified Today at ${timeStr}`,
      isStale: false,
      daysAgo: 0,
      timestamp: date.toISOString(),
    };
  }

  const dayLabel = diffDays <= 1 ? '1 day' : `${diffDays} days`;
  return {
    badgeText: `Updated ${dayLabel} ago`,
    isStale: true,
    daysAgo: diffDays,
    timestamp: date.toISOString(),
  };
}

export const getNearestVendors = async (req, res) => {
  try {
    let {
      lat,
      lng,
      city,
      radius = 35,
      material,
      sort = 'distance_asc',
      search,
    } = req.query;

    let userLat = parseFloat(lat);
    let userLng = parseFloat(lng);
    const searchRadiusKm = parseFloat(radius) || 35;

    if (isNaN(userLat) || isNaN(userLng)) {
      const cityKey = (city || 'bilaspur').toLowerCase().trim();
      const matchedCity = CITY_COORDINATES[cityKey] || CITY_COORDINATES.bilaspur;
      userLat = matchedCity.lat;
      userLng = matchedCity.lng;
    }

    let ownerQuery = {};
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      ownerQuery.$or = [
        { storeName: searchRegex },
        { physicalAddress: searchRegex },
        { city: searchRegex },
        { pincode: searchRegex },
      ];
    }

    const owners = await Owner.find(ownerQuery).lean();
    const ownerIds = owners.map((o) => o._id);
    const inventoryItems = await Inventory.find({ ownerId: { $in: ownerIds } }).lean();

    const inventoryMap = new Map();
    for (const item of inventoryItems) {
      const oId = item.ownerId.toString();
      if (!inventoryMap.has(oId)) {
        inventoryMap.set(oId, []);
      }
      inventoryMap.get(oId).push(item);
    }

    const processedVendors = [];

    for (const owner of owners) {
      const [ownerLng, ownerLat] = owner.location.coordinates;
      const distanceKm = calculateHaversineDistance(userLat, userLng, ownerLat, ownerLng);

      const maxAllowedRadius = Math.max(searchRadiusKm, owner.operationalRadiusKm || 35);
      if (distanceKm > maxAllowedRadius && distanceKm > searchRadiusKm) {
        continue;
      }

      let items = inventoryMap.get(owner._id.toString()) || [];

      if (material && material !== 'All') {
        items = items.filter(
          (it) => it.materialType.toLowerCase() === material.toLowerCase()
        );
        if (items.length === 0) continue;
      }

      let latestUpdate = null;
      let hasFlashDeal = false;
      let lowestPrice = Infinity;

      for (const item of items) {
        if (item.flashDeal?.active) hasFlashDeal = true;
        if (item.unitPrice < lowestPrice) lowestPrice = item.unitPrice;
        if (!latestUpdate || new Date(item.lastUpdatedTimestamp) > new Date(latestUpdate)) {
          latestUpdate = item.lastUpdatedTimestamp;
        }
      }

      const verification = computeTimestampVerification(latestUpdate);

      processedVendors.push({
        ...owner,
        rating: owner.rating || 0,
        reviewCount: owner.reviewCount || 0,
        distanceKm,
        inventory: items,
        hasFlashDeal,
        lowestPrice: lowestPrice === Infinity ? null : lowestPrice,
        verification,
      });
    }

    if (sort === 'price_asc') {
      processedVendors.sort((a, b) => {
        const priceA = a.lowestPrice ?? 999999;
        const priceB = b.lowestPrice ?? 999999;
        return priceA - priceB;
      });
    } else if (sort === 'rating_desc') {
      processedVendors.sort((a, b) => {
        if ((b.rating || 0) !== (a.rating || 0)) {
          return (b.rating || 0) - (a.rating || 0);
        }
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      });
    } else if (sort === 'flash_deals') {
      processedVendors.sort((a, b) => {
        if (a.hasFlashDeal && !b.hasFlashDeal) return -1;
        if (!a.hasFlashDeal && b.hasFlashDeal) return 1;
        return a.distanceKm - b.distanceKm;
      });
    } else {
      processedVendors.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return res.status(200).json({
      success: true,
      count: processedVendors.length,
      userOrigin: {
        lat: userLat,
        lng: userLng,
        resolvedCity: city || 'Bilaspur',
      },
      vendors: processedVendors,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch suppliers.',
      error: err.message,
    });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owner.findById(id).lean();

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found.',
      });
    }

    const inventory = await Inventory.find({ ownerId: id }).sort({ materialType: 1 }).lean();

    let latestUpdate = null;
    for (const item of inventory) {
      if (!latestUpdate || new Date(item.lastUpdatedTimestamp) > new Date(latestUpdate)) {
        latestUpdate = item.lastUpdatedTimestamp;
      }
    }

    const verification = computeTimestampVerification(latestUpdate);

    return res.status(200).json({
      success: true,
      vendor: {
        ...owner,
        rating: owner.rating || 0,
        reviewCount: owner.reviewCount || 0,
        inventory,
        verification,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load supplier profile.',
    });
  }
};

export const rateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;

    const numericScore = parseFloat(score);
    if (!numericScore || numericScore < 1 || numericScore > 5) {
      return res.status(400).json({
        success: false,
        message: 'Score must be between 1 and 5.',
      });
    }

    const owner = await Owner.findById(id);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found.',
      });
    }

    const currentCount = owner.reviewCount || 0;
    const currentRating = owner.rating || 0;

    const newCount = currentCount + 1;
    const newRating = Math.round(((currentRating * currentCount + numericScore) / newCount) * 10) / 10;

    owner.rating = newRating;
    owner.reviewCount = newCount;
    await owner.save();

    return res.status(200).json({
      success: true,
      message: 'Rating submitted.',
      rating: owner.rating,
      reviewCount: owner.reviewCount,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record rating.',
    });
  }
};
