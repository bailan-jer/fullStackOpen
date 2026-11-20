const { test, expect } = require("@playwright/test")
const { beforeEach, describe } = test

describe("Blog app", () => {
	beforeEach(async ({ page }) => {
		await page.goto("http://localhost:5173")
	})

	test("Login form is shown", async ({ page }) => {
		await expect(page.getByText("login to application")).toBeVisible()
		await expect(page.getByLabel("username")).toBeVisible()
		await expect(page.getByLabel("password")).toBeVisible()
		await expect(page.getByRole("button", { name: "login" })).toBeVisible()
	})
})

