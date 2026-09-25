# Rasulpur Madrasa

## About

Rasulpur Madrasa is a community-focused project for organizing and sharing information about the madrasa.

## Project goals

- Keep madrasa information clear and accessible
- Support future improvements through collaborative development
- Maintain a simple, welcoming project repository

## Included modules

- Admin authentication with email/password and Google sign-in
- Student and teacher records
- Class routine management
- Notices and global search
- Responsive Bengali-language dashboard

## Local preview

This is a browser-based application. For local development, serve the repository with any static web server instead of opening `index.html` directly:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in a browser. Firebase authentication and Firestore must be configured for sign-in and data features to work.

## Before deploying

- Confirm Firebase Authentication providers are configured
- Review Firestore security rules
- Test login, student, teacher, routine, and notice flows
- Verify the site on both mobile and desktop screens

## Contributing

1. Create a feature branch from `main`.
2. Make a focused change and explain it in the commit message.
3. Open a pull request for review.
4. Merge only after the change is ready.
