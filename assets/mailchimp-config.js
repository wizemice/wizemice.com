/**
 * ─── Mailchimp waitlist (wizemice.com) ─────────────────────────────────────
 *
 * When changing base / u / id / mergeRoles, update the fallback block right
 * after <script src="assets/mailchimp-config.js"> in index.html (same values).
 *
 * 1) In Mailchimp: Audience dashboard → Audience name & defaults → Audience ID
 *    (optional note). You mainly need values from an **embedded signup form**.
 *
 * 2) Audience → Signup forms → Embedded forms → **Unstyled** (or classic “Naked”)
 *    → Generate. In the snippet find:
 *
 *      <form action="https://YOURSERVER.list-manage.com/subscribe/post?..."
 *
 *      → **base** = origin only → `https://YOURSERVER.list-manage.com`
 *         (YOURSERVER is usually like `us1` … `us21`, no trailing slash)
 *
 *      <input type="hidden" name="u" value="…">   → **u**
 *      <input type="hidden" name="id" value="…">  → **id**  (often a long hex)
 *
 * 3) Name field: built-in merge tag **FNAME** — already sent from the optional
 *    “Name” input (first name slot).
 *
 * 4) “Roles in music” on this site sends to one **text** merge field. Your
 *    embedded form exposes **COMPANY** — we use that so things work without
 *    extra setup. In Mailchimp you can rename the label to something like
 *    “Music role(s)” (the tag stays **COMPANY**), or create a **custom** field
 *    and change **mergeRoles** here to match (e.g. MERGE8).
 *
 * 5) After deploy: submit a **test** signup; check Mailchimp → Audience →
 *    All contacts (and spam folder if using double opt-in).
 *
 * 6) If signups silently fail only on the live domain: Mailchimp has list/
 *    security settings — allow your host if offered; typical static sites work
 *    with JSONP as implemented in index.html.
 *
 * ─── WizeMice list (saved from embedded form 2026) ───────────────────────────
 */

window.WIZEMICE_MAILCHIMP = {
  base: 'https://wizemice.us18.list-manage.com',
  u: '2177455115dcd899cc4897f07',
  id: 'f54680d189',
  /** Roles picker posts here; aligns with COMPANY on your embedded form */
  mergeRoles: 'COMPANY',
};
