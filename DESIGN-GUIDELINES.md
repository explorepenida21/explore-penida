# Explore Penida - Design & UI Guidelines

## Design Philosophy

**Karakter:** Luxury Beach / Island Vibes - bukan budget travel, tapi premium experience.

**Visual Reference:** [Finns Beach Club](https://finnsbeachclub.com/) - cinematic, full-screen imagery, minimal clutter, generous whitespace.

---

## 🎨 Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Navy Deep | `#0A2A4A` | 10, 42, 74 | Headers, primary text, backgrounds |
| Navy Light | `#1A91B9` | 26, 145, 185 | Links, secondary elements |

### Accent Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Teal/Tosca | `#1ABC9C` | 26, 188, 156 | CTAs, highlights, interactive elements |
| Teal Dark | `#15937D` | 21, 147, 125 | Hover states |

### Highlight Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Gold | `#F1C40F` | 241, 196, 15 | Premium highlights, badges, special offers |
| Gold Light | `#FDE047` | 253, 224, 71 | Hover states |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| Text Primary | `#1A1A2E` | Body text, headings |
| Text Secondary | `#4A5568` | Secondary content |
| Text Muted | `#718096` | Hints, placeholders |
| Background | `#F8FBFF` | Page background |
| White | `#FFFFFF` | Cards, surfaces |

### CSS Variables

```css
:root {
  --color-primary: #0A2A4A;
  --color-primary-light: #1A91B9;
  --color-accent: #1ABC9C;
  --color-accent-dark: #15937D;
  --color-gold: #F1C40F;
  --color-gold-light: #FDE047;
  --color-text: #1A1A2E;
  --color-text-secondary: #4A5568;
  --color-text-muted: #718096;
  --color-light: #F8FBFF;
  --color-white: #FFFFFF;
}
```

---

## 🔤 Typography

### Font Families

**Display/Headings:** `Playfair Display` - Elegan, island-luxury feel
- Used for: H1-H6, hero text, section titles

**Body:** `Plus Jakarta Sans` - Modern, readable
- Used for: Body text, UI elements, descriptions

### Type Scale

| Class | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `display-9xl` | 8rem / 128px | 1 | Hero display |
| `display-8xl` | 6rem / 96px | 1 | Hero main |
| `display-7xl` | 4.5rem / 72px | 1 | Section hero |
| `display-6xl` | 3.75rem / 60px | 1.05 | H1 |
| `display-5xl` | 3rem / 48px | 1.1 | H2 |
| `display-4xl` | 2.25rem / 36px | 1.2 | H3 |
| `display-3xl` | 1.875rem / 30px | 1.2 | H4 |
| `display-2xl` | 1.5rem / 24px | 1.3 | H5 |
| `display-xl` | 1.25rem / 20px | 1.4 | H6 |
| `text-lg` | 1.125rem / 18px | 1.6 | Lead text |
| `text-base` | 1rem / 16px | 1.6 | Body |
| `text-sm` | 0.875rem / 14px | 1.5 | Caption |
| `text-xs` | 0.75rem / 12px | 1.4 | Label |

### Usage Guidelines

```tsx
// Hero Title
<h1 className="font-display text-display-6xl md:text-display-7xl text-white">
  Explore Penida
</h1>

// Section Title
<h2 className="font-display text-display-4xl md:text-display-5xl text-primary">
  Paket Tour Kami
</h2>

// Body Text
<p className="font-body text-lg text-text-secondary leading-relaxed">
  Jelajahi keindahan alam yang menakjubkan...
</p>
```

---

## 📐 Spacing System

### Section Spacing

| Name | Size | Usage |
|------|------|-------|
| `section-padding` | 5rem / 80px | Default section padding |
| `section-padding-sm` | 3rem / 48px | Compact sections |
| `section-padding-lg` | 8rem / 128px | Hero sections |

### Container

- Max width: `7xl` (80rem / 1280px)
- Padding: `px-4 sm:px-6 lg:px-8`

### Component Spacing

| Name | Size | Usage |
|------|------|-------|
| `space-xs` | 0.5rem / 8px | Tight spacing |
| `space-sm` | 1rem / 16px | Component internal |
| `space-md` | 1.5rem / 24px | Between elements |
| `space-lg` | 2rem / 32px | Section elements |
| `space-xl` | 3rem / 48px | Major gaps |
| `space-2xl` | 4rem / 64px | Large separations |

---

## 🧩 Components

### Buttons

#### Primary Button (`btn-primary`)
```tsx
<button className="btn-primary">
  Pesan Sekarang
</button>
```
- Background: Teal (`#1ABC9C`)
- Text: White
- Border radius: Full (pill shape)
- Hover: Darker teal + glow shadow + scale 1.05

#### Secondary Button (`btn-secondary`)
```tsx
<button className="btn-secondary">
  Lihat Detail
</button>
```
- Background: White/10 (glass effect)
- Text: White
- Border: White/30
- Hover: White/20 background

#### Ghost Button (`btn-ghost`)
```tsx
<button className="btn-ghost">
  Learn More
</button>
```
- Background: Transparent
- Text: Teal
- Border: 2px Teal
- Hover: Fill teal background

#### Gold Button (`btn-gold`)
```tsx
<button className="btn-gold">
  Best Seller
</button>
```
- Background: Gold (`#F1C40F`)
- Text: Navy (`#0A2A4A`)
- Hover: Lighter gold + glow

---

### Cards

#### Basic Card (`card`)
```tsx
<div className="card">
  {/* Content */}
</div>
```
- Background: White
- Border radius: `1.5rem` (24px)
- Shadow: Soft (`0 2px 15px -3px rgba(...)`)
- Hover: Lift up 8px + larger shadow

#### Glass Card (`glass`)
```tsx
<div className="glass p-6 rounded-2xl">
  {/* Content */}
</div>
```
- Background: White/10
- Backdrop blur: 12px
- Border: White/20

---

### Badges

```tsx
// Accent Badge
<span className="badge badge-accent">Best Seller</span>

// Gold Badge
<span className="badge badge-gold">Premium</span>

// Primary Badge
<span className="badge badge-primary">New</span>
```

---

### Form Inputs

#### Text Input (`input-field`)
```tsx
<input
  type="text"
  className="input-field"
  placeholder="Masukkan nama lengkap"
/>
```

States:
- Default: Gray-200 border
- Focus: Teal border + ring
- Error: Red border (`input-error`)

---

## 🎬 Animation & Motion

### Parallax Effects (GSAP)

#### Hero Background
```typescript
gsap.to(".hero-bg", {
  yPercent: 40,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1.5
  }
})
```

#### Hero Text Fade
```typescript
gsap.to(".hero-text", {
  yPercent: 60,
  opacity: 0,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "60% top",
    scrub: 1
  }
})
```

### CSS Animations

| Class | Duration | Usage |
|-------|----------|-------|
| `animate-fade-in` | 800ms | Page load |
| `animate-fade-in-up` | 800ms | Slide up reveal |
| `animate-float` | 6s | Floating elements |
| `animate-pulse-soft` | 2s | Subtle pulse |

### Transition Timing

| Name | Duration | Usage |
|------|----------|-------|
| `transition-fast` | 150ms | Micro interactions |
| `transition-base` | 300ms | Default hover |
| `transition-slow` | 500ms | Reveals |
| `transition-slower` | 800ms | Major transitions |

---

## 📱 Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large |

---

## 🌊 Visual Effects

### Gradients

```css
/* Primary gradient */
.bg-navy-gradient {
  background: linear-gradient(135deg, #0A2A4A 0%, #0D3D5F 100%);
}

/* Hero overlay */
.bg-hero-gradient {
  background: linear-gradient(180deg,
    rgba(10, 42, 74, 0.3) 0%,
    rgba(10, 42, 74, 0.1) 40%,
    rgba(10, 42, 74, 0.6) 100%
  );
}

/* Text gradient */
.text-gradient {
  background: linear-gradient(135deg, #1ABC9C 0%, #F1C40F 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Shadows

| Class | Effect |
|-------|--------|
| `shadow-soft` | Subtle, for cards |
| `shadow-medium` | Medium depth |
| `shadow-large` | Deep, for elevated elements |
| `shadow-glow` | Teal glow for CTAs |
| `shadow-gold-glow` | Gold glow for highlights |

### Backdrop Blur

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
}
```

---

## 📋 Do's & Don'ts

### ✅ Do's

1. **Use full-bleed imagery** - Hero sections should be full-screen
2. **Generous whitespace** - Don't crowd elements
3. **Consistent typography** - Use Playfair for headings, Plus Jakarta Sans for body
4. **Teal for CTAs** - Primary actions should use teal accent
5. **Gold for premium** - Highlights, badges, special offers
6. **Cinematic parallax** - Use GSAP for smooth parallax effects

### ❌ Don'ts

1. **Budget aesthetics** - Avoid clipart, cheesy stock photos
2. **Clutter** - Don't add unnecessary elements
3. **Mixed fonts** - Don't mix font families inconsistently
4. **Small text** - Minimum body text: 16px
5. **Harsh colors** - Avoid neon, overly saturated colors

---

## 🎯 Implementation Checklist

- [x] Update Tailwind config with design colors
- [x] Add Google Fonts (Playfair Display, Plus Jakarta Sans)
- [x] Update globals.css with design system
- [x] Create button component classes
- [x] Create card component classes
- [x] Implement cinematic parallax in Hero
- [x] Add animations and transitions
- [ ] Update all pages with new design system
- [ ] Create component library documentation
- [ ] Add dark mode support (future)

---

## 📁 File Structure

```
explore-penida/
├── app/
│   ├── globals.css          # Design system
│   └── layout.tsx
├── components/
│   ├── public/
│   │   ├── HeroParallax.tsx # Cinematic hero
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   └── admin/
├── tailwind.config.ts        # Design tokens
└── DESIGN-GUIDELINES.md      # This file
```

---

## 🔗 Resources

- **Google Fonts:** [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Reference:** [Finns Beach Club](https://finnsbeachclub.com/)
- **Color Palette:** Navy `#0A2A4A` | Teal `#1ABC9C` | Gold `#F1C40F`

---

*Last Updated: June 2026*
*Version: 1.0*