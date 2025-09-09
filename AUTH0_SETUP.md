# Auth0 Setup Instructions for CBL Maikosh UAT

## Manual Auth0 Configuration Required

Since Auth0 requires web console configuration, please follow these steps:

### 1. Create Auth0 Account/Tenant
1. Go to https://auth0.com and sign up or login
2. Create a new tenant named `cbl-maikosh` (or use existing)

### 2. Create Application
1. Go to Applications > Create Application
2. Name: `CBL Maikosh UAT`
3. Type: `Regular Web Application`
4. Click Create

### 3. Configure Application Settings
In the Application Settings tab, configure:

**Allowed Callback URLs:**
```
http://localhost:8080/api/auth/callback
```

**Allowed Logout URLs:**
```
http://localhost:8080
```

**Allowed Web Origins:**
```
http://localhost:8080
```

### 4. Copy Credentials
From the Application Settings, copy these values:

- **Domain**: (e.g., `cbl-maikosh.auth0.com`)
- **Client ID**: (e.g., `xxxxxxxxxxxxxxxxxxxxxxxxx`)
- **Client Secret**: (e.g., `xxxxxxxxxxxxxxxxxxxxxxxxx`)

### 5. Update .env.local
Replace the Auth0 placeholders in .env.local with:

```env
AUTH0_SECRET=LpcP2LIGuYU2oBy98N6b2FxaOM8X/xGFj8AY/XCmesY=
AUTH0_BASE_URL=http://localhost:8080
AUTH0_ISSUER_BASE_URL=https://[YOUR-TENANT].auth0.com
AUTH0_CLIENT_ID=[YOUR-CLIENT-ID]
AUTH0_CLIENT_SECRET=[YOUR-CLIENT-SECRET]
```

### 6. Create Test Users
In Auth0 Dashboard > User Management > Users, create:

1. **aspiring_coach@test.com** (password: TestUser123!)
   - Role: user
   - Metadata: { "userType": "newCoach" }

2. **experienced_coach@test.com** (password: TestUser123!)
   - Role: user
   - Metadata: { "userType": "experiencedCoach" }

3. **admin@maba.org** (password: AdminUser123!)
   - Role: admin
   - Metadata: { "userType": "admin", "isAdmin": true }

4. **mobile_coach@test.com** (password: TestUser123!)
   - Role: user
   - Metadata: { "userType": "mobileCoach" }

5. **verifier@school.edu** (password: TestUser123!)
   - Role: viewer
   - Metadata: { "userType": "verifier" }

### 7. Enable Username-Password Authentication
1. Go to Authentication > Database
2. Ensure "Username-Password-Authentication" is enabled
3. Click on it and verify "Requires Username" is OFF

### 8. Set Up Roles (Optional)
1. Go to User Management > Roles
2. Create roles: `admin`, `user`, `viewer`
3. Assign appropriate permissions

## Next Steps
Once Auth0 is configured:
1. Update .env.local with your Auth0 credentials
2. Restart the UAT server
3. Test authentication flow

## Testing
Visit http://localhost:8080 and try logging in with test users.