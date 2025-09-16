# Astro Table of Contents - Documentation Website

This is the official documentation website for the **Astro Table of Contents** package, a complete integration for Astro that automatically generates table of contents (TOC) for your web pages.

## 🌐 Live Demo

Visit the live documentation: [https://toc-cloudflare-test.pages.dev/](https://toc-cloudflare-test.pages.dev/)

## 📁 Project Structure

```
website/
├── src/
│   ├── index.html              # Homepage with project overview
│   ├── css/
│   │   └── styles.css          # Modern CSS styling with responsive design
│   ├── js/
│   │   └── main.js             # Interactive functionality (tabs, copy buttons, etc.)
│   └── docs/
│       ├── getting-started.html # Installation and setup guide
│       └── api-reference.html   # Complete API documentation
├── package.json                # Website dependencies
└── README.md                   # This file
```

## 🚀 Features

### Homepage (`index.html`)
- **Hero Section**: Eye-catching introduction with call-to-action buttons
- **Features Grid**: Showcase of key package features
- **Quick Example**: Step-by-step code examples
- **Project Stats**: Version, license, and compatibility information
- **Responsive Design**: Mobile-first approach with modern CSS Grid

### Getting Started Guide (`docs/getting-started.html`)
- **Installation Instructions**: Support for npm, pnpm, and yarn
- **Configuration Guide**: Complete Astro integration setup
- **Usage Examples**: Real-world implementation examples
- **Troubleshooting**: Common issues and solutions
- **Advanced Usage**: Custom styling and programmatic generation

### API Reference (`docs/api-reference.html`)
- **Complete API Documentation**: All functions, types, and interfaces
- **Code Examples**: Practical usage examples for each API method
- **Type Definitions**: Full TypeScript interface documentation
- **CSS Classes**: Styling customization guide
- **Package Exports**: Import paths and module structure

## 🎨 Design Features

### Modern UI/UX
- **Gradient Headers**: Beautiful purple-to-blue gradients
- **Card-based Layout**: Clean, organized content sections
- **Interactive Elements**: Hover effects and smooth transitions
- **Code Syntax Highlighting**: Dark theme code blocks with copy functionality
- **Responsive Tables**: Mobile-friendly API documentation

### Interactive Functionality
- **Tab Navigation**: Switch between package managers (npm/pnpm/yarn)
- **Copy to Clipboard**: One-click code copying
- **Smooth Scrolling**: Enhanced navigation experience
- **Loading States**: Visual feedback for external links
- **Intersection Observer**: Fade-in animations for content sections

## 🛠️ Development

### Local Development
1. Open `index.html` in your browser
2. Use a local server for best experience:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

### File Organization
- **HTML Files**: Semantic structure with accessibility in mind
- **CSS**: Modern features (Grid, Flexbox, Custom Properties)
- **JavaScript**: ES6+ with progressive enhancement
- **Assets**: Optimized for performance and SEO

## 📊 Technology Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern features including Grid, Flexbox, and animations
- **Vanilla JavaScript**: No framework dependencies, lightweight and fast
- **Progressive Enhancement**: Works without JavaScript enabled

## 🔧 Customization

### Styling
The CSS is organized into logical sections:
- Reset and base styles
- Header and navigation
- Component styles (buttons, cards, tables)
- Responsive breakpoints
- Animations and transitions

### Content Updates
To update documentation:
1. Edit the relevant HTML files in `/src/`
2. Update code examples to match the latest package version
3. Ensure all links and references are current

## 📱 Responsive Design

The website is fully responsive with breakpoints for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

### Mobile Features
- Collapsible navigation
- Optimized touch targets
- Readable typography scaling
- Simplified layouts

## ♿ Accessibility

- **ARIA Labels**: Proper labeling for interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Focus States**: Visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and structure

## 🚀 Performance

- **Lightweight**: No external dependencies
- **Optimized Images**: Compressed and properly sized
- **Minified Assets**: Production-ready CSS and JS
- **Fast Loading**: Optimized for Core Web Vitals

---

Built with ❤️ for the Astro community by Stron

## Contributing

Contributions are welcome! If you have suggestions for improvements or find bugs, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.