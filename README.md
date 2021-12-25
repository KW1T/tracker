# trace 🔍
A Cloudflare Worker and Discord Webhook integration for pixel tracking.  
Made in JavaScript, December 2021 to present.  
Released under the [MIT License](./LICENSE).  
Created by [Kewbish](https://github.com/kewbish).   

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/kewbish/trace)

## Usage
Click the above Deploy button to copy the project to your own GitHub and deploy an instance to your own Cloudflare Workers account.

To get set up, you'll also need to provide a valid Discord webhook.
- In any Discord channel where you'd like to receive your notification, click the gear icon to `Edit Channel`.
- Click Integrations, and click `View webhooks`.
- Create a new webhook - avatar and name don't matter. Make sure to copy that webhook URL.
- In your Cloudflare worker dashboard, click on the `trace` worker, and click into Settings.
- Click Variables, and set the `DISCORD_WEBHOOK_URL` to your webhook URL from earlier. You can set it as a secret.

Generation of actual email tracking pixel is a feature in progress!
