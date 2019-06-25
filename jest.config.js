module.exports = {
    "roots": [
        "./test"
    ],
    "transform": {
        "^.+\\.ts?$": "ts-jest"
    },
    "testResultsProcessor": "jest-sonar-reporter"
}