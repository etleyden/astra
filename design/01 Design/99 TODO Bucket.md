This document serves as a source for all ideas for features, functionality, etc. This also includes anything where I thought "yeah I should probably do that, but let me focus on my current task".

* DB Triggers to enforce normalization
	* Users -> Accounts -> Transaction, but we included users in transactions to reduce the read times lolz so we should add some triggers to enforce this normalization. Generated suggestion:
```sql
CREATE FUNCTION enforce_user_id_match() RETURNS trigger AS $$
BEGIN
  IF NEW.user_id != (SELECT user_id FROM accounts WHERE id = NEW.account_id) THEN
    RAISE EXCEPTION 'user_id does not match account owner';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_user_id_before_insert
BEFORE INSERT OR UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION enforce_user_id_match();
```
* 