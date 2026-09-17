export function normalizeLandmarks(coords) {
    let allZero = true;
    for (let i = 0; i < coords.length; i++) {
        if (coords[i] !== 0.0) {
            allZero = false;
            break;
        }
    }
    if (allZero) return new Float32Array(coords.length);

    const wristX = coords[0];
    const wristY = coords[1];
    const wristZ = coords[2];

    const normalized = new Float32Array(coords.length);
    let maxVal = 0;

    for (let i = 0; i < coords.length; i += 3) {
        normalized[i] = coords[i] - wristX;
        normalized[i + 1] = coords[i + 1] - wristY;
        normalized[i + 2] = coords[i + 2] - wristZ;

        const absX = Math.abs(normalized[i]);
        const absY = Math.abs(normalized[i + 1]);
        const absZ = Math.abs(normalized[i + 2]);

        if (absX > maxVal) maxVal = absX;
        if (absY > maxVal) maxVal = absY;
        if (absZ > maxVal) maxVal = absZ;
    }

    if (maxVal > 0) {
        for (let i = 0; i < normalized.length; i++) {
            normalized[i] = normalized[i] / maxVal;
        }
    }

    return normalized;
}

function euclideanDistance(p1, p2) {
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    const dz = p1[2] - p2[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function computeDerivedFeatures(coords) {
    let allZero = true;
    for (let i = 0; i < coords.length; i++) {
        if (coords[i] !== 0.0) {
            allZero = false;
            break;
        }
    }
    if (allZero) return new Float32Array(15);

    const points = [];
    for (let i = 0; i < coords.length; i += 3) {
        points.push([coords[i], coords[i + 1], coords[i + 2]]);
    }

    const tipIndices = [4, 8, 12, 16, 20];
    const fingertips = tipIndices.map((idx) => points[idx]);
    const wrist = points[0];

    const features = [];

    // Distance between finger tips and wrist (5 features)
    for (let i = 0; i < fingertips.length; i++) {
        features.push(euclideanDistance(fingertips[i], wrist));
    }

    // Distance between adjacent finger tips (4 features)
    for (let i = 0; i < fingertips.length - 1; i++) {
        features.push(euclideanDistance(fingertips[i], fingertips[i + 1]));
    }

    // Distance between thumb and other finger tips (4 features)
    for (let i = 1; i < fingertips.length; i++) {
        features.push(euclideanDistance(fingertips[0], fingertips[i]));
    }

    // Distance between middle finger and pinky, and index finger and pinky (2 features)
    features.push(euclideanDistance(fingertips[2], fingertips[4]));
    features.push(euclideanDistance(fingertips[1], fingertips[4]));

    return new Float32Array(features);
}

export function extractFullFeatures(leftHand, rightHand) {
    const leftNorm = normalizeLandmarks(leftHand);
    const leftDerived = computeDerivedFeatures(leftHand);
    const rightNorm = normalizeLandmarks(rightHand);
    const rightDerived = computeDerivedFeatures(rightHand);

    const result = new Float32Array(156);
    let pos = 0;

    result.set(leftNorm, pos);
    pos += leftNorm.length;

    result.set(leftDerived, pos);
    pos += leftDerived.length;

    result.set(rightNorm, pos);
    pos += rightNorm.length;

    result.set(rightDerived, pos);
    pos += rightDerived.length;

    return result;
}
