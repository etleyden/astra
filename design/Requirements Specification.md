## Overview
**Primary objective:** To create a powerful finance app that minimizes user effort, and optimizes the delivery of financial summaries so the user can make smarter, well-informed choices. 
**Target Users:** Young teens/adults in high school/college learning how to manage money for the first time. Or adults who really need to manage every penny with exacting detail. 
## Core Use Cases
* As a user, I want to import data from my bank, credit card company, or other lenders so that I can use it in the analysis of my financial situation
* As a user, I want to set informed goals for myself so that I can have better financial health.
* As a user, I want to be able to see a breakdown of where my money is going in a hierarchical fashion, to assist in my understanding of my current situation
## Functional Requirements
### User Authentication
1. Users can register/login with their email/password, Google Account, or Apple Account
2. Users can reset their password via email
3. The system will use MFA to protect user privacy
4. \[knowledge gap\]
### Data Management
1. Users can import data from their bank, ideally via Plaid, but MVP at least by CSV
2. Users can track the amount of money in their accounts
3. Users can track how much money has been spent
4. Users can track their income
### Categorization of Transactions
1. Users can categorize transactions quickly and easily.
2. Automatic categorization of transactions is optimized for accuracy, allowing for minimal user intervention. 
### Budgeting
1. Users can create budgeting goals that follow the format *I want to **\[save, invest, pay off]** my **\[account or amount\]** by **\[deadline or interval\]**
2. Users can track their progress towards their budgeting goals
3. Users can create a budget plan that divides their projected income into their categories to represent a plan for spending and saving
## Non-Functional Requirements
1. The interface must be responsive and scaleable to both desktop and mobile devices.
2. Page load times should be less than 500ms, regardless of what is on the page. 
3. 
## Model the Domain
Users, Accounts, Transactions, Categories, Budgets, etc. 
