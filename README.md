# Week 1 — Personal Portfolio Website

A responsive student portfolio built for the Skill Nexis Week 1 HTML & CSS assignment.

## Requirements covered
- About, Education, Skills, and Contact sections
- Semantic HTML (`header`, `nav`, `main`, `section`, `footer`)
- CSS styling, responsive layout, hover states, and mobile navigation
- Profile-photo placeholder and instructions to replace it

## Preview locally
1. Download or extract this folder.
2. Open `index.html` in a web browser.

## Personalize before submitting
1. Replace the profile placeholder with your own photo if you want: save it as `assets/profile.jpg`, then replace the `.profile-placeholder` block in `index.html` with:
   `<img class="profile-photo" src="assets/profile.jpg" alt="Aayush Rai">`
2. Add this CSS to `style.css`:
   `.profile-photo { width: 100%; aspect-ratio: 4 / 4.5; object-fit: cover; border-radius: 48% 48% 24px 24px; box-shadow: var(--shadow); }`
3. Replace `your.email@example.com` with your real email address.
4. Review the text and edit anything that doesn't describe you accurately.
5. Test the navigation and all sections in your browser.

## Upload to GitHub
1. Sign in to GitHub and create a **public** repository named `week1-portfolio`.
2. Choose **Add file → Upload files**.
3. Upload `index.html`, `style.css`, `script.js`, `README.md`, and the `assets` folder if you added a photo.
4. Click **Commit changes**.
5. Copy the repository URL, for example `https://github.com/YOUR-USERNAME/week1-portfolio`.
6. Paste your actual repository URL into the Skill Nexis Week 1 submission box.

## Optional: publish the website with GitHub Pages
In the repository, open **Settings → Pages**. Under build/deployment, select **Deploy from a branch**, choose `main` and `/ (root)`, then save. After GitHub Pages finishes publishing, use the website URL if the platform specifically requests a live website link. Keep the repository URL handy either way.
