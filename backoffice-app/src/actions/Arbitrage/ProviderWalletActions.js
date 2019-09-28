import {
    // Clear Provider Wallet Data
    CLEAR_PROVIDER_WALLET_DATA
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Clear Provider Wallet Data
export function clearProviderWalletData() {
    return action(CLEAR_PROVIDER_WALLET_DATA)
}