import { test, expect } from '@playwright/test';
import data from '../Resources/profileData.json';
import { ProfilePage } from '../pages/ProfilePage';

test.use({
  permissions: ['geolocation'],
  geolocation: { latitude: 0, longitude: 0 },
  locale: 'en-US',
});

test.beforeEach(async ({ page }) => {
  await page.goto('https://dinerosweeps.com/');
});

test('Verify profile Data with valid data @smoke', async ({ page }) => {
  const profilePage = new ProfilePage(page);
  await profilePage.login(data.logindata);
  await page.locator('[aria-haspopup="menu"]').click();
  await page.getByRole('menuitem', { name: 'setting Settings' }).click();
  await profilePage.updateProfile(data.profiledata);
  const updatemsg= page.getByText('Profile Update Successfully').first();
  await expect(updatemsg).toBeVisible();
  await profilePage.assertProfile(data.profiledata);
});

test.skip('Verify password change @smoke', async ({ page }) => {
  const profilePage = new ProfilePage(page);
  await profilePage.updatePassword(data.passwordchange);
  await expect(page.getByText('Password Updated Successfully')).toBeVisible();
});

test('Verify login Invalid @smoke', async ({ page }) => {
  const profilePage = new ProfilePage(page);
  await profilePage.invalidLogin(data.invalidlogindata);
  await profilePage.emptyLogin(data.emptylogindata);
});

test('Verify Sign Up Valid @smoke', async ({ page }) => {
  const profilePage = new ProfilePage(page);
  await profilePage.validSignup(data.logindata);
  const toast1 = page.getByText('Signed Up Successfully');
  await expect(toast1).toBeVisible();
});

test('Verify Sign Up Invalid @smoke', async ({ page }) => {
  const profilePage = new ProfilePage(page);
  await profilePage.invalidSignUp(data.logindata);
});

test('Verify avatar upload works @smoke', async ({ page }) => {
  await page.getByRole('button', { name: 'profile down' }).click();
  await page.getByRole('menuitem', { name: 'setting Settings' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Avatar' }).click();
  await page.setInputFiles('input[type="file"]', 'tests/resources/file_example_JPG_1MB.jpg');
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByText('Avatar Updated Successfully')).toBeVisible();
});
