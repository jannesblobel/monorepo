import express, { Router } from "express"

import { decryptAccessToken } from "./auth/implementation.js"
import { privateEnv } from "@inlang/env-variables"

const PATH = "/github-proxy/"

/**
 * Routes for the GitHub service.
 *
 * Proxies requests and adds the authorization header.
 */
export const router: Router = Router()

// matching all routes after the path with '*'
// and proxying the request to the GitHub API
router.all(
	PATH + "*",
	// Parse & make HTTP request body available at `req.body`
	express.json(),
	async (request, response, next) => {
		try {
			const encryptedAccessToken = request.session?.encryptedAccessToken as string | undefined
			const decryptedAccessToken = encryptedAccessToken
				? await decryptAccessToken({
						JWE_SECRET_KEY: privateEnv.JWE_SECRET,
						jwe: encryptedAccessToken,
				  })
				: undefined

			// taking end of proxy path suffix as target url
			const targetUrl = request.url.split(PATH)[1]
			const res = await fetch(targetUrl!, {
				method: request.method,
				// @ts-ignore
				headers: {
					authorization: decryptedAccessToken ? `Bearer ${decryptedAccessToken}` : undefined,
					"Content-Type": request.get("Content-Type"),
				},
				// fetch throws an error if a method is GET and a body is attached
				// the body comes from the express.text() middleware
				body:
					// need to stringify otherwise github's api returns an error
					request.method === "GET" ? undefined : JSON.stringify(request.body),
			})

			response.set("Access-Control-Allow-Origin", privateEnv.PUBLIC_SERVER_BASE_URL)
			response.set("Access-Control-Allow-Credentials", "true")

			if (res.headers.get("content-type")?.includes("json")) {
				response
					.status(res.status)
					.contentType(res.headers.get("content-type")!)
					.send(await res.json())
			} else {
				response.status(res.status).send(res.body)
			}
		} catch (error) {
			console.error("ERROR in github service: ", error)
			next(error)
		}
	},
)
