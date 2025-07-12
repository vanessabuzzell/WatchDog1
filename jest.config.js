// jest.config.js
export default {
    transform: {}, // disables Babel or ts-jest interfering with ESM
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.test.js'],
};
