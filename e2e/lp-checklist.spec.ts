import { test, expect } from '@playwright/test';

test('LP Verification Checklist', async ({ page }) => {
    // 1. Hero Section
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    console.log('--- Hero Section ---');
    await expect.soft(page.getByText('60年の経験は'), 'Hero Text missing').toBeVisible();
    await expect.soft(page.getByText('推定市場価値'), 'Hero Counter label missing').toBeVisible();
    const heroCta = page.getByRole('button', { name: '無料で価値を診断する' });
    await expect.soft(heroCta, 'Hero CTA Button missing').toBeVisible();

    // 2. Features Section
    console.log('--- Features Section ---');
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(500);
    await expect.soft(page.getByText('3分で完了'), 'Feature "3分で完了" missing').toBeVisible();
    await expect.soft(page.getByText('AI×キャリア理論'), 'Feature "AI×キャリア理論" missing').toBeVisible();
    await expect.soft(page.getByText('具体的な数値'), 'Feature "具体的な数値" missing').toBeVisible();

    // 3. Empathy Section
    console.log('--- Empathy Section ---');
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(500);
    await expect.soft(page.getByText('孤独感'), 'Empathy "孤独感" missing').toBeVisible();
    await expect.soft(page.getByText('自信喪失'), 'Empathy "自信喪失" missing').toBeVisible();
    await expect.soft(page.getByText('収入への不満'), 'Empathy "収入への不満" missing').toBeVisible();

    // 4. Solution Section
    console.log('--- Solution Section ---');
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(500);
    await expect.soft(page.getByText('その不安、SKILL60+が解決します'), 'Solution Headline missing').toBeVisible();
    await expect.soft(page.getByText('Sさん'), 'Solution Case Study missing').toBeVisible();
    // After box - might need scrolling/waiting
    await page.waitForTimeout(1000);
    await expect.soft(page.getByText('After'), 'Solution After Box missing').toBeVisible();

    // 5. Steps Section
    console.log('--- Steps Section ---');
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(500);
    await expect.soft(page.getByText('会員登録'), 'Step 1 "会員登録" missing').toBeVisible();
    await expect.soft(page.getByText('5つの質問'), 'Step 2 "5つの質問" missing').toBeVisible();
    await expect.soft(page.getByText('診断結果'), 'Step 3 "診断結果" missing').toBeVisible();

    // 6. Trust Section
    console.log('--- Trust Section ---');
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(500);
    await expect.soft(page.getByText('データの融合'), 'Trust "データの融合" missing').toBeVisible();
    await expect.soft(page.getByText('監修者'), 'Trust "監修者" missing').toBeVisible();

    // 7. CTA Section
    console.log('--- CTA Section ---');
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(500);
    await expect.soft(page.getByText('あなたの新しい可能性'), 'CTA Headline missing').toBeVisible();
    const footerCta = page.getByRole('button', { name: '無料で診断を始める' }).first();
    await expect.soft(footerCta, 'CTA Button missing').toBeVisible();

    // Test Dialog
    if (await footerCta.isVisible()) {
        await footerCta.click();
        await expect.soft(page.getByText('Coming Soon'), 'Coming Soon dialog missing').toBeVisible();
        // Close dialog
        await page.keyboard.press('Escape');
    }

    // 8. Footer
    console.log('--- Footer Section ---');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect.soft(page.getByText('運営会社'), 'Footer "運営会社" missing').toBeVisible();
    await expect.soft(page.getByText('プライバシーポリシー'), 'Footer "プライバシーポリシー" missing').toBeVisible();
    await expect.soft(page.getByText('利用規約'), 'Footer "利用規約" missing').toBeVisible();
});
