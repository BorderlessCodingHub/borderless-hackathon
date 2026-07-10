import { test, expect } from '@playwright/test'

test.describe('public static hackathons', () => {
  test('home lists editions and 2026 results are public', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Edições' })).toBeVisible()
    await expect(page.getByText('HB01·2026')).toBeVisible()
    await expect(page.getByRole('link', { name: /Ranking anual 2025/ })).toBeVisible()

    await page.goto('/hb01-2026/resultados')
    await expect(page.getByRole('heading', { name: 'Resultados Finais' })).toBeVisible()
    await expect(page.getByText('Como calculamos')).toBeVisible()
    await expect(page.getByText('socratic-dev')).toBeVisible()

    const res = await page.goto('/hb01-2025/votar')
    expect(res?.status()).toBe(404)
  })

  test('annual ranking 2025 page', async ({ page }) => {
    await page.goto('/2025/ranking-anual')
    await expect(page.getByRole('heading', { name: 'Ranking Anual 2025' })).toBeVisible()
    await expect(page.getByText('Gabriel Nunes')).toBeVisible()
  })
})
