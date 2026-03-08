import SpInAppUpdates, {
    IAUUpdateKind,
} from 'sp-react-native-in-app-updates';
import { Platform } from 'react-native';

class UpdateService {
    constructor() {
        this.inAppUpdates = new SpInAppUpdates(
            false // isDebug
        );
    }

    /**
     * Check if an update is available
     */
    checkUpdateAvailability = async () => {
        try {
            if (!this.inAppUpdates) {
                console.warn('UpdateService: inAppUpdates instance is not initialized');
                return false;
            }

            if (Platform.OS === 'android') {
                const result = await this.inAppUpdates.checkNeedsUpdate();
                return result?.shouldUpdate || false;
            }
            // iOS implementation placeholder
            return false;
        } catch (error) {
            console.warn('Update check failed (likely due to missing native module or store connection):', error);
            // We return false to allow the app to boot even if update check fails
            return false;
        }
    };

    /**
     * Perform the update
     */
    performUpdate = async () => {
        try {
            if (Platform.OS === 'android') {
                const updateOptions = {
                    updateType: IAUUpdateKind.IMMEDIATE,
                };
                await this.inAppUpdates.startUpdate(updateOptions);
            }
        } catch (error) {
            console.error('Failed to start update:', error);
        }
    };
}

export const updateService = new UpdateService();
export default updateService;
