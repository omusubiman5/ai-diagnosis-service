const fs = require('fs');
const report = JSON.parse(fs.readFileSync('lighthouse-report.json', 'utf8'));

const categories = report.categories;
const audits = report.audits;

console.log('--- Lighthouse Scores ---');
Object.keys(categories).forEach(cat => {
    console.log(`${categories[cat].title}: ${Math.round(categories[cat].score * 100)}`);
});

console.log('\n--- Core Web Vitals ---');
console.log(`LCP (Largest Contentful Paint): ${audits['largest-contentful-paint'].displayValue}`);
console.log(`FCP (First Contentful Paint): ${audits['first-contentful-paint'].displayValue}`);
console.log(`CLS (Cumulative Layout Shift): ${audits['cumulative-layout-shift'].displayValue}`);
console.log(`TBT (Total Blocking Time): ${audits['total-blocking-time'].displayValue}`);
console.log(`SI (Speed Index): ${audits['speed-index'].displayValue}`);
