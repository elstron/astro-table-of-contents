#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function findTsFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
      await findTsFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function fixImports() {
  const srcDir = join(__dirname, 'src');
  const tsFiles = await findTsFiles(srcDir);
  
  for (const file of tsFiles) {
    const content = await readFile(file, 'utf-8');
    let fixedContent = content;
    
    // Fix relative imports that don't have .js extension
    // Pattern 1: from './path' or from '../path'
    fixedContent = fixedContent.replace(
      /from\s+['"](\.\/.+?)['"];?/g,
      (match, importPath) => {
        // Skip if already has .js extension
        if (importPath.endsWith('.js')) {
          return match;
        }
        
        // Special case for '../_utils' -> '../_utils/index.js'
        if (importPath.endsWith('/_utils') || importPath.endsWith('../_utils')) {
          return match.replace(importPath, importPath + '/index.js');
        }
        
        // Special case for '../types' -> '../types/index.js'
        if (importPath.endsWith('/types') || importPath.endsWith('../types')) {
          return match.replace(importPath, importPath + '/index.js');
        }
        
        // Add .js extension for other paths
        return match.replace(importPath, importPath + '.js');
      }
    );
    
    // Fix import assertions for JSON files - change to use import attributes
    fixedContent = fixedContent.replace(
      /import\s+(.+?)\s+from\s+['"](.+?\.json)['"].+?assert\s*{\s*type:\s*['"]json['"]?\s*};?/g,
      (match, importName, importPath) => {
        return `import ${importName} from '${importPath}' with { type: 'json' };`;
      }
    );
    
    if (content !== fixedContent) {
      await writeFile(file, fixedContent, 'utf-8');
      console.log(`Fixed imports in: ${file}`);
    }
  }
  
  console.log('Import fixing complete!');
}

fixImports().catch(console.error);
