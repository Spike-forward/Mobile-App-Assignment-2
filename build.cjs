#!/usr/bin/env node

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

// 確保 dist 目錄存在
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// 複製靜態文件
function copyStaticFiles() {
  const staticFiles = [
    'Public/index.html',
    'Public/login.html',
    'Public/dashboard.html',
    'Public/courses.html',
    'Public/favorites.html',
    'Public/admin.html',
    'Public/index.css'
  ];

  staticFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const dest = path.join('dist', file.replace('Public/', ''));
      const destDir = path.dirname(dest);
      
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      fs.copyFileSync(file, dest);
      console.log(`Copied: ${file} -> ${dest}`);
    }
  });

  // 複製 coursesData.js 文件
  const coursesDataFile = 'Private/data/coursesData.js';
  if (fs.existsSync(coursesDataFile)) {
    const dest = path.join('dist', coursesDataFile);
    const destDir = path.dirname(dest);
    
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.copyFileSync(coursesDataFile, dest);
    console.log(`Copied: ${coursesDataFile} -> ${dest}`);
  }
}

// 編譯 TypeScript 文件
async function build() {
  try {
    console.log('🚀 Starting build process...');
    
    // 複製靜態文件
    copyStaticFiles();
    
    // 編譯主要的 TypeScript 文件
    await esbuild.build({
      entryPoints: [
        'Private/data/courseData.ts'
      ],
      bundle: false,
      outdir: 'dist/Private',
      format: 'esm',
      target: 'es2020',
      sourcemap: true,
      minify: false,
      keepNames: true,
      platform: 'browser',
      external: [],
      loader: {
        '.ts': 'ts',
        '.js': 'js'
      }
    });

    console.log('✅ Build completed successfully!');
    console.log('📁 Output directory: dist/');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// 開發模式監聽
async function watch() {
  console.log('👀 Starting watch mode...');
  
  const ctx = await esbuild.context({
    entryPoints: [
      'Private/data/courseData.ts'
    ],
    bundle: false,
    outdir: 'dist/Private',
    format: 'esm',
    target: 'es2020',
    sourcemap: true,
    minify: false,
    keepNames: true,
    platform: 'browser',
    loader: {
      '.ts': 'ts',
      '.js': 'js'
    }
  });

  await ctx.watch();
  console.log('👀 Watching for changes...');
}

// 清理構建目錄
function clean() {
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('🧹 Cleaned dist directory');
  }
}

// 命令行參數處理
const command = process.argv[2];

switch (command) {
  case 'build':
    build();
    break;
  case 'watch':
    watch();
    break;
  case 'clean':
    clean();
    break;
  default:
    console.log(`
📦 Build Script for Mobile App Assignment 2

Usage:
  node build.js build   - Build the project
  node build.js watch   - Watch mode for development
  node build.js clean   - Clean build directory

Examples:
  node build.js build   # Production build
  node build.js watch   # Development with auto-reload
    `);
}
