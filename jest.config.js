const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  
  // ⬇️ THIS IS THE CRITICAL PART FOR YOUR STRUCTURE ⬇️
  moduleNameMapper: {
    // This regex says: "Replace @/ with the Project Root Directory"
    '^@/(.*)$': '<rootDir>/$1',
  },
}

module.exports = createJestConfig(customJestConfig)