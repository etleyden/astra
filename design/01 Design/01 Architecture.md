## Tech Stack
**Front-End:** Typescript, Tailwind, Daisy UI?
**Back-End:** Express, TypeORM
**DB:** PostgreSQL
**Data Processing:** Python/Pandas/Sci-kit learn or PyTorch depending on needs
**Testing: ** 

## Data-Flow Model
The below diagram describes how data will move through the application. 
![[Data Flow Model.svg]]
## Database Schema
There is a hand-drawn diagram in the diagrams folder, and some notes on the Goals Entity in another document, but here is the initial schema design as rendered from Postgres:
![[Pasted image 20250705105136.png]]

## Codebase Structure
### API Layer
The package for the API Endpoints will look something like the following: 
```
/api
|-app.ts
|-/routes
  |-index.ts
  |-EntityApi.ts
  |...
  |-OtherApi.ts
```
Each `xxApi.ts` file will contain logic that acts as a thin routing adapter between the logic contained in `/controllers` and the web. Each of those files should contain closely related logic, but also not be so granular as to be cumbersome. Generally, each Entity in the application should get it's own file containing CRUD & auxiliary operations, and when this becomes unwieldy, those operations should be modularized further/as needed. 
### Controller Layer
The controller package will look like the following: 
```
/controllers
|...
```
Each `xxController.ts` file will contain logic that serves to provide all the necessary functionality for a given application Entity, and may need to be broken down further as the project matures. This may include CRUD or other operations, and perhaps not all methods in a controller are exposed to the API as it's own endpoint, or even exposed at all (defined as private to just that controller).