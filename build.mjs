#!/usr/bin/env node

import { build } from 'esbuild';
import { readdir, rm, readFile, writeFile } from 'fs/promises';
import { join, dirname, extname, relative } from 'path';
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

async function findJsFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await findJsFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function fixJsImports() {
  const distDir = join(__dirname, 'dist');
  const jsFiles = await findJsFiles(distDir);
  
  for (const file of jsFiles) {
    const content = await readFile(file, 'utf-8');
    
    // Fix relative imports to add .js extension
    let fixedContent = content.replace(
      /from\s+["'](\.\.?\/.+?)["']/g,
      (match, importPath) => {
        // Special cases for directory imports that were incorrectly compiled
        if (importPath === '../_utils.js' || importPath === './_utils.js') {
          return match.replace(importPath, importPath.replace('.js', '/index.js'));
        }
        
        if (importPath === '../types.js' || importPath === './types.js') {
          return match.replace(importPath, importPath.replace('.js', '/index.js'));
        }
        
        // Skip if already has .js extension and it's not a directory case
        if (importPath.endsWith('.js')) {
          return match;
        }
        
        // Special cases for directory imports
        if (importPath.endsWith('/_utils') || importPath.endsWith('../_utils')) {
          return match.replace(importPath, importPath + '/index.js');
        }
        
        if (importPath.endsWith('/types') || importPath.endsWith('../types')) {
          return match.replace(importPath, importPath + '/index.js');
        }
        
        // Add .js extension for file imports
        return match.replace(importPath, importPath + '.js');
      }
    );
    
    if (content !== fixedContent) {
      await writeFile(file, fixedContent, 'utf-8');
      console.log(`Fixed imports in: ${relative(__dirname, file)}`);
    }
  }
}

async function buildProject() {
  // Clean dist directory
  try {
    await rm(join(__dirname, 'dist'), { recursive: true });
  } catch (error) {
    // Directory doesn't exist, that's fine
  }

  const srcDir = join(__dirname, 'src');
  const entryPoints = await findTsFiles(srcDir);

  console.log('Building with esbuild...');

  // Build JavaScript files
  await build({
    entryPoints,
    outdir: 'dist',
    bundle: false,
    platform: 'node',
    format: 'esm',
    target: 'es2022',
    outExtension: { '.js': '.js' },
    tsconfig: './tsconfig.json',
    preserveSymlinks: false,
    outbase: 'src'
  });

  console.log('✅ JavaScript build complete');

  // Fix imports to add .js extensions
  console.log('Fixing JavaScript imports...');
  await fixJsImports();
  console.log('✅ JavaScript imports fixed');

  // Generate TypeScript declarations with tsc
  console.log('Generating TypeScript declarations...');
  const { spawn } = await import('child_process');
  
  const tscProcess = spawn('npx', ['tsc', '--emitDeclarationOnly'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  return new Promise((resolve, reject) => {
    tscProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ TypeScript declarations generated');
        resolve();
      } else {
        reject(new Error(`tsc exited with code ${code}`));
      }
    });
  });
}

buildProject().catch(console.error);
