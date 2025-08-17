// A service to handle rewarded video ads via Adivery, with robust initialization.

interface AdiveryAd {
    /**
     * Shows the ad.
     * @returns A promise that resolves with a boolean indicating if the user was rewarded.
     */
    show: () => Promise<boolean>;
}

interface AdiverySDK {
    /**
     * Configures the Adivery SDK with your App ID.
     */
    configure: (appId: string) => void;
    /**
     * Requests a rewarded ad for a given placement.
     * @returns A promise that resolves with an ad object if an ad is loaded.
     */
    requestRewardedAd: (placementId: string) => Promise<AdiveryAd>;
}

// Augment the Window interface to declare the global Adivery object.
declare global {
    interface Window {
        Adivery?: AdiverySDK;
    }
}

const ADIVERY_APP_ID = 'fd86f445-b8f8-4177-bec6-dcb50dd68f15';
const REWARDED_VIDEO_PLACEMENT_ID = '2fa75852-230b-4e10-9f10-4bad0e8b4206';

// State management
let isRequestInProgress = false; // Lock for showing an ad
let isPreloadInProgress = false; // Lock for preloading
let isConfigured = false;
let adiveryInitializationPromise: Promise<void> | null = null;
let preloadedAd: AdiveryAd | null = null; // The preloaded ad object

/**
 * Ensures the Adivery SDK is loaded and initialized by dynamically injecting the script.
 * @returns A promise that resolves when Adivery is ready.
 */
const ensureAdiveryIsReady = (): Promise<void> => {
    // If initialization is already in progress or complete, return the existing promise.
    if (adiveryInitializationPromise) {
        return adiveryInitializationPromise;
    }

    // Start the initialization process.
    adiveryInitializationPromise = new Promise((resolve, reject) => {
        // If the SDK object already exists (perhaps from a previous session), configure and resolve.
        if (typeof window.Adivery !== 'undefined' && window.Adivery.configure) {
            if (!isConfigured) {
                try {
                    window.Adivery.configure(ADIVERY_APP_ID);
                    isConfigured = true;
                    console.log("Adivery SDK already present, configured.");
                } catch (e) {
                     return reject(new Error("Ad service configuration failed."));
                }
            }
            return resolve();
        }

        // Dynamically create and inject the script tag.
        const script = document.createElement('script');
        script.src = 'https://github.com/adivery/adivery-js/releases/latest/download/adivery.global.js';
        script.async = true;

        script.onload = () => {
            // Script has loaded, now wait for the Adivery object to be defined.
            const checkInterval = 100;
            const timeout = 8000; // 8 seconds
            let elapsedTime = 0;

            const intervalId = setInterval(() => {
                if (typeof window.Adivery !== 'undefined' && window.Adivery.configure) {
                    clearInterval(intervalId);
                    if (!isConfigured) {
                        try {
                            window.Adivery.configure(ADIVERY_APP_ID);
                            isConfigured = true;
                            console.log("Adivery SDK configured.");
                            resolve();
                        } catch (e) {
                            console.error("Adivery SDK is present but configuration failed.", e);
                            reject(new Error("Ad service configuration failed."));
                        }
                    } else {
                        resolve();
                    }
                } else {
                    elapsedTime += checkInterval;
                    if (elapsedTime >= timeout) {
                        clearInterval(intervalId);
                        console.error("Adivery SDK loaded but object not found within timeout.");
                        reject(new Error("Ad service failed to initialize."));
                    }
                }
            }, checkInterval);
        };

        script.onerror = () => {
            console.error("Adivery SDK script failed to load. Check connection or ad blockers.");
            adiveryInitializationPromise = null; // Allow retrying
            reject(new Error("Ad service is not available. Check your connection or ad blocker."));
        };

        document.head.appendChild(script);
    });

    return adiveryInitializationPromise;
};

/**
 * Preloads a rewarded video ad in the background. This is an optimistic call
 * and will fail silently (logging to console) if an ad is not available,
 * as it's not a user-initiated action.
 */
export const preloadRewardedVideo = async (): Promise<void> => {
    if (isRequestInProgress || isPreloadInProgress || preloadedAd) {
        console.log("Ad preload skipped: another ad operation is in progress or an ad is already loaded.");
        return;
    }

    try {
        await ensureAdiveryIsReady();
    } catch (error) {
        console.warn("Ad service initialization failed during preload. Aborting preload.", error);
        return; // Don't proceed if SDK is not ready
    }

    const Adivery = window.Adivery!;
    isPreloadInProgress = true;
    console.log("Preloading rewarded ad...");

    try {
        preloadedAd = await Adivery.requestRewardedAd(REWARDED_VIDEO_PLACEMENT_ID);
        console.log("Rewarded ad preloaded successfully.");
    } catch (error) {
        // Preloading errors are not critical for the user. "No fill" is expected. Just log and reset.
        console.warn("Rewarded ad preload failed (this is often expected):", error);
        preloadedAd = null; // Ensure no stale ad is kept
    } finally {
        isPreloadInProgress = false;
    }
};

/**
 * Shows a rewarded video ad using the Adivery SDK.
 * It will first try to use a preloaded ad for instant display. If none is available,
 * it will request one on-demand.
 * @returns A promise that resolves to `true` if the user was rewarded, `false` otherwise.
 */
export const showRewardedVideo = async (): Promise<boolean> => {
    // First, ensure the Adivery SDK is loaded and ready.
    try {
        await ensureAdiveryIsReady();
    } catch (error) {
        // The error from ensureAdiveryIsReady is already user-friendly.
        console.error("Ad service initialization failed:", error);
        throw error;
    }

    // Prevent multiple ad requests from starting simultaneously.
    if (isRequestInProgress) {
        console.warn("An ad show request is already in progress.");
        throw new Error("An ad request is already in progress.");
    }

    isRequestInProgress = true;

    try {
        let ad: AdiveryAd;

        if (preloadedAd) {
            console.log("Using preloaded ad.");
            ad = preloadedAd;
            preloadedAd = null; // Consume the ad so it's not used again.
        } else {
            console.log("No preloaded ad available. Requesting ad on-demand.");
            const Adivery = window.Adivery!;
            ad = await Adivery.requestRewardedAd(REWARDED_VIDEO_PLACEMENT_ID);
        }
        
        console.log("Ad loaded successfully. Showing ad...");
        const isRewarded = await ad.show();
        console.log(`Ad finished. Rewarded: ${isRewarded}`);
        return isRewarded;

    } catch (error: any) {
        console.error("Adivery ad error during showRewardedVideo:", error);
        
        const errorMessage = (error?.message || String(error)).toLowerCase();

        if (errorMessage.includes('no fill')) {
            // This is a common, non-critical error. Inform the user gracefully.
            throw new Error("در حال حاضر تبلیغی برای نمایش وجود ندارد. لطفاً چند دقیقه دیگر دوباره امتحان کنید.");
        }
        
        // For all other errors, use a more generic message.
        throw new Error("مشکلی در نمایش تبلیغ رخ داد. لطفا اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید.");

    } finally {
        // Ensure the lock is released, whether the ad succeeds or fails.
        isRequestInProgress = false;
    }
};