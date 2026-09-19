import * as ort from 'onnxruntime-web';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { extractFullFeatures } from './featureExtractor.js';

// Configure ONNX WebAssembly CDN path to ensure WASM loads correctly in all browsers
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.29.0/dist/';
ort.env.wasm.numThreads = 1;

const DEFAULT_LABELS = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z"
];

class BisindoClassifier {
    constructor() {
        this.handLandmarker = null;
        this.onnxSession = null;
        this.labels = DEFAULT_LABELS;
        this.isInitialized = false;
        this.initPromise = null;
    }

    async initialize(onProgress = null) {
        if (this.isInitialized) return true;
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            try {
                if (onProgress) onProgress('Memuat MediaPipe Vision WASM...');
                const vision = await FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
                );

                if (onProgress) onProgress('Menyiapkan Hand Landmarker model...');
                this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: '/models/hand_landmarker.task',
                        delegate: 'GPU',
                    },
                    runningMode: 'VIDEO',
                    numHands: 2,
                    minHandDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                    minHandPresenceConfidence: 0.5,
                });

                if (onProgress) onProgress('Menyiapkan Model ONNX BISINDO...');
                this.onnxSession = await ort.InferenceSession.create('/models/bisindo_model.onnx', {
                    executionProviders: ['wasm'],
                });

                // Load labels
                try {
                    const res = await fetch('/models/labels.json');
                    if (res.ok) {
                        this.labels = await res.json();
                    }
                } catch {
                    this.labels = DEFAULT_LABELS;
                }

                this.isInitialized = true;
                if (onProgress) onProgress('Model siap digunakan!');
                return true;
            } catch (err) {
                console.error('[BisindoClassifier] Init Error:', err);
                this.initPromise = null;
                throw err;
            }
        })();

        return this.initPromise;
    }

    detectHands(videoElement, timestampMs) {
        if (!this.handLandmarker) return null;
        return this.handLandmarker.detectForVideo(videoElement, timestampMs);
    }

    async predictFromLandmarks(landmarksResult, options = {}) {
        if (!this.onnxSession || !landmarksResult) return null;

        const { swapHands = false } = options;
        const allLandmarks = landmarksResult.landmarks || [];
        // Support both .handedness and .handednesses
        const allHandedness = (landmarksResult.handedness && landmarksResult.handedness.length > 0)
            ? landmarksResult.handedness
            : (landmarksResult.handednesses || []);

        if (allLandmarks.length === 0) {
            return {
                label: null,
                confidence: 0,
                handDetected: false,
                handsCount: 0,
                detectedHands: [],
                topPredictions: [],
                rawLandmarks: [],
            };
        }

        let leftHand = new Float32Array(63);
        let rightHand = new Float32Array(63);
        const detectedHands = [];

        for (let i = 0; i < allLandmarks.length; i++) {
            const handLandmarks = allLandmarks[i];
            const cat = allHandedness[i]?.[0];
            const rawCategory = cat?.categoryName || cat?.displayName;
            const handLabel = rawCategory || (i === 0 ? 'Left' : 'Right');

            detectedHands.push({
                index: i,
                label: handLabel,
                score: cat?.score !== undefined ? cat.score * 100 : 99,
            });

            const coords = new Float32Array(63);
            for (let j = 0; j < handLandmarks.length; j++) {
                coords[j * 3] = handLandmarks[j].x;
                coords[j * 3 + 1] = handLandmarks[j].y;
                coords[j * 3 + 2] = handLandmarks[j].z;
            }

            if (handLabel === 'Left') {
                leftHand = coords;
            } else {
                rightHand = coords;
            }
        }

        // Apply swapHands — swapped by default in neuma (L/R terbalik agar sesuai)
        const actualLeft = leftHand;
        const actualRight = rightHand;

        // Ekstraksi 156 fitur (persis seperti Android & Python)
        const features150 = extractFullFeatures(actualLeft, actualRight);

        // Inferensi ONNX
        const inputName = this.onnxSession.inputNames[0];
        const inputTensor = new ort.Tensor('float32', features150, [1, 150]);
        const feeds = { [inputName]: inputTensor };

        const results = await this.onnxSession.run(feeds);

        const labelOutputName = this.onnxSession.outputNames[0];
        const probOutputName = this.onnxSession.outputNames[1];

        const predictedIndexBig = results[labelOutputName].data[0];
        const predictedIndex = Number(predictedIndexBig);

        const probData = results[probOutputName].data;
        const confidence = probData[predictedIndex] !== undefined ? probData[predictedIndex] : 0;

        const label = this.labels[predictedIndex] || String.fromCharCode(65 + predictedIndex);

        // Hitung Top 4 prediksi untuk transparansi & debugging akurasi
        const topPredictions = Array.from(probData)
            .map((p, idx) => ({
                label: this.labels[idx] || String.fromCharCode(65 + idx),
                confidence: Math.min(1.0, Math.max(0.0, p)),
            }))
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 4);

        return {
            label,
            confidence: Math.min(1.0, Math.max(0.0, confidence)),
            handDetected: true,
            handsCount: allLandmarks.length,
            detectedHands,
            topPredictions,
            isSwapped: swapHands,
            rawLandmarks: allLandmarks,
        };
    }

    close() {
        if (this.handLandmarker) {
            this.handLandmarker.close();
            this.handLandmarker = null;
        }
        this.onnxSession = null;
        this.isInitialized = false;
        this.initPromise = null;
    }
}

export const bisindoClassifier = new BisindoClassifier();


