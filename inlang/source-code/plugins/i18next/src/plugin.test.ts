/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { expect, it, describe } from "vitest"
import type { PluginSettings } from "./settings.js"
import { createVariant, getVariant, type Message, type Variant } from "@inlang/sdk"
import { plugin } from "./plugin.js"
import { createNodeishMemoryFs } from "@lix-js/fs"

describe("option pathPattern", () => {
	it("should throw if the path pattern does not include the {languageTag} variable reference", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", "{}")
		try {
			await plugin.loadMessages!({
				languageTags: ["en"],
				sourceLanguageTag: "en",
				settings: { pathPattern: "./resources/" },
				nodeishFs: fs,
			})
			throw new Error("should not reach this")
		} catch (e) {
			expect((e as Error).message).toContain("pathPattern")
		}
	})

	it("should throw if the path pattern uses double curly brackets for {languageTag} variable reference", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", "{}")
		try {
			await plugin.loadMessages!({
				languageTags: ["en"],
				sourceLanguageTag: "en",
				settings: { pathPattern: "./{{languageTag}}.json" },
				nodeishFs: fs,
			})
			throw new Error("should not reach this")
		} catch (e) {
			expect((e as Error).message).toContain("pathPattern")
		}
	})

	it("should throw if the path pattern string does not end with '.json'", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", "{}")
		try {
			await plugin.loadMessages!({
				languageTags: ["en"],
				sourceLanguageTag: "en",
				settings: { pathPattern: "./resources/" },
				nodeishFs: fs,
			})
			throw new Error("should not reach this")
		} catch (e) {
			expect((e as Error).message).toContain("pathPattern")
		}
	})

	it("should throw if the path pattern with namespaces does not include the {languageTag} variable reference", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", "{}")
		try {
			await plugin.loadMessages!({
				languageTags: ["en"],
				sourceLanguageTag: "en",
				settings: {
					pathPattern: {
						common: "./common.json",
					},
				},
				nodeishFs: fs,
			})
			throw new Error("should not reach this")
		} catch (e) {
			expect((e as Error).message).toContain("pathPattern")
		}
	})

	it("should throw if the path pattern with namespaces uses double curly brackets for {languageTag} variable reference", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", "{}")
		try {
			await plugin.loadMessages!({
				languageTags: ["en"],
				sourceLanguageTag: "en",
				settings: {
					pathPattern: {
						common: "./{{languageTag}}.json",
					},
				},
				nodeishFs: fs,
			})
			throw new Error("should not reach this")
		} catch (e) {
			expect((e as Error).message).toContain("pathPattern")
		}
	})

	it("should throw if the path pattern with namespaces does not end with '.json'", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", "{}")
		try {
			await plugin.loadMessages!({
				languageTags: ["en"],
				sourceLanguageTag: "en",
				settings: {
					pathPattern: {
						common: "./{languageTag}/common",
					},
				},
				nodeishFs: fs,
			})
			throw new Error("should not reach this")
		} catch (e) {
			expect((e as Error).message).toContain("pathPattern")
		}
	})

	describe("option sourceLanguageFilePath", () => {
		it("should throw if pathPattern and sourceLanguageFilePath are not of the same type", async () => {
			const fs = createNodeishMemoryFs()
			await fs.writeFile("./en.json", JSON.stringify({ test: "Hello world" }))
			const settings: PluginSettings = {
				pathPattern: {
					common: "./{languageTag}/common.json",
				},
				sourceLanguageFilePath: "./{languageTag}.json",
			}
			const languageTags = ["en"]
			const sourceLanguageTag = "en"
			try {
				await plugin.loadMessages!({
					languageTags,
					sourceLanguageTag,
					settings,
					nodeishFs: fs,
				})
				throw new Error("should not reach this")
			} catch (e) {
				expect((e as Error).message).toContain("sourceLanguageFilePath")
			}
		})

		it("should throw if pathPattern and sourceLanguageFilePath have not the same length of keys", async () => {
			const fs = createNodeishMemoryFs()
			await fs.writeFile("./en.json", JSON.stringify({ test: "Hello world" }))
			const settings: PluginSettings = {
				pathPattern: {
					common: "./{languageTag}/common.json",
					vital: "./{languageTag}/vital.json",
				},
				sourceLanguageFilePath: {
					common: "./main/common.json",
				},
			}
			const languageTags = ["en"]
			const sourceLanguageTag = "en"
			try {
				await plugin.loadMessages!({
					languageTags,
					sourceLanguageTag,
					settings,
					nodeishFs: fs,
				})
				throw new Error("should not reach this")
			} catch (e) {
				expect((e as Error).message).toContain("sourceLanguageFilePath")
			}
		})

		it("should throw if pathPattern and sourceLanguageFilePath have not the same keys (namespaces)", async () => {
			const fs = createNodeishMemoryFs()
			await fs.writeFile("./en.json", JSON.stringify({ test: "Hello world" }))
			const settings: PluginSettings = {
				pathPattern: {
					common: "./{languageTag}/common.json",
					vital: "./{languageTag}/vital.json",
				},
				sourceLanguageFilePath: {
					common: "./main/common.json",
					nonvital: "./{languageTag}/nonvital.json",
				},
			}
			const languageTags = ["en"]
			const sourceLanguageTag = "en"
			try {
				await plugin.loadMessages!({
					languageTags,
					sourceLanguageTag,
					settings,
					nodeishFs: fs,
				})
				throw new Error("should not reach this")
			} catch (e) {
				expect((e as Error).message).toContain("sourceLanguageFilePath")
			}
		})

		it("should not throw if pathPattern and sourceLanguageFilePath are of the same type", async () => {
			const fs = createNodeishMemoryFs()
			await fs.writeFile("./en.json", JSON.stringify({ test: "Hello world" }))
			const settings: PluginSettings = {
				pathPattern: {
					common: "./{languageTag}/common.json",
				},
				sourceLanguageFilePath: {
					common: "./main/common.json",
				},
			}
			const languageTags = ["en"]
			const sourceLanguageTag = "en"
			expect(
				plugin.loadMessages!({ languageTags, sourceLanguageTag, settings, nodeishFs: fs }),
			).resolves.toBeTruthy()
		})
	})

	it("should throw if the path pattern with namespaces has a namespace with a dot", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", "{}")
		try {
			await plugin.loadMessages!({
				languageTags: ["en"],
				sourceLanguageTag: "en",
				settings: {
					pathPattern: {
						"namespaceWith.dot": "./{languageTag}/common.json",
					},
				},
				nodeishFs: fs,
			})
			throw new Error("should not reach this")
		} catch (e) {
			expect((e as Error).message).toContain("pathPattern")
		}
	})

	it("should throw if the path pattern includes wildcard", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", "{}")
		try {
			await plugin.loadMessages!({
				languageTags: ["en"],
				sourceLanguageTag: "en",
				settings: {
					pathPattern: "./{languageTag}/*.json",
				},
				nodeishFs: fs,
			})
			throw new Error("should not reach this")
		} catch (e) {
			expect((e as Error).message).toContain("pathPattern")
		}
	})
})

describe("loadMessage", () => {
	it("should return messages if the path pattern is valid", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", JSON.stringify({ test: "Hello world" }))
		const languageTags = ["en"]
		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
		}
		const sourceLanguageTag = "en"

		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		const variant = getVariant(messages[0]!, { where: { languageTag: "en" } })
		expect(variant?.pattern[0]?.type).toBe("Text")
	})

	it("should work with empty json files", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", JSON.stringify({}))
		const languageTags = ["en"]
		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
		}
		const sourceLanguageTag = "en"

		expect(
			plugin.loadMessages!({ languageTags, sourceLanguageTag, settings, nodeishFs: fs }),
		).resolves.toBeTruthy()
	})

	it("should work with not yet existing files", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", JSON.stringify({ test: "Hello world" }))
		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
		}
		const sourceLanguageTag = "en"
		const languageTags = ["en", "de"]
		expect(
			plugin.loadMessages!({ languageTags, sourceLanguageTag, settings, nodeishFs: fs }),
		).resolves.toBeTruthy()
	})

	it("should add multible variants to the same message", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", JSON.stringify({ test: "Hello world" }))
		await fs.writeFile("./de.json", JSON.stringify({ test: "Hallo welt" }))
		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
		}
		const languageTags = ["en", "de"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		expect(getVariant(messages[0]!, { where: { languageTag: "en" } })).toBeTruthy()
		expect(getVariant(messages[0]!, { where: { languageTag: "de" } })).toBeTruthy()
	})

	// namespaces
	it("should return messages if the path pattern is valid (namespace)", async () => {
		const fs = createNodeishMemoryFs()
		await fs.mkdir("./en")
		await fs.writeFile("./en/common.json", JSON.stringify({ test: "Hello world" }))
		const languageTags = ["en"]
		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}/common.json",
			},
		}
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		const variant = getVariant(messages[0]!, { where: { languageTag: "en" } })
		expect(variant?.pattern[0]?.type).toBe("Text")
	})

	it("should work with empty json files (namespace)", async () => {
		const fs = createNodeishMemoryFs()
		await fs.mkdir("./en")
		await fs.writeFile("./en/common.json", JSON.stringify({}))
		const languageTags = ["en"]
		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}/common.json",
			},
		}
		const sourceLanguageTag = "en"
		expect(
			plugin.loadMessages!({ languageTags, sourceLanguageTag, settings, nodeishFs: fs }),
		).resolves.toBeTruthy()
	})

	it("should work with not yet existing files (namespace)", async () => {
		const fs = createNodeishMemoryFs()
		await fs.mkdir("./en")
		await fs.writeFile("./en/common.json", JSON.stringify({ test: "Hello world" }))
		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}/common.json",
			},
		}
		const sourceLanguageTag = "en"
		const languageTags = ["en", "de"]
		expect(
			plugin.loadMessages!({ languageTags, sourceLanguageTag, settings, nodeishFs: fs }),
		).resolves.toBeTruthy()
	})

	it("should add multible variants to the same message (namespace)", async () => {
		const fs = createNodeishMemoryFs()
		await fs.mkdir("./en")
		await fs.mkdir("./de")
		await fs.writeFile("./en/common.json", JSON.stringify({ test: "Hello world" }))
		await fs.writeFile("./de/common.json", JSON.stringify({ test: "Hallo welt" }))
		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}/common.json",
			},
		}
		const languageTags = ["en", "de"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		expect(getVariant(messages[0]!, { where: { languageTag: "en" } })).toBeTruthy()
		expect(getVariant(messages[0]!, { where: { languageTag: "de" } })).toBeTruthy()
	})

	it("should not throw an error when load messages with empty namespaces", async () => {
		const test = JSON.stringify({
			test: "test",
		})
		const fs = createNodeishMemoryFs()
		await fs.mkdir("./en")
		await fs.mkdir("./de")
		await fs.writeFile("./en/common.json", test)
		await fs.writeFile("./en/vital.json", test)
		await fs.writeFile("./de/common.json", test)
		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}/common.json",
				vital: "./{languageTag}/vital.json",
			},
		}
		const languageTags = ["en", "de"]
		const sourceLanguageTag = "en"
		let isThrown = false
		try {
			await plugin.loadMessages!({
				languageTags,
				sourceLanguageTag,
				settings,
				nodeishFs: fs,
			})
		} catch (e) {
			isThrown = true
		}
		expect(isThrown).toBe(false)
	})

	it("should get the correct languages, when single namespace is defined as a pathPattern string 'pathPattern: `public/locales/{languageTag}/translation.json`'", async () => {
		const test = JSON.stringify({
			test: "test",
		})
		const fs = createNodeishMemoryFs()
		await fs.mkdir("./en")
		await fs.mkdir("./de")
		await fs.writeFile("./en/common.json", test)
		await fs.writeFile("./de/common.json", test)
		const settings: PluginSettings = {
			pathPattern: {
				pathPattern: "./{languageTag}/common.json",
			},
		}
		const languageTags = ["en", "de"]
		const sourceLanguageTag = "en"
		let isThrown = false
		try {
			await plugin.loadMessages!({
				sourceLanguageTag,
				languageTags,
				settings,
				nodeishFs: fs,
			})
		} catch (e) {
			isThrown = true
		}
		expect(isThrown).toBe(false)
	})

	it("should not throw an error when the path to the resources is not present", async () => {
		const fs = createNodeishMemoryFs()
		const settings: PluginSettings = {
			pathPattern: {
				pathPattern: ".lang/{languageTag}.json",
			},
		}
		const languageTags = ["en"]
		const sourceLanguageTag = "en"
		let isThrown = false
		try {
			await plugin.loadMessages!({
				languageTags,
				sourceLanguageTag,
				settings,
				nodeishFs: fs,
			})
		} catch (e) {
			isThrown = true
		}
		expect(isThrown).toBe(false)
	})
})

describe("saveMessage", () => {
	it("test string pathPattern", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", JSON.stringify({}))
		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
		}
		const messages: Message[] = [
			{
				id: "test",
				selectors: [],
				variants: [
					{
						languageTag: "en",
						match: {},
						pattern: [
							{
								type: "Text",
								value: "Hello world",
							},
						],
					},
				],
			},
		]
		await plugin.saveMessages!({ messages, settings, nodeishFs: fs })
	})

	it("test object pathPattern", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", JSON.stringify({}))
		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}/common.json",
			},
		}
		const messages: Message[] = [
			{
				id: "common:test",
				selectors: [],
				variants: [
					{
						languageTag: "en",
						match: {},
						pattern: [
							{
								type: "Text",
								value: "Hello world",
							},
						],
					},
				],
			},
			{
				id: "common:test2",
				selectors: [],
				variants: [
					{
						languageTag: "en",
						match: {},
						pattern: [
							{
								type: "Text",
								value: "Hello world2",
							},
						],
					},
				],
			},
		]
		await plugin.saveMessages!({ messages, settings, nodeishFs: fs })
	})
})

describe("variable reference", () => {
	it("should correctly identify variable reference (at the end)", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", JSON.stringify({ test: "Hello {{username}}" }))
		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
		}
		const sourceLanguageTag = "en"
		const languageTags = ["en"]
		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		expect(getVariant(messages[0]!, { where: { languageTag: "en" } })?.pattern.length).toBe(2)
		expect(getVariant(messages[0]!, { where: { languageTag: "en" } })?.pattern[0]?.type).toBe(
			"Text",
		)
		expect(getVariant(messages[0]!, { where: { languageTag: "en" } })?.pattern[1]?.type).toBe(
			"VariableReference",
		)
	})

	it("should correctly identify variable reference (at the beginning)", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", JSON.stringify({ test: "{{username}} the great" }))
		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
		}
		const languageTags = ["en"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		expect(getVariant(messages[0]!, { where: { languageTag: "en" } })?.pattern.length).toBe(2)
		expect(getVariant(messages[0]!, { where: { languageTag: "en" } })?.pattern[0]?.type).toBe(
			"VariableReference",
		)
		expect(getVariant(messages[0]!, { where: { languageTag: "en" } })?.pattern[1]?.type).toBe(
			"Text",
		)
	})

	it("should correctly apply the variableReferencePattern", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", JSON.stringify({ test: "Hello @username" }))
		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
			variableReferencePattern: ["@"],
		}
		const languageTags = ["en"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		expect(getVariant(messages[0]!, { where: { languageTag: "en" } })?.pattern[0]?.type).toBe(
			"Text",
		)
		expect(getVariant(messages[0]!, { where: { languageTag: "en" } })?.pattern[1]?.type).toBe(
			"VariableReference",
		)
	})
})

describe("sourceLanguageFilePath", () => {
	it("should resolve the sourceLanguageFilePath", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./main.json", JSON.stringify({ test: "Hello world" }))
		await fs.writeFile("./de.json", JSON.stringify({ test: "Hallo Welt" }))

		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
			sourceLanguageFilePath: "./main.json",
		}

		const languageTags = ["en", "de"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		expect(getVariant(messages[0]!, { where: { languageTag: "en" } })).toBeTruthy()
		expect(getVariant(messages[0]!, { where: { languageTag: "de" } })).toBeTruthy()
	})

	it("should resolve the sourceLanguageFilePath (namespace)", async () => {
		const fs = createNodeishMemoryFs()
		await fs.mkdir("./main")
		await fs.mkdir("./de")
		await fs.writeFile("./main/common.json", JSON.stringify({ test: "Hello world" }))
		await fs.writeFile("./de/common.json", JSON.stringify({ test: "Hallo welt" }))
		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}/common.json",
			},
			sourceLanguageFilePath: {
				common: "./main/common.json",
			},
		}
		const languageTags = ["en", "de"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		expect(getVariant(messages[0]!, { where: { languageTag: "en" } })).toBeTruthy()
		expect(getVariant(messages[0]!, { where: { languageTag: "de" } })).toBeTruthy()
	})
})

describe("formatting", () => {
	it("should preserve the order of ids for pathPattern string", async () => {
		const content = JSON.stringify({ a: "test", z: "test", b: "test" }, undefined, 2)
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", content)

		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
		}

		const languageTags = ["en"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})

		await plugin.saveMessages!({ messages: messages, settings, nodeishFs: fs })

		const newContent = await fs.readFile("./en.json", { encoding: "utf-8" })

		expect(content).toStrictEqual(newContent)
	})

	it("should preserve the order of ids for pathPattern with namespaces", async () => {
		const content = JSON.stringify({ a: "test", z: "test", b: "test" }, undefined, 2)
		const fs = createNodeishMemoryFs()
		await fs.mkdir("./common")
		await fs.writeFile("./common/en.json", content)

		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}/common.json",
			},
		}

		const languageTags = ["en"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			sourceLanguageTag,
			languageTags,
			settings,
			nodeishFs: fs,
		})

		await plugin.saveMessages!({ messages: messages, settings, nodeishFs: fs })

		const newContent = await fs.readFile("./common/en.json", { encoding: "utf-8" })

		expect(content).toStrictEqual(newContent)
	})

	it("should preserve the order of ids for pathPattern with namespaces and nested keys", async () => {
		const content = JSON.stringify(
			{
				z: { a: "test", z: "test", b: "test" },
				a: { a: "test", z: "test", b: "test" },
			},
			undefined,
			2,
		)
		const fs = createNodeishMemoryFs()
		await fs.mkdir("./common")
		await fs.writeFile("./common/en.json", content)

		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}/common.json",
			},
		}

		const languageTags = ["en"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			sourceLanguageTag,
			languageTags,
			settings,
			nodeishFs: fs,
		})

		await plugin.saveMessages!({ messages: messages, settings, nodeishFs: fs })

		const newContent = await fs.readFile("./common/en.json", { encoding: "utf-8" })

		expect(content).toStrictEqual(newContent)
	})

	it("should preserve the spacing resources and determine a default based on the majority for newly added resources", async () => {
		// @prettier-ignore
		const with4Spaces = `{
    "test": "test"
}`

		// @prettier-ignore
		const withTabs = `{
	"test": "test"
}`

		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", with4Spaces)
		await fs.writeFile("./fr.json", with4Spaces)
		await fs.writeFile("./de.json", withTabs)
		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
		}
		const languageTags = ["en", "de", "fr"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		const variant: Variant = {
			languageTag: "es",
			match: {},
			pattern: [
				{
					type: "Text",
					value: "test",
				},
			],
		}
		const newMessage = createVariant(messages[0]!, {
			data: variant,
		}).data

		await plugin.saveMessages!({ messages: [newMessage!], settings, nodeishFs: fs })

		const file1 = await fs.readFile("./en.json", { encoding: "utf-8" })
		const file2 = await fs.readFile("./fr.json", { encoding: "utf-8" })
		const file3 = await fs.readFile("./de.json", { encoding: "utf-8" })
		const file4 = await fs.readFile("./es.json", { encoding: "utf-8" })

		expect(file1).toBe(with4Spaces)
		expect(file2).toBe(with4Spaces)
		expect(file3).toBe(withTabs)
		expect(file4).toBe(with4Spaces)
	})

	it("should remember if a file has a new line at the end or not", async () => {
		// @prettier-ignore
		const withNewLine = `{
	"test": "test"
}
`

		// @prettier-ignore
		const withoutNewLine = `{
	"test": "test"
}`

		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", withNewLine)
		await fs.writeFile("./fr.json", withoutNewLine)
		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
		}
		const sourceLanguageTag = "en"
		const languageTags = ["en", "de", "fr"]
		const messages = await plugin.loadMessages!({
			sourceLanguageTag,
			languageTags,
			settings,
			nodeishFs: fs,
		})
		await plugin.saveMessages!({ messages, settings, nodeishFs: fs })
		const file1 = await fs.readFile("./en.json", { encoding: "utf-8" })
		const file2 = await fs.readFile("./fr.json", { encoding: "utf-8" })
		expect(file1).toBe(withNewLine)
		expect(file2).toBe(withoutNewLine)
	})

	it("should escape `.` in flattened json structures", async () => {
		const enResource = `{
    "test.": "test",
	"test.test": "test"
}`

		const fs = createNodeishMemoryFs()
		await fs.mkdir("./en")
		await fs.writeFile("./en/common.json", enResource)
		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}/common.json",
			},
		}
		const languageTags = ["en"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			sourceLanguageTag,
			languageTags,
			settings,
			nodeishFs: fs,
		})
		const reference: Message[] = [
			{
				id: "common:test.",
				selectors: [],
				variants: [
					{
						languageTag: "en",
						match: {},
						pattern: [
							{
								type: "Text",
								value: "test",
							},
						],
					},
				],
			},
			{
				id: "common:test.test",
				selectors: [],
				variants: [
					{
						languageTag: "en",
						match: {},
						pattern: [
							{
								type: "Text",
								value: "test",
							},
						],
					},
				],
			},
		]

		expect(messages).toStrictEqual(reference)
	})

	it("should escape `.` in nested json structures", async () => {
		const enResource = `{
	"a.": {
		"b": "test"
	},
	"c.": "test"
}`

		const fs = createNodeishMemoryFs()
		await fs.mkdir("./en")
		await fs.writeFile("./en/common.json", enResource)
		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}/common.json",
			},
		}
		const languageTags = ["en"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			sourceLanguageTag,
			languageTags,
			settings,
			nodeishFs: fs,
		})
		const reference: Message[] = [
			{
				id: "common:a..b",
				selectors: [],
				variants: [
					{
						languageTag: "en",
						match: {},
						pattern: [
							{
								type: "Text",
								value: "test",
							},
						],
					},
				],
			},
			{
				id: "common:c.",
				selectors: [],
				variants: [
					{
						languageTag: "en",
						match: {},
						pattern: [
							{
								type: "Text",
								value: "test",
							},
						],
					},
				],
			},
		]
		expect(messages).toStrictEqual(reference)
		await plugin.saveMessages!({
			messages,
			settings,
			nodeishFs: fs,
		})
		const file = await fs.readFile("./en/common.json", { encoding: "utf-8" })
		const json = JSON.parse(file as string)
		expect(json["a."].b).toStrictEqual("test")
		expect(json["c."]).toStrictEqual("test")
	})

	it("should correctly detect the nesting in a file and determine a default based on the majority for newly added resources", async () => {
		const withNesting = JSON.stringify(
			{
				test: {
					test: "test",
				},
			},
			undefined,
			2,
		)

		const withoutNesting = JSON.stringify(
			{
				"test.test": "test",
			},
			undefined,
			4,
		)

		const fs = createNodeishMemoryFs()

		await fs.writeFile("./en.json", withNesting)
		await fs.writeFile("./fr.json", withNesting)
		await fs.writeFile("./de.json", withoutNesting)

		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
		}

		const languageTags = ["en", "de", "fr"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			sourceLanguageTag,
			languageTags,
			settings,
			nodeishFs: fs,
		})

		messages.push({
			id: "test.test",
			selectors: [],
			variants: [
				{
					languageTag: "es",
					match: {},
					pattern: [
						{
							type: "Text",
							value: "test",
						},
					],
				},
			],
		})

		await plugin.saveMessages!({
			messages,
			settings,
			nodeishFs: fs,
		})

		const file1 = await fs.readFile("./en.json", { encoding: "utf-8" })
		const file2 = await fs.readFile("./fr.json", { encoding: "utf-8" })
		const file3 = await fs.readFile("./de.json", { encoding: "utf-8" })
		const file4 = await fs.readFile("./es.json", { encoding: "utf-8" })

		expect(file1).toBe(withNesting)
		expect(file2).toBe(withNesting)
		expect(file3).toBe(withoutNesting)
		expect(file4).toBe(withNesting)
	})
})

describe("roundTrip", () => {
	it("should serialize newly added messages", async () => {
		const enResource = `{
	"test": "{{username}}"
}`

		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", enResource)
		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
		}

		const languageTags = ["en"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			sourceLanguageTag,
			languageTags,
			settings,
			nodeishFs: fs,
		})
		const variant: Variant = {
			languageTag: "en",
			match: {},
			pattern: [
				{
					type: "Text",
					value: "This is new",
				},
			],
		}
		const newMessage: Message = {
			id: "test2",
			selectors: [],
			variants: [variant],
		}
		messages.push(newMessage)
		await plugin.saveMessages!({
			messages,
			settings,
			nodeishFs: fs,
		})
		const newFile = (await fs.readFile("./en.json", { encoding: "utf-8" })) as string
		const json = JSON.parse(newFile)
		expect(json.test).toBe("{{username}}")
		expect(json.test2).toBe("This is new")
	})

	it("should correctly parse resources with pathPattern that contain namespaces", async () => {
		const testResource = `{
	"test": "test"
}`

		const fs = createNodeishMemoryFs()
		await fs.mkdir("./en")
		await fs.writeFile("./en/common.json", testResource)
		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}/common.json",
			},
		}
		const sourceLanguageTag = "en"
		const languageTags = ["en"]
		const messages = await plugin.loadMessages!({
			sourceLanguageTag,
			languageTags,
			settings,
			nodeishFs: fs,
		})
		const reference: Message[] = [
			{
				id: "common:test",
				selectors: [],
				variants: [
					{
						languageTag: "en",
						match: {},
						pattern: [
							{
								type: "Text",
								value: "test",
							},
						],
					},
				],
			},
		]
		expect(messages).toStrictEqual(reference)
	})

	it("should successfully do a roundtrip with complex content", async () => {
		const complexContent = JSON.stringify(
			{
				"//multiLineString": {
					multiline: "This is a\nmulti-line\nstring.",
				},
				unicodeCharacters: {
					emoji: "\uD83D\uDE00",
					currency: "€",
				},
				test: 'Single "quote" test',
			},
			undefined,
			4,
		)
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", complexContent)
		const languageTags = ["en"]
		const sourceLanguageTag = "en"
		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}.json",
			},
		}
		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		plugin.saveMessages!({ messages, settings, nodeishFs: fs })
		const newMessage = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		expect(newMessage).toStrictEqual(messages)
	})

	it("should successfully do a roundtrip with empty message value", async () => {
		const test = JSON.stringify({
			test: "",
		})
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./en.json", test)
		const languageTags = ["en"]
		const sourceLanguageTag = "en"
		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}.json",
			},
		}
		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		plugin.saveMessages!({ messages, settings, nodeishFs: fs })
		const newMessage = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		expect(newMessage).toStrictEqual(messages)
	})

	it("should successfully do a roundtrip using sourceLanguageFilePath", async () => {
		const fs = createNodeishMemoryFs()
		await fs.writeFile("./main.json", JSON.stringify({ test: "Hello world" }))
		await fs.writeFile("./de.json", JSON.stringify({ test: "Hallo Welt" }))

		const settings: PluginSettings = {
			pathPattern: "./{languageTag}.json",
			sourceLanguageFilePath: "./main.json",
		}

		const languageTags = ["de", "en"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		plugin.saveMessages!({ messages, settings, nodeishFs: fs })
		const newMessage = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		expect(await fs.readdir("./")).toStrictEqual(["main.json", "de.json"])
		expect(newMessage).toStrictEqual(messages)
	})

	it("should successfully do a roundtrip using sourceLanguageFilePath (namespace)", async () => {
		const fs = createNodeishMemoryFs()
		await fs.mkdir("./main")
		await fs.mkdir("./de")
		await fs.writeFile("./main/common.json", JSON.stringify({ test: "Hello world" }))
		await fs.writeFile("./de/common.json", JSON.stringify({ test: "Hallo welt" }))
		const settings: PluginSettings = {
			pathPattern: {
				common: "./{languageTag}/common.json",
			},
			sourceLanguageFilePath: {
				common: "./main/common.json",
			},
		}
		const languageTags = ["en", "de"]
		const sourceLanguageTag = "en"
		const messages = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		plugin.saveMessages!({ messages, settings, nodeishFs: fs })
		const newMessage = await plugin.loadMessages!({
			languageTags,
			sourceLanguageTag,
			settings,
			nodeishFs: fs,
		})
		expect(await fs.readdir("./")).toStrictEqual(["main", "de"])
		expect(newMessage).toStrictEqual(messages)
	})
})
