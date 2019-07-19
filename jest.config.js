module.exports = {
    "roots": [
        "./test",
        "./src",
    ],
    "transform": {
        "^.+\\.ts?$": "ts-jest"
    },
    "testResultsProcessor": "jest-sonar-reporter"
}