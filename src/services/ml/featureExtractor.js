/**
 * @param {Float32Array|number[]} coords
 * @returns {Float32Array}
 */
export function normalizeLandmarks(coords) {
    let allZero = true;
    for (let i = 0; i < coords.length; i++) {
        if (coords[i] !== 0.0) { allZero = false; break; }
    }
    if (allZero) return new Float32Array(60);

    const wristX = coords[0];
    const wristY = coords[1];
    const wristZ = coords[2];

    const shifted = new Float32Array(63);
    let maxVal = 0;
    for (let i = 0; i < 63; i += 3) {
        shifted[i] = coords[i] - wristX;
        shifted[i + 1] = coords[i + 1] - wristY;
        shifted[i + 2] = coords[i + 2] - wristZ;
        if (Math.abs(shifted[i]) > maxVal) maxVal = Math.abs(shifted[i]);
        if (Math.abs(shifted[i + 1]) > maxVal) maxVal = Math.abs(shifted[i + 1]);
        if (Math.abs(shifted[i + 2]) > maxVal) maxVal = Math.abs(shifted[i + 2]);
    }

    if (maxVal > 0) {
        for (let i = 0; i < 63; i++) shifted[i] /= maxVal;
    }

    return shifted.slice(3);
}

function dist3d(ax, ay, az, bx, by, bz) {
    const dx = ax - bx, dy = ay - by, dz = az - bz;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * @param {Float32Array} norm60
 * @returns {Float32Array}
 */
export function computeDerivedFeatures(norm60) {
    let allZero = true;
    for (let i = 0; i < norm60.length; i++) {
        if (norm60[i] !== 0.0) { allZero = false; break; }
    }
    if (allZero) return new Float32Array(15);

    function pt(idx) {
        return [norm60[idx * 3], norm60[idx * 3 + 1], norm60[idx * 3 + 2]];
    }

    const thumbTip = pt(3);
    const indexTip = pt(7);
    const middleTip = pt(11);
    const ringTip = pt(15);
    const pinkyTip = pt(19);

    const thumbMcp = pt(1);
    const indexMcp = pt(4);
    const middleMcp = pt(8);
    const ringMcp = pt(12);
    const pinkyMcp = pt(16);

    const fingertips = [thumbTip, indexTip, middleTip, ringTip, pinkyTip];
    const mcps = [thumbMcp, indexMcp, middleMcp, ringMcp, pinkyMcp];

    const features = new Float32Array(15);
    let f = 0;

    for (let i = 0; i < 5; i++) {
        const [x, y, z] = fingertips[i];
        features[f++] = dist3d(x, y, z, 0, 0, 0);
    }

    for (let i = 0; i < 4; i++) {
        const [ax, ay, az] = fingertips[i];
        const [bx, by, bz] = fingertips[i + 1];
        features[f++] = dist3d(ax, ay, az, bx, by, bz);
    }

    for (let i = 0; i < 5; i++) {
        const [ax, ay, az] = fingertips[i];
        const [bx, by, bz] = mcps[i];
        features[f++] = dist3d(ax, ay, az, bx, by, bz);
    }

    const [ix, iy, iz] = indexTip;
    const [px, py, pz] = pinkyTip;
    features[f++] = dist3d(ix, iy, iz, px, py, pz);

    return features;
}

/**
 * @param {Float32Array} leftRaw63
 * @param {Float32Array} rightRaw63
 * @returns {Float32Array}
 */
export function extractFullFeatures(leftRaw63, rightRaw63) {
    const leftNorm = normalizeLandmarks(leftRaw63);
    const leftDerived = computeDerivedFeatures(leftNorm);
    const rightNorm = normalizeLandmarks(rightRaw63);
    const rightDerived = computeDerivedFeatures(rightNorm);

    const result = new Float32Array(150);
    result.set(leftNorm, 0);
    result.set(leftDerived, 60);
    result.set(rightNorm, 75);
    result.set(rightDerived, 135);

    console.assert(result.length === 150, `[featureExtractor] Expected 150 features, got ${result.length}`);

    return result;
}
