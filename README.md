IT3040 – ITPM Semester 1: Assignment 1

Singlish to Sinhala Transliteration Automated Testing

1. Project Overview

This project contains automated functional and UI test cases for the web application Swift Translator
, which converts Singlish input into Sinhala output. The main objectives of this project are:

To test the accuracy of Singlish-to-Sinhala transliteration for a variety of sentence structures, lengths, and contexts.

To test the robustness of the system under mixed-language input, typos, slang, and formatting variations.

To verify UI behavior, specifically real-time conversion and input handling.

All test cases were implemented using Playwright and cover positive and negative scenarios, including at least 24 correct conversions and 10 incorrect/misbehaving cases.

2. Repository Structure
IT3040_Assignment1/
│
├─ tests/                   # Playwright test scripts
│   ├─ pos_fun/             # Positive functional test scripts
│   ├─ neg_fun/             # Negative functional test scripts
│   ├─ pos_ui/              # Positive UI test scripts
│   └─ neg_ui/              # Negative UI test scripts
│
├─ results/                 # Test execution reports (HTML/JSON)
│
├─ playwright.config.ts     # Playwright configuration file
├─ package.json             # Node project dependencies
├─ package-lock.json        # Node project lock file
├─ README.md                # Project documentation (this file)
└─ TestCases_IT3040.xlsx    # Test case documentation and results

3. Prerequisites

Ensure the following are installed on your system:

Node.js (version 18 or above) – Download Node.js

npm (comes with Node.js)

A modern browser (Chromium, Firefox, or WebKit)

4. Installation

Clone the repository:

git clone <your-public-git-repo-link>


Navigate to the project folder:

cd IT3040_Assignment1


Install the project dependencies:

npm install


Install Playwright browsers:

npx playwright install

5. Running the Tests

Run all tests:

npx playwright test


Run a specific test file:

npx playwright test tests/pos_fun/Pos_Fun_0001.spec.ts


Generate HTML report:

npx playwright show-report

6. Test Coverage

Functional Tests: Verify correctness of Singlish-to-Sinhala conversion.

Simple, compound, and complex sentences

Interrogative (questions) and imperative (commands) forms

Positive/negative sentence forms

Mixed language and slang

Tense variations, pronouns, plural forms

UI Tests: Verify usability and interface behavior.

Real-time output updates

Input clearing, formatting preservation

Edge Cases & Negative Tests:

Joined vs segmented words

Repeated word expressions

Incorrect or unusual inputs

7. Test Execution Reporting

The results of each test case are recorded in TestCases_IT3040.xlsx with the following details:

Test Case ID

Input / Expected Output / Actual Output

Status (Pass/Fail)

Quality Focus & Accuracy Justification

Playwright also generates an HTML report in the results/ folder for detailed analysis.

8. Notes

This project does not test backend performance or security, only functional and UI aspects.

Automated tests are written for browser-based verification and rely on the website being accessible.

Ensure a stable internet connection when running the tests.
