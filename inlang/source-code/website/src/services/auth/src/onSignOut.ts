import type { SetStoreFunction } from "solid-js/store"
import type { LocalStorageSchema } from "../../../services/local-storage/index.js"
import { publicEnv } from "@inlang/env-variables"
import { telemetryBrowser } from "@inlang/telemetry"

/**
 * This function is called when the user clicks the "Sign Out" button.
 */
export async function onSignOut(args: { setLocalStorage: SetStoreFunction<LocalStorageSchema> }) {
	// sign out on the server
	const hasExternalGitProxy =
		publicEnv.PUBLIC_SERVER_BASE_URL !== publicEnv.PUBLIC_GIT_PROXY_BASE_URL

	if (hasExternalGitProxy) {
		await Promise.allSettled([
			fetch("/services/auth/sign-out", { method: "POST" }),
			fetch(`${publicEnv.PUBLIC_GIT_PROXY_BASE_URL}/services/auth/sign-out`, {
				method: "POST",
				credentials: "include",
			}),
		])
	} else {
		await fetch("/services/auth/sign-out", { method: "POST" })
	}

	// sign out on the client by setting the user to undefined
	args.setLocalStorage("user", undefined)
	// https://posthog.com/docs/integrate/client/js#reset-after-logout
	telemetryBrowser.reset()
}
