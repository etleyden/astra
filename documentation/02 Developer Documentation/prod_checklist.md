# Production Environment Launch Checklist

- UserLogin in shared types should have a tested @IsStrongPassword() decorator on the password field.
- Configure separate environment variables that are automatically loaded in
    - DB creds
    - JWT secrets
    - NODE_ENV=production