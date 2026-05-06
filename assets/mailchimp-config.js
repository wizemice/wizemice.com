/**
 * Mailchimp (embedded signup form values)
 *
 * In Mailchimp: Audience → Signup forms → Embedded forms → select your form →
 * “Unstyled” (or Naked) → copy the generated HTML.
 *
 * From the <form action="..."> tag:
 *   - base = origin only, e.g. https://xxxx.us21.list-manage.com  (no path, no trailing slash)
 * From <input type="hidden" name="u" ...> and name="id":
 *   - u = value of u
 *   - id = value of id
 *
 * Optional “Roles” field: Audience → Settings → Audience fields and merge tags
 * → add a Text field (e.g. “Roles”) → use its merge tag below (often MERGE5 if
 * it’s your 5th merge field; confirm in Mailchimp).
 */
window.WIZEMICE_MAILCHIMP = {
  base: '',
  u: '',
  id: '',
  mergeRoles: 'MERGE5',
};
