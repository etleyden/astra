This document serves as a source for all ideas for features, functionality, etc. This also includes anything where I thought "yeah I should probably do that, but let me focus on my current task".

## Database, Type or Value Enforcement
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
* Enforcing constraints on database fields. 
	* It is possible to enforce constraints on database fields such as "The Account's bank field must be a Vendor with is_bank = true". This is optimally done with both DB triggers, and application level enforcement (i.e. checking that the condition is true BEFORE insertion). These should be enforced for the following fields:
		* Account bank must be a vendor with is_bank = true
		* Goal has several of these constraints:
			* start_date must be populated if interval is populated
			* end_date must be populated if is_recurring is false
			* is_recurring can only be true for "save" or "aggregate"
			* interval must be populated is_recurring is true
* Implementing User Roles
	* Users should have different roles which will be used to inform their experience on the app. For example an Admin user will have special admin site controls, but Standard or Premium will only be able to use the app normally. (Premium obviously having paid features)
	* Idea for admin users: be able to create discount codes that can give users premium accounts for some amount of time
* Handling when "vendor" is null for a transaction
	* User will not be able to view aggregate information about the vendor, nor be able to find things like vendor contact info, etc.
* Nested vendors
	* If a user views a transaction and wants to dispute it, they may want to call the vendor. Many companies have multiple locations which may be uniquely identifiable by the description string. We could point to a parent "Vendor" and be able to find general company information as well as location specific information (What's the phone number for the Food Lion on Main St.?)
* Enforce monetary types with a typescript class or type
	* Should only have two decimal places.. I think that's it?
	* Currently this would be used in Goal.amount and Transaction.amount, and later on probably in the application logic
* ON_DELETE and ON_UPDATE CASCADE where appropriate (right now this is not done at all)
	* Specify date types in TypeORM definitions
* API and UI should get ports and HTTPS certificates from environment variables, not static/hard-coded values.
	* This is fine for development, but once we are moving towards deployment this needs to be dynamic based on the build environment
* Start designing tests. Easiest one to start with is linting checks with ESLint

## Workspace Quality of Life
* Isolate a DB refresh in the development environment
	* I want to be able to just refresh the database without having to rebuild the entire application
* Consistency in directory structure between packages
	* There is an inconsistency in directory structure for each package where some contain all of their code within a single src/ subdirectory, and others keep the code at the root of the package. I prefer the second option because the monorepo structure is already so deeply nested and complex that it's cumbersome to navigate the project. The only package that needs a src folder is the ui package, because it will also contain code in the root of the package intended for use by the build results.
* Make a better watch command. Right now we just run `npm run watch` concurrently in each package, but there are tools out there that would allow us to have a singular watch that can streamline this to be more efficient. Check out [Turbo?](https://turborepo.com/)