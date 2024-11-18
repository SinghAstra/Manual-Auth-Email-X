# Project Roadmap

## User Types & Access Levels

### Institute/University Users
- Can add/update their institution's profile.
- Manage placement data for their institution.
- View aggregated placement statistics.

### Corporate Users
- Access student database (with privacy controls).
- Post job opportunities.
- View institution profiles.

### Admin Users
- Verify and approve new institutions/corporations.
- Access to all data and analytics.
- Manage user permissions.

---

## Authentication Flow

### Registration Process
1. Separate registration forms for institutions and corporations.
2. Required documentation upload (e.g., institution licenses, corporate registrations).
3. Email verification.
4. Admin approval before activation.

### Login Process
- Email/password authentication.
- Optional two-factor authentication (2FA).
- "Remember me" functionality.
- Password reset flow.

---

## Security Considerations

### Password Requirements
- Minimum length: 8 characters.
- Mix of:
  - Uppercase and lowercase letters.
  - Numbers.
  - Special characters.
- Password strength indicator.

### Session Management
- Session timeout.
- Limit on maximum concurrent sessions.

### Additional Security Measures
- Rate limiting for login attempts.
- IP-based blocking for suspicious activities.

---

## User Profile Management

### Profile Completion Requirements
- Basic institution/corporate details.
- Contact information.
- Document verification.

### Profile Update Permissions
- Users can update their profiles within their assigned permissions.

### Account Deletion
- Users can request account deletion following data retention policies.

---

## Data Access Controls

### Role-Based Access Control (RBAC)
- Define roles and permissions for each user type.

### Data Visibility Rules
- Ensure data visibility is restricted based on roles and permissions.

### Audit Logging
- Maintain logs for sensitive operations such as:
  - Data updates.
  - Admin approvals.
  - User profile changes.
