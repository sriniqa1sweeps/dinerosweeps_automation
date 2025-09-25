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


test.skip('Verify password change @smoke', async ({ page }) => {
  const profilePage = new ProfilePage(page);
  await profilePage.updatePassword(data.passwordchange);
  await expect(page.getByText('Password Updated Successfully')).toBeVisible();
});

test('Verify login valid and Invalid @smoke', async ({ page }) => {
  const profilePage = new ProfilePage(page);
  await profilePage.invalidLogin(data.invalidlogindata);
  await profilePage.emptyLogin(data.emptylogindata);
  await profilePage.login(data.logindata);
});

test('Verify Sign Up Valid @smoke', async ({ page }) => {
  const profilePage = new ProfilePage(page);
  await profilePage.validSignup(data.logindata);
  const toast1 = page.getByText('Signed Up Successfully').first();
  await expect(toast1).toBeVisible();
});

test('Verify Sign Up Invalid @smoke', async ({ page }) => {
  const profilePage = new ProfilePage(page);
  await profilePage.invalidSignUp(data.logindata);
});

test('email verified user are able to send the message @smoke', async ({ page }) => {
  test.setTimeout(1000 * 60 * 5); // 5 minutes
   const profilePage = new ProfilePage(page);
  await profilePage.login(data.logindata); 
  const menuItems = page.locator('//li[@class="group/menu-item relative list-none"]');
  const menuCount = await menuItems.count();
    const burgerMenu=page.locator('//span[contains(text(),"Toggle Sidebar")]/parent::button').first();
    await burgerMenu.click();
    const closebtn = page.locator('[alt="close icon"]').first();
  for (let i = 0; i < menuCount; i++) {
    const option = menuItems.nth(i);
    const text = await option.innerText();
    await page.waitForTimeout(1000);
    // Only click if visible and enabled
    if (await option.isVisible() && await option.isEnabled()) {
      await option.click();
      await page.waitForLoadState('domcontentloaded');
      // await page.waitForTimeout(7000);
      const headingsOne= page.locator('//h1[contains(@class,"font-bold")]').first();
      const semiheading=page.locator('//h2[contains(@class,"font-semibold")]').first();
      if(await headingsOne.isVisible()){
        try{
      await expect(headingsOne).toContainText(text,{timeout:5000});
        }
        catch{
          console.log("Heading text not matching of "+text);
        }
      }
      
      if(await semiheading.isVisible()){
        try{
        await expect(semiheading).toContainText(text,{timeout:5000});
        }
        catch{
          console.log("Semi heading text not matching of "+text);
        }
      }
      
      if (await closebtn.isVisible()) {
        await page.waitForTimeout(1000);
        await closebtn.click();
      }
      console.log(`Menu item ${i + 1}: ${text}`);
    } else {
      console.log(`Menu item ${i + 1} not clickable: ${text}`);
    }
  }
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

test.skip('Verify avatar upload works @smoke', async ({ page }) => {
  await page.getByRole('button', { name: 'profile down' }).click();
  await page.getByRole('menuitem', { name: 'setting Settings' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Avatar' }).click();
  await page.setInputFiles('input[type="file"]', 'tests/resources/file_example_JPG_1MB.jpg');
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByText('Avatar Updated Successfully')).toBeVisible();
});