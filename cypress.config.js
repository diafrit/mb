import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
		baseUrl: 'http://localhost:4173',
		video: false, // Disable video record
		responseTimeout: 15000, // Improves runtime
		testIsolation: false // Preserve cookies
	}
})
