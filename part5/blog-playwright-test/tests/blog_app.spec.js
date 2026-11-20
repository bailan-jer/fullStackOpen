const { test, expect } = require("@playwright/test")
const { beforeEach, describe } = test

const INITIAL_USER = {
			username: "mlukkai",
			name: "mlukkai salainen",
			password: "salainen"
		}
		
describe("Blog app", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset")
		await request.post("/api/users", { data: INITIAL_USER })
		await page.goto("/")
	})


	test("login form is shown", async ({ page }) => {
		await expect(page.getByText("login to application")).toBeVisible()
		await expect(page.getByLabel("username")).toBeVisible()
		await expect(page.getByLabel("password")).toBeVisible()
		await expect(page.getByRole("button", { name: "login" })).toBeVisible()
	})

	describe("Login", () => {
		const fillCredentials = async (page, username, password) => {
			const usernameField = page.getByLabel("username")
			const passwordField = page.getByLabel("password")
			const loginButton = page.getByRole("button", { name: "login" })

			await usernameField.fill(username)
			await passwordField.fill(password)
			await loginButton.click()
		}

		test("succeeds with correct credentials", async ({ page }) => {
			await fillCredentials(page, INITIAL_USER.username, INITIAL_USER.password)
			await expect(page.getByText(`${INITIAL_USER.username} logged in`)).toBeVisible()
		})

		test("fails with wrong credentials", async ({ page }) => {
			await fillCredentials(page, "wrong username", "wrong password")
			await expect(page.getByText("wrong username or password")).toBeVisible()
		})
	})
})

