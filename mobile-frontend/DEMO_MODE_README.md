# Demo Mode for App Store Review

This branch includes a demo mode feature specifically designed for App Store review process.

## Demo Account Credentials

To access the demo mode, use the following credentials:

- **Country Code**: United States (+1)
- **Phone Number**: 9999999999
- **Password**: demo123

## Features in Demo Mode

1. **Offline Operation**: All features work completely offline without server connection
2. **Sample Data**: Pre-populated with demo students and messages
3. **Read/Unread Toggle**: Reviewers can toggle message read status in the message detail screen
4. **Full App Experience**: All UI/UX features are accessible

## Demo Data Includes

### Students
- 山田 太郎 (Student ID: S2024001)
- 佐藤 花子 (Student ID: S2024002)

### Messages
- School announcements
- Homework notifications
- Health office notices
- Club activity updates
- Tuition payment reminders
- Field trip information

## How Demo Mode Works

1. When logging in with the demo credentials, the app:
   - Bypasses API authentication
   - Loads sample data into local SQLite database
   - Operates entirely offline

2. In message detail view (demo mode only):
   - A "Mark as Read/Unread" button appears
   - Allows testing of read status functionality

3. All other features work as in production:
   - Multi-language support (English, Japanese, Uzbek)
   - Theme switching (Light/Dark mode)
   - Push notification settings (UI only in demo)

## Building for Review

```bash
# Install dependencies
npm install

# Build for iOS
eas build --platform ios --profile preview

# Build for Android
eas build --platform android --profile preview
```

## Disabling Demo Mode

Demo mode is only activated with the specific credentials above. Regular users cannot access demo mode.

## Technical Implementation

- Demo mode detection in `auth-context.tsx`
- Demo data initialization in `demo-data.ts`
- API bypass logic in data fetching components
- Read/unread toggle in message detail screen (demo only)

## Important Notes

- Demo mode flag is stored in AsyncStorage
- Logging out clears demo mode
- No real data is affected by demo mode operations
- All demo data has IDs prefixed with "demo-" for easy identification