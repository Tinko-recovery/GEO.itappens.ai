# Intelous.ai Multi-Tenant SaaS Architecture Notes

*Note: These are architectural notes saved for when we discuss expanding the platform into a multi-tenant SaaS.*

## 1. Multi-Tenant Organization Context
To support partner companies like intelous.ai alongside itappens.ai within the `/nimda` tool, we need to introduce a **Multi-Tenant Architecture**.
- We can implement an "Organization Switcher" dropdown in the UI.
- The UI will pass the active tenant context (e.g., `Tenant-ID` header) to the backend API requests.

## 2. Role-Based Access Control (RBAC) & Tenant Isolation
Authentication and access control need to enforce strict tenant isolation:
- **User Profiles**: Every user profile will have an assigned `tenant_id` (e.g., `intelous`, `itappens`, or `admin`).
- **UI Rendering**: The dropdown switcher is only visible to Super Admins (like the platform owner). Regular intelous.ai users will never see the dropdown; they will only see the intelous.ai environment and its specific leads.
- **Backend Enforcement**: The backend verifies the user's token on every request. If a user assigned to `intelous` attempts to fetch data belonging to `itappens`, the server will reject it with a `403 Forbidden`, ensuring total data isolation.

## 3. Data Source Abstraction (Adapter Pattern)
Because itappens.ai uses Apollo (REST API) and intelous.ai uses multiple SQL sources, the backend must abstract the data fetching layer using the **Adapter/Provider Pattern**.
- We define a standard `Lead` data structure that the frontend expects.
- **`ApolloAdapter`**: Handles mapping search queries to the Apollo API when the `itappens` context is active.
- **`SQLAdapter`**: Handles mapping search queries to parameterized SQL queries across multiple databases when the `intelous` context is active.
- The frontend remains agnostic to the data source.

## 4. Generic Search
A unified generic search bar can be implemented. 
When a query is entered, the backend reads the active tenant from the request and routes the search to the appropriate adapter (Apollo filters vs. SQL WHERE clauses), returning a unified result set to the UI.
