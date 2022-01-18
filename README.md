# trace 🔍
A Cloudflare Worker and Discord Webhook integration for pixel tracking.  
Made in JavaScript, December 2021 to January 2022.  
Released under the [MIT License](./LICENSE).  
Created by [Kewbish](https://github.com/kewbish).   

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/kewbish/trace)

## Usage
Trace Base64 encodes the set of URL parameters in order to avoid some anti-pixel blockers flagging this as a pixel (which it rightfully is). This isn't guaranteed to work, but gets around the blockers I need to circumvent well enough.

To generate a pixel, visit [trace-tag-gen.pages.dev](https://trace-tag-gen.pages.dev). This by default uses my own instance. **Please remember to change the URL from `trace.kewbish.workers.dev` to your own instance. Otherwise, I will receive every pageview you get.** 
- Enter the name of your pixel, any notes that you'd like to attach to the pixel, and any cities you'd like to exclude from tracking
- If you'd like to embed extra parameters, use `key=value,key2=value2` format to add extra information

Copy the URL in the output, and paste it into an `<img src="URLHERE">` element (use an external HTML editor for this). You can then copy paste this into your own email.

## Deploy an Instance
Click the above Deploy button to copy the project to your own GitHub and deploy an instance to your own Cloudflare Workers account.

To get set up, you'll also need to provide a valid Discord webhook.
- In any Discord channel where you'd like to receive your notification, click the gear icon to `Edit Channel`.
- Click Integrations, and click `View webhooks`.
- Create a new webhook - avatar and name don't matter. Make sure to copy that webhook URL.
- In your Cloudflare worker dashboard, click on the `trace` worker, and click into Settings.
- Click Variables, and set the `DISCORD_WEBHOOK_URL` to your webhook URL from earlier. You can set it as a secret.

