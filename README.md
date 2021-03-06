## EBOX

I'm a believer of Inbox Zero methodology & productivity tool minimalism. Most note taking / to-do list apps I've encountered nowadays have too many bells & whistles. I wanted something simple and lightweight - so I built this over the weekend.

Inbox Zero requires that you move inbound emails to a central to-do list, and immediately archive the email. So this app integrates with Gmail. While clearing out your inbox, you can apply the (automatically-generated) gmail label "ebox." After zeroing out your inbox, you can return to the app & sync the labeled emails into your list.

...and just because I like having a simple (and temporary) note pad while looking at my to-do list, I added a textarea to the page.

Checkout the deployed app: https://ebox.now.sh
(You need a Google Account)

Stack:
- NextJS
- React
- Firebase (Firestore & Auth)
- Google API (Gmail)
- Deployed with Now

Lacks:
- Improper styling techniques (inline)
- Components have too many functions / methods

#serverless
