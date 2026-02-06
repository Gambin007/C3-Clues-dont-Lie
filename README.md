# C³ Studio - Next.js Landing Page

A modern, dark-themed landing page for C³ Studio creative agency built with Next.js 14, App Router, and TailwindCSS.

## Color Palette

The design uses the exact logo colors:
- **#FE4A2C** - Red/Orange
- **#FFC32E** - Yellow/Orange  
- **#00C4FF** - Cyan/Blue

## Project Structure

```
app/
  layout.jsx          # Root layout with metadata and Bungee font
  page.jsx            # Home page
  globals.css         # Global styles and Tailwind directives
components/
  Navbar.jsx          # Sticky navigation with logo
  Hero.jsx            # Full-screen hero with animated shapes
  Projects.jsx        # Single large project card
  Team.jsx            # Team grid (6 members)
  Contact.jsx         # Contact CTA section
public/
  media/
    logo.svg          # C³ Studio logo
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

## Features

- **Next.js 14** with App Router
- **Bungee font** for h1 headings
- **Dark theme** with pure black backgrounds (#000000)
- **Animated background shapes** using logo colors (brighter opacity)
- **Gradient buttons** with logo color palette
- **Smooth scroll** navigation
- **Responsive design** (mobile-first)
- **Hover effects** with color transitions
- **Border glow gradients** matching logo colors
- **Modern, minimal design** with large typography

## Sections

1. **Navbar** - Sticky navigation with logo from `/media/logo.svg`, smooth scroll links
2. **Hero** - Full viewport hero with animated background shapes in logo colors
3. **Projects** - Single large project card with gradient border
4. **Team** - 6 team members (Sara, Thalia, Larissa, Noé, Philippe, Marco)
5. **Contact** - CTA section with gradient button

## Tech Stack

- Next.js 14
- React 18
- TailwindCSS 3
- PostCSS
- Autoprefixer
# C
