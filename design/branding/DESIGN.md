---
name: Organic Wayfinder
colors:
  surface: '#fff8f6'
  surface-dim: '#e5d7d4'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ee'
  surface-container: '#f9ebe8'
  surface-container-high: '#f3e5e2'
  surface-container-highest: '#ede0dd'
  on-surface: '#211a19'
  on-surface-variant: '#534340'
  inverse-surface: '#362f2d'
  inverse-on-surface: '#fceeeb'
  outline: '#86736f'
  outline-variant: '#d8c2bd'
  surface-tint: '#8d4c3f'
  primary: '#6f3429'
  on-primary: '#ffffff'
  primary-container: '#8c4b3e'
  on-primary-container: '#ffcbc0'
  inverse-primary: '#ffb4a5'
  secondary: '#55624c'
  on-secondary: '#ffffff'
  secondary-container: '#d6e4c8'
  on-secondary-container: '#5a6750'
  tertiary: '#005040'
  on-tertiary: '#ffffff'
  tertiary-container: '#196957'
  on-tertiary-container: '#9be5cf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a5'
  on-primary-fixed: '#390b04'
  on-primary-fixed-variant: '#71352a'
  secondary-fixed: '#d9e7cb'
  secondary-fixed-dim: '#bdcbb0'
  on-secondary-fixed: '#131e0d'
  on-secondary-fixed-variant: '#3e4a35'
  tertiary-fixed: '#a7f1da'
  tertiary-fixed-dim: '#8bd5be'
  on-tertiary-fixed: '#002019'
  on-tertiary-fixed-variant: '#005141'
  background: '#fff8f6'
  on-background: '#211a19'
  surface-variant: '#ede0dd'
  sand: '#F5F2ED'
  charcoal: '#2D2D2D'
  moss-light: '#B2D2C2'
  clay-muted: '#A67B6B'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lead:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  quote:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1120px
  gutter: 24px
  margin-mobile: 16px
  section-gap: 120px
---

## Brand & Style

This design system is built to evoke the feeling of a guided journey—a "pathway" through personal and professional transformation. It balances the clinical authority of a licensed psychologist with the warmth of a nature-based somatic practice. 

The aesthetic is **Modern Minimalist with Tactile influences**. It prioritizes generous whitespace and high-quality photography to create a "breathable" interface. Design elements should feel organic rather than industrial; this is achieved through soft geometry, subtle paper-like textures, and a layout that avoids rigid, boxed-in structures in favor of flowing transitions. The emotional response is one of calm, clarity, and empowerment.

## Colors

The palette is grounded in the earth. **Terracotta (Primary)** serves as the "path" color, used for primary actions and highlights that signal progress. **Soft Moss Green (Secondary)** and **Warm Sand** provide the environmental backdrop, ensuring the UI feels connected to nature. 

**Deep Charcoal** is reserved for typography to maintain high accessibility contrast without the harshness of pure black. Functional backgrounds should primarily use the "Sand" neutral to keep the experience warm and inviting. Tonal variations of Moss are used for supportive UI elements like success states or secondary buttons.

## Typography

The typographic strategy pairs **Libre Caslon Text** for headings—to convey wisdom, tradition, and care—with **Hanken Grotesk** for body and UI labels to ensure modern clarity.

- **Display & Headlines:** Use Libre Caslon Text. For large hero sections, use tighter letter spacing to create a distinctive, editorial feel.
- **Body Text:** Hanken Grotesk is set with a generous line height (1.6) to improve readability and maintain the "airy" feel of the brand.
- **Quotes:** Testimonials are a critical part of the narrative; they use a larger, italicized serif style to stand out as personal voices.
- **Labels:** Use uppercase Hanken Grotesk with increased letter spacing for small metadata or section markers.

## Layout & Spacing

The design system utilizes a **12-column fixed grid** for desktop, centered within a maximum width of 1120px to prevent lines of text from becoming too long for comfortable reading. 

Vertical spacing is intentionally "breathable." **Section gaps** are large (120px) to give each coaching pillar room to exist as its own chapter. On mobile, margins reduce to 16px, and section gaps compress to 64px. Layouts should utilize asymmetrical whitespace—placing imagery slightly off-center—to mimic the organic patterns found in nature.

## Elevation & Depth

This system avoids traditional shadows to maintain a grounded, "flat" earthy feel. Instead, depth is communicated through:
- **Tonal Layering:** Using different shades of "Sand" and "Moss" to stack content.
- **Soft Outlines:** Elements like cards or input fields use low-contrast, 1px borders in a slightly darker earth tone rather than shadows.
- **Subtle Textures:** A grain or "paper" texture is applied to the base background layer to give the digital surface a tactile, physical quality.
- **Photography Depth:** High-quality landscape photography with natural depth of field serves as the primary visual "window" into the brand’s transformative space.

## Shapes

Shapes in this design system follow an **Organic Rounded** logic. Hard corners are avoided to ensure the UI feels approachable and safe. 

- **Containers & Cards:** Use a 16px (1rem) radius.
- **Buttons:** Use a fully rounded "pill" shape to contrast against the more structured content blocks.
- **Image Masks:** Occasionally use organic, non-perfect circular masks or "pebble" shapes for headshots to reinforce the nature-based Somatic theme.

## Components

### Buttons & CTAs
Primary buttons are pill-shaped, using the Terracotta background with white text. Secondary buttons use a Moss-light background with Charcoal text. Hover states should involve a subtle shift in saturation rather than brightness.

### Cards
Cards (used for Program descriptions) should have no background color (transparent) or a very light tonal shift from the page background. They are defined by a 1px soft clay-muted border and generous 40px internal padding.

### Input Fields
Inputs are simple, rounded lines or soft boxes. The focus state replaces the soft border with a thicker Terracotta underline to guide the user's attention.

### Progress Indicators
For the "Way Finding" journey, use a custom "Path" indicator—a thin, meandering dashed line that connects different sections of a page, serving as a literal and metaphorical guide.

### Testimonials
These are styled as "floating" quotes with no container, using the Libre Caslon serif in a larger size, centered, to act as a moment of reflection between informational sections.