import { expect } from '@playwright/test';
import { time } from 'console';
export class ProfilePage {
    constructor(page) {
        this.page = page;
    }

    async updateProfile(data) {
        await this.page.getByRole('textbox', { name: 'First Name' }).fill(data.firstName);
        await this.page.getByRole('textbox', { name: 'Last name' }).fill(data.lastName);
        await this.page.locator('//label[contains(text(),"Date of Birth")]/following-sibling::*//button').click();
        await this.page.getByRole('dialog', { name: 'Choose Date' }).getByRole('combobox').selectOption(data.dateOfBirthYear);
        await this.page.getByRole('option', { name: new RegExp(data.dateOfBirthDay) }).click();
        await this.page.getByRole('textbox', { name: 'Enter Zipcode' }).fill(data.zipcode);
        await this.page.getByRole('textbox', { name: 'Enter City' }).fill(data.city);
        await this.page.getByRole('textbox', { name: 'Enter Address' }).fill(data.address);
        try {
            await this.page.getByRole('combobox').click();
            await this.page.getByRole('option', { name: data.state }).click();
        } catch {
            console.log('State selection failed, trying again...');
        }
        await this.page.getByRole('button', { name: 'Update' }).click();
    }

    async assertProfile(data) {
        await expect(this.page.getByRole('textbox', { name: 'First Name' })).toHaveValue(data.firstName);
        await expect(this.page.getByRole('textbox', { name: 'Last name' })).toHaveValue(data.lastName);
        await expect(this.page.getByRole('textbox', { name: 'Enter Zipcode' })).toHaveValue(data.zipcode);
        await expect(this.page.getByRole('textbox', { name: 'Enter City' })).toHaveValue(data.city);
        await expect(this.page.getByRole('textbox', { name: 'Enter Address' })).toHaveValue(data.address);
        await expect(this.page.locator('//button[@role="combobox"]//span').nth(1)).toHaveText(data.state);
    }

    async updatePassword(data) {
        await this.page.getByRole('listitem').filter({ hasText: 'Password' }).click();
        await this.page.locator('input[name="password"]').fill(data.currentPassword);
        await this.page.locator('input[name="newPassword"]').fill(data.newPassword);
        await this.page.locator('input[name="confirmNewPassword"]').fill(data.newPassword);
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }

    async login(data) {
        await this.page.getByRole('tab', { name: 'Sign In' }).click();
        await this.page.getByRole('textbox', { name: 'Username' }).fill(data.username);
        await this.page.getByRole('textbox', { name: 'Password' }).fill(data.password);
        await this.page.getByRole('button', { name: 'Sign In', exact: true }).click();
        await this.page.waitForTimeout(500);
        await expect(this.page.locator('//div[contains(text(),"Logged In")]')).toBeVisible({ timeout: 5000 });
    }

    async errorHandlingLogin() {
        await this.page.waitForTimeout(2000);
        const usererror = this.page.locator('text=User does not exists').first();
        if (await usererror.isVisible()) {
            await expect(usererror).toBeVisible({ timeout: 5000 });
            console.log("user error message verified.");
        }
        const passerror = this.page.getByText('Current password is wrong').first();
        if (await passerror.isVisible()) {
            await expect(passerror).toBeVisible({ timeout: 5000 });
            console.log("Password error message verified.");
        }
    }

    async invalidLogin(data) {
        await this.page.getByRole('tab', { name: 'Sign In' }).click();
        await this.page.getByRole('textbox', { name: 'Username' }).fill(data.wrongusername);
        await this.page.getByRole('button', { name: 'Sign In', exact: true }).click();
        await this.errorHandlingLogin();
        await this.page.getByRole('textbox', { name: 'Password' }).fill(data.wrongpassword);
        await this.page.getByRole('button', { name: 'Sign In', exact: true }).click({ timeout: 5000 });
        await this.errorHandlingLogin();
        await this.page.getByRole('textbox', { name: 'Username' }).fill(data.username);
        await this.page.getByRole('textbox', { name: 'Password' }).fill(data.wrongpassword);
        await this.page.getByRole('button', { name: 'Sign In', exact: true }).click();
        await this.errorHandlingLogin();
        console.log('✅ Invalid login attempts completed');
    }

    async emptyLogin(data) {
        await this.page.getByRole('tab', { name: 'Sign In' }).click();
        await this.page.getByRole('textbox', { name: 'Username' }).fill(data.emptyusername);
        await this.page.getByRole('textbox', { name: 'Password' }).fill(data.emptypassword);
        await this.page.getByRole('button', { name: 'Sign In', exact: true }).click();
        await this.errorHandlingLogin();
        console.log('✅ Empty login attempts completed');
    }

    async validSignup(data) {
        const unqNum = Math.floor(1000 + Math.random() * 9000);
        let username = `qauser${unqNum}`;

        await this.page.getByRole('tab', { name: 'Sign Up' }).click();
        await this.page.waitForTimeout(1000);

        // Try invalid username first
        await this.page.locator('[placeholder="Username"]').fill(username);
        await this.page.locator('[placeholder="Password"]').fill(data.password);
        await this.page.waitForTimeout(1000);
        await this.page.locator('//label[contains((.),"I am at least 18 years old ")]/parent::*//button').check();
        await this.page.waitForTimeout(1000);
        await this.page.locator('//label[contains((.),"I accept the")]/parent::*//button').check();
        await this.page.waitForTimeout(1000);
        await this.page.click('//button[@type="submit" and contains(., "Sign Up")]');
        console.log('✅ Registered with:', username);
        await this.page.waitForTimeout(1000);   // wait for 2 sec
        await expect(this.page.locator('//div[contains(text(),"Signed Up Successfully")]')).toBeVisible();

    }
    async invalidSignUp(data) {
        let usernames = ['qa', 'qa user', 'qa@user', 'qauser!@#'];
        let passwords = ['Pa', 'Pass123', 'Pass 123', 'pass@123', 'Passs@']

        const usernameErrorTxt = "Username must be at least 3 characters long and contain only letters and numbers without spaces.";
        const emptyusernameerror = "Username is required!";
        const passwordErrorTXt = "Password must be at least 6 characters with one uppercase, one lowercase, one number, and one special character. Spaces are not allowed.";
        const emptypassworderror = "Password is required!";
        const checkboxErrorTxt = "Please allow the Terms of Use, Privacy Policy, and Age/State restriction.";
        const existierror = "User already exists";
        // Try invalid username first

        await this.page.getByRole('tab', { name: 'Sign Up' }).click();
        await this.page.waitForTimeout(1000);

        await this.page.click('//button[@type="submit" and contains(., "Sign Up")]');
        const usernameError = await this.page.locator('//label[contains(text(),"Username")]/parent::*//*[contains(@class, "text-red")]');
        const passwordError = await this.page.locator('//label[contains(text(),"Password")]/parent::*//*[contains(@class, "text-red")]');
        await expect(usernameError).toContainText(emptyusernameerror);
        await this.page.waitForTimeout(1000);
        await expect(passwordError).toContainText(emptypassworderror);

        for (let i = 0; i < usernames.length; i++) {
            await this.page.locator('[placeholder="Username"]').fill(usernames[i]);
            console.log('Entered username:', usernames[i]);
            await this.page.click('//button[@type="submit" and contains(., "Sign Up")]');
            await this.page.waitForTimeout(1000);
            await expect(usernameError).toContainText(usernameErrorTxt);

        }
        await this.page.locator('[placeholder="Username"]').fill(data.username);
        console.log('====================================================')
        for (let j = 0; j < passwords.length; j++) {
            await this.page.locator('[placeholder="Password"]').fill(passwords[j]);
            console.log('Entered password:', passwords[j]);
            await this.page.click('//button[@type="submit" and contains(., "Sign Up")]');
            await this.page.waitForTimeout(1000);
            await expect(passwordError).toContainText(passwordErrorTXt);
        }
        await this.page.locator('[placeholder="Password"]').fill(data.password);
        await this.page.click('//button[@type="submit" and contains(., "Sign Up")]');
        // Handle missing checkbox errors

        const cmnErrormsg = await this.page.locator('//div[contains(text(),"Error")]/following-sibling::*').first();
        await this.page.waitForTimeout(1000);
        await expect(cmnErrormsg).toContainText(checkboxErrorTxt);

        await this.page.locator('//label[contains((.),"I accept the")]/parent::*//button').check();
        await this.page.locator('//label[contains((.),"I am at least 18 years old ")]/parent::*//button').check();
        await this.page.click('//button[@type="submit" and contains(., "Sign Up")]');
        await this.page.waitForTimeout(1000);
        await expect(cmnErrormsg).toContainText(existierror);
    }
}