<img width="912" height="341" alt="screenshot_1760122902" src="https://github.com/user-attachments/assets/1ec2937d-2973-45ac-acdc-a31e0c88bcc4" />

# Astro Table of Contents

A complete integration for Astro that automatically generates table of contents (TOC) for your web pages. This package provides an elegant and customizable solution to improve content navigation in your Astro projects.

live example: [astro-toc-example](https://example-cf-toc.stron.dev/)

## 🚀 Features

- **Automatic generation**: Automatically detects headings (`h1`, `h2`, `h3`, etc.) in your HTML content
- **Native Astro integration**: Seamlessly integrates with Astro's integration system
- **Astro component included**: Ready-to-use `<TableOfContents>` component
- **Highly customizable**: Configure title, position, maximum and minimum depth
- **Interactive interface**: Collapsible TOC with smooth animations
- **Full TypeScript**: Fully typed for better development experience
- **Integrated middleware**: Automatic processing during build
- **Responsive**: Adapts to different screen sizes

## 📦 Installation

```bash
npm i astro-table-of-contents
# or
pnpm add astro-table-of-contents
# or
yarn astro-table-of-contents
```

## 🛠️ Usage

### 1. Configure the integration

In your `astro.config.mjs` file:

```javascript
import { defineConfig } from 'astro/config';
import { tableOfContents } from 'astro-table-of-contents';

export default defineConfig({
    integrations: [
        tableOfContents({
            title: 'Contents', // default title
        }),
    ],
});
```

### 2. Use the component in your pages

```astro
---
import TableOfContents from 'astro-table-of-contents/component';


---

<html>
  <head>
    <title>My page with TOC</title>
  </head>
  <body>
    <main>
      <TableOfContents title="Index" backgroundColor="#f5f5f5" class="bg-red" />
      <h1>Main Title</h1>
      <p>Content...</p>

      <h2>Section 1</h2>
      <p>More content...</p>

      <h3>Subsection 1.1</h3>
      <p>Nested content...</p>
    </main>
  </body>
</html>
```

## ⚙️ Configuration

### TableOfContents component props

```typescript
interface Props {
    title?: string; // Custom title for this TOC
    backgroundColor?: string; // Custom background color
}
```

## 🔧 Advanced API

### Manual TOC generation

```typescript
import { generateToc } from 'astro-table-of-contents';

const htmlContent = `
  <h1>Title</h1>
  <h2>Subtitle</h2>
  <h3>Sub-subtitle</h3>
`;

const tocHtml = generateToc({ content: htmlContent });
console.log(tocHtml);
```

### Using custom templates

```typescript
import { tocItemTemplate, tocContainerTemplate, nestedListTemplate } from 'astro-table-of-contents';

// Customize HTML structure
const customToc = tocContainerTemplate(nestedListTemplate(tocItemTemplate('my-id', 'My Title')));
```

## 📝 License

This project is licensed under the ISC License. See the `LICENSE` file for details.

## 🏷️ Keywords

- astro-component
- withastro
- toc
- table-of-contents
- astro integration
- navigation
- content organization
- typescript

---

Built with Stron ❤️ for the Astro community
