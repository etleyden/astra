**Examples of Goals Users can set**
I want to...
SAVE AMOUNT by DATE
SAVE AMOUNT every INTERVAL
get ACCOUNT balance to AMOUNT by DATE
- Checking/Savings UP 
- Credit owed DOWN
SPEND MAX/MIN/AVG AMOUNT \[in CATEGORY\] every INTERVAL

**Generated Table:**
```sql
CREATE TABLE goals (
  guid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(email),
  name TEXT NOT NULL,
  target_amount NUMERIC(12, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  category_id UUID REFERENCES category(guid),
  account_id UUID REFERENCES account(guid),
  goal_target_type TEXT CHECK (
    goal_target_type IN (
      'save_amount', 'spend_max', 'spend_min', 'spend_avg', 'account_balance'
    )
  ) NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  interval TEXT CHECK (interval IN ('monthly', 'weekly', 'yearly')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

| **KEY** | **Name**      | **Description**                                                                           | **Enum**                           |
| ------- | ------------- | ----------------------------------------------------------------------------------------- | ---------------------------------- |
| PK      | guid          |                                                                                           |                                    |
| FK      | user          |                                                                                           |                                    |
|         | type          |                                                                                           | save, balance, aggregate           |
|         | target_amount |                                                                                           |                                    |
| FK      | category      | optional                                                                                  |                                    |
|         | start_date    | the first date on the interval. must be populated if interval is true                     |                                    |
|         | end_date      | MUST be populated if interval is false                                                    |                                    |
|         | date_created  |                                                                                           |                                    |
| FK      | account       | optional (type: any)                                                                      |                                    |
|         | is_recurring  | interval field MUST be populated if this is true. Can only be true for save or aggregate. |                                    |
|         | interval      | Interval may be its own type                                                              | weekly, monthly, quarterly, yearly |
Validate that we can create each of the above goals (and see what other kinds of goals we could create with the above constraints?)