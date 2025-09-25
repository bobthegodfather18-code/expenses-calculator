#!/usr/bin/env node

/**
 * إعداد النشر التلقائي لحاسبة المصروفات
 * هذا السكريبت يساعد في إعداد المشروع للنشر على GitHub و Netlify
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupProject() {
  console.log('🚀 مرحباً بك في إعداد مشروع حاسبة المصروفات للنشر\n');
  
  // التحقق من وجود الملفات المطلوبة
  const requiredFiles = ['index.html', 'admin.html', 'netlify.toml', 'package.json'];
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.log('❌ الملفات المطلوبة مفقودة:', missingFiles.join(', '));
    console.log('تأكد من تشغيل السكريبت في مجلد المشروع الصحيح\n');
    process.exit(1);
  }
  
  console.log('✅ جميع الملفات المطلوبة موجودة\n');
  
  // جمع معلومات المشروع
  const projectName = await question('📝 اسم المشروع على GitHub (مثال: expenses-calculator): ');
  const username = await question('👤 اسم المستخدم على GitHub: ');
  const email = await question('📧 البريد الإلكتروني: ');
  const description = await question('📄 وصف المشروع (اختياري): ') || 'نظام متكامل لحساب وإدارة مصروفات الشحن البحري';
  
  // تحديث package.json
  console.log('\n🔄 تحديث package.json...');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    packageJson.name = projectName;
    packageJson.description = description;
    packageJson.author = username;
    packageJson.repository.url = `https://github.com/${username}/${projectName}.git`;
    packageJson.homepage = `https://${projectName}.netlify.app`;
    
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ تم تحديث package.json');
  } catch (error) {
    console.log('❌ خطأ في تحديث package.json:', error.message);
  }
  
  // إنشاء ملف .env.example
  console.log('\n🔄 إنشاء ملف .env.example...');
  const envExample = `# متغيرات البيئة لحاسبة المصروفات
# انسخ هذا الملف إلى .env واملأ القيم الصحيحة

# Airtable (اختياري)
AIRTABLE_TOKEN=your_airtable_token_here
AIRTABLE_BASE_ID=your_base_id_here

# Google Sheets (اختياري)
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SHEET_ID=your_sheet_id_here

# Supabase (اختياري)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# إعدادات عامة
NODE_ENV=production
`;
  
  fs.writeFileSync('.env.example', envExample);
  console.log('✅ تم إنشاء .env.example');
  
  // إنشاء ملف deployment-checklist.md
  console.log('\n🔄 إنشاء قائمة التحقق من النشر...');
  const checklist = `# قائمة التحقق من النشر - ${projectName}

## ✅ قبل النشر
- [ ] تأكد من عمل جميع الوظائف محلياً
- [ ] اختبر التطبيق على أجهزة مختلفة
- [ ] تحقق من صحة جميع الملفات
- [ ] أضف معلوماتك في package.json

## 🚀 خطوات النشر

### 1. رفع المشروع على GitHub
\`\`\`bash
git init
git add .
git commit -m "Initial commit: ${description}"
git branch -M main
git remote add origin https://github.com/${username}/${projectName}.git
git push -u origin main
\`\`\`

### 2. نشر على Netlify
1. اذهب إلى [netlify.com](https://netlify.com)
2. اضغط "New site from Git"
3. اختر GitHub
4. اختر مستودع \`${projectName}\`
5. اضغط "Deploy site"

### 3. إعداد المتغيرات البيئية (إذا كنت تستخدم قاعدة بيانات خارجية)
1. اذهب إلى Site settings في Netlify
2. اضغط Environment variables
3. أضف المتغيرات من ملف .env.example

## 🔗 روابط مفيدة
- **GitHub Repository**: https://github.com/${username}/${projectName}
- **Netlify Site**: https://${projectName}.netlify.app
- **لوحة الإدارة**: https://${projectName}.netlify.app/admin.html

## 📞 الدعم
إذا واجهت أي مشاكل، راجع:
- DEPLOYMENT_GUIDE.md
- README.md
- DATA_USAGE_GUIDE.md
`;
  
  fs.writeFileSync('deployment-checklist.md', checklist);
  console.log('✅ تم إنشاء deployment-checklist.md');
  
  // إنشاء أوامر Git
  console.log('\n🔄 إنشاء أوامر Git...');
  const gitCommands = `#!/bin/bash
# أوامر Git للنشر الأولي

echo "🚀 بدء عملية النشر..."

# تهيئة Git
git init

# إضافة جميع الملفات
git add .

# إنشاء أول commit
git commit -m "Initial commit: ${description}"

# تعيين الفرع الرئيسي
git branch -M main

# إضافة المستودع البعيد
git remote add origin https://github.com/${username}/${projectName}.git

# رفع الكود
git push -u origin main

echo "✅ تم رفع المشروع على GitHub بنجاح!"
echo "🔗 رابط المستودع: https://github.com/${username}/${projectName}"
echo "🌐 الآن يمكنك نشر المشروع على Netlify"
`;
  
  fs.writeFileSync('deploy.sh', gitCommands);
  fs.chmodSync('deploy.sh', '755'); // جعل الملف قابل للتنفيذ على Unix/Linux
  console.log('✅ تم إنشاء deploy.sh');
  
  // إنشاء ملف Windows batch
  const windowsBatch = `@echo off
echo 🚀 بدء عملية النشر...

REM تهيئة Git
git init

REM إضافة جميع الملفات
git add .

REM إنشاء أول commit
git commit -m "Initial commit: ${description}"

REM تعيين الفرع الرئيسي
git branch -M main

REM إضافة المستودع البعيد
git remote add origin https://github.com/${username}/${projectName}.git

REM رفع الكود
git push -u origin main

echo ✅ تم رفع المشروع على GitHub بنجاح!
echo 🔗 رابط المستودع: https://github.com/${username}/${projectName}
echo 🌐 الآن يمكنك نشر المشروع على Netlify

pause
`;
  
  fs.writeFileSync('deploy.bat', windowsBatch);
  console.log('✅ تم إنشاء deploy.bat');
  
  console.log('\n🎉 تم إعداد المشروع بنجاح!');
  console.log('\n📋 الخطوات التالية:');
  console.log('1. راجع ملف deployment-checklist.md');
  console.log('2. شغل deploy.sh (Linux/Mac) أو deploy.bat (Windows)');
  console.log('3. اذهب إلى netlify.com ونشر المشروع');
  console.log(`4. رابط موقعك سيكون: https://${projectName}.netlify.app`);
  
  console.log('\n📚 ملفات مفيدة:');
  console.log('- DEPLOYMENT_GUIDE.md: دليل النشر الكامل');
  console.log('- README.md: معلومات المشروع');
  console.log('- DATA_USAGE_GUIDE.md: دليل استخدام البيانات');
  
  rl.close();
}

// التحقق من أن Node.js مثبت
if (typeof require === 'undefined') {
  console.log('❌ يتطلب Node.js لتنفيذ هذا السكريبت');
  console.log('قم بتحميل Node.js من: https://nodejs.org/');
  process.exit(1);
}

// تشغيل الإعداد
setupProject().catch(error => {
  console.error('❌ حدث خطأ أثناء الإعداد:', error);
  rl.close();
  process.exit(1);
});
