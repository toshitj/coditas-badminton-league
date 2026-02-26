# Coditas Badminton League

A modern, full-stack tournament management website built with Next.js 14, featuring a dark theme with neon accents, smooth animations, and Google Sheets integration for backend data management.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

### 🎯 Core Functionality
- **Team Registration**: Complete registration form with validation
- **Team Management**: View all registered teams with detailed information
- **Responsive Design**: Mobile-first approach with glassmorphism UI
- **Smooth Animations**: Framer Motion powered transitions and effects

### 🎨 Design Features
- Dark theme with neon accents (electric blue/green)
- Glassmorphism cards with backdrop blur
- Animated badminton shuttle SVG
- Interactive team reveal modal with confetti
- Premium, minimal UI design

### 📱 Pages
- **Overview**: Tournament information and statistics
- **Registration**: Multi-step registration form with payment integration
- **Registered Teams**: Grid layout of all teams with expandable details

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI** components
- **Framer Motion** for animations
- **React Hook Form** + **Zod** for validation
- **Axios** for API calls
- **Canvas Confetti** for celebrations

### Backend
- **Google Apps Script** (Web App)
- **Google Sheets** (Database)

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Google account for backend setup

### Installation

1. **Clone or extract the project**

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create or update `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

4. **Set up Google Apps Script backend**

Follow the detailed guide in `google-apps-script/README.md`:
- Create a Google Sheet
- Copy the Apps Script code
- Deploy as Web App
- Copy the deployment URL to `.env.local`

5. **Add payment QR code**

Replace `public/qr-code.png` with your actual payment QR code image.

6. **Run the development server**
```bash
npm run dev
```

7. **Open in browser**
```
http://localhost:3000
```

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with navbar
│   ├── page.tsx                # Overview page
│   ├── registration/
│   │   └── page.tsx            # Registration form
│   ├── teams/
│   │   └── page.tsx            # Registered teams
│   └── globals.css             # Global styles
├── components/
│   ├── Navbar.tsx              # Navigation bar
│   ├── TeamCard.tsx            # Team display card
│   ├── TeamRevealModal.tsx     # Registration success modal
│   └── ui/                     # Shadcn UI components
├── lib/
│   ├── api.ts                  # API integration layer
│   └── utils.ts                # Utility functions
├── google-apps-script/
│   ├── Code.gs                 # Backend script
│   └── README.md               # Backend setup guide
├── public/
│   └── qr-code.png             # Payment QR code
└── README.md
```

## Configuration

### Tailwind Configuration

Custom colors defined in `tailwind.config.ts`:
```typescript
neon: {
  blue: "#00D9FF",
  green: "#00FF94",
}
```

### Validation Rules

Registration form validation (via Zod):
- All fields required
- Email validation for all 4 players
- Transaction ID minimum 5 characters
- Payment proof: PNG, JPG, JPEG only (max 5MB)

## API Endpoints

### POST `/` (Registration)
Register a new team

**Request Body:**
```json
{
  "male1Name": "string",
  "male1Email": "string",
  "male2Name": "string",
  "male2Email": "string",
  "female1Name": "string",
  "female1Email": "string",
  "female2Name": "string",
  "female2Email": "string",
  "transactionId": "string",
  "paymentProofUrl": "string"
}
```

**Response:**
```json
{
  "success": true,
  "teamName": "Smashers",
  "message": "Registration successful!"
}
```

### GET `/?action=getTeams`
Fetch all registered teams

**Response:**
```json
[
  {
    "teamName": "Smashers",
    "players": {
      "male1Name": "John Doe",
      "male1Email": "john@example.com",
      ...
    },
    "transactionId": "TXN123456"
  }
]
```

## Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Backend (Google Apps Script)
Already deployed as Web App - URL never changes even when updating code.

## Features Breakdown

### Registration Flow
1. User fills registration form
2. Frontend validates all fields
3. Payment proof is uploaded
4. Data sent to Google Apps Script
5. Script assigns next available team name
6. Team name revealed with confetti animation

### Team Management
- All registered teams displayed in grid
- Click to expand and view full details
- Shows all 4 players with emails
- Displays transaction ID

## Customization

### Change Neon Colors
Edit `tailwind.config.ts`:
```typescript
neon: {
  blue: "#YOUR_COLOR",
  green: "#YOUR_COLOR",
}
```

### Add More Team Names
Edit `google-apps-script/Code.gs` in the `initializeTeamNames()` function.

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance
- Optimized images with Next.js Image component
- Lazy loading for heavy components
- Efficient animations with Framer Motion
- Minimal bundle size with tree-shaking

## Troubleshooting

### Registration form not submitting
- Check if API URL is correctly set in `.env.local`
- Verify Google Apps Script deployment is active
- Check browser console for errors

### Animations not smooth
- Check if hardware acceleration is enabled in browser
- Reduce animation complexity on low-end devices
- Ensure no other heavy processes are running

## Future Enhancements
- Live score updates
- Match results tracking
- Tournament bracket visualization
- Player statistics dashboard
- Email notifications
- WhatsApp integration
- Admin panel for manual updates

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License
This project is licensed under the MIT License.

## Support
For issues or questions:
- Check the documentation
- Review Google Apps Script setup guide
- Check browser console for errors
- Verify all environment variables are set

## Acknowledgments
- Built with Next.js 14 and TypeScript
- UI components from Shadcn UI
- Animations powered by Framer Motion
- Backend powered by Google Apps Script

---

**Made with ❤️ for Coditas Badminton League**
