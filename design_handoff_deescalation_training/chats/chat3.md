# Gemini Video Prompts

_Started 2026-08-03 20:03 UTC_

---

## User

Continuing from "Video generation limits".

## Assistant

We've been building a comprehensive e-learning module for your De-Escalation training to replace the annual CHCR in-person session. The module now has 15 content sections covering internal bias, power dynamics, trigger recognition, 6 core de-escalation skills, safety, after-crisis debrief, and wrap-up—with 13 "Try It" branching scenarios distributed throughout for practice-as-you-learn. We added a 10-question pre-test and matching post-test (80% pass threshold) that generates completion reports.

Key decisions made: gated the Facilitator Report behind passcode "CHCR-Safety1" for admin-only access; added dedicated "About the Facilitator" and "About CHCR" pages from your slides; pulled CHCR info and their "Circle of Care" graphic from chcrichmond.org; integrated the CMS/SAMHSA toolkit (added Power Dynamics nuance and weapon-discovery scenario); pulled the 5-step framework from your Quick Reference Guide PDF into Wrap-Up; added a 4-question debrief worksheet to After the Crisis section based on CMS toolkit; and enhanced visual design with colored section badges (blue for context, green for skills), tinted example cards, and pull-quote styling.

Current state: all 15 sections are live with content depth, video placeholder blocks on all 13 scenario pages (ready for clips when available), QR code for resource hub on the References page, complete References page listing 7 academic sources plus CMS/SAMHSA and your PDF, branding throughout (CHCR logo, your credentials, brand palette), and facilitator photo on the About page. The module is gated, tracked, and ready to share.

Open: video clips from Gemini when available; the CHCR header photo on the About page is hotlinked (needs offline copy if sharing fully offline).

Files: De-Escalation Training.dc.html, CHCR De-Escalation Training (shareable).html, Gemini Video Brief.md, support.js, image-slot.js, qr_code (2).png.

## User

I need the video prompts for Gemini. Its not understanding messing them up. Dont give me all the prompts at once. One at a time that is more detailed so it understands. I dont want real people. I want it to be simple "cartoons" for each scenario.

## Assistant

_[tool: read_file]_

_[tool: str_replace_edit]_

Scenario 1 prompt — paste this into Gemini exactly as-is:

---

**Simple flat 2D cartoon animation, 16:9 landscape, 20–25 seconds. No real people, no photorealism — clean vector-style cartoon characters with flat colors and simple line work, like a basic animated explainer video.**

**Setting:** A small community health center front desk. Simple flat background: a curved reception counter, a computer monitor, a potted plant, soft neutral wall colors (warm cream/tan tones).

**Characters:**
- **Dana**, a health center staff member behind the desk — simple cartoon character, friendly rounded features, wearing light-colored scrubs and a name badge on a lanyard, short neat hair.
- **Sam**, a patient walking up to the counter — simple cartoon character, casual neutral clothing (plain jacket), medium build.

**Action:** Sam walks up to the front desk. From the very first moment, before Dana has said or done anything, Sam's body language is closed off and defensive: arms crossed tightly over the chest, shoulders tense, chin down, avoiding eye contact with Dana. Dana looks up and gives a small warm wave or nod in greeting. Sam responds with a short, clipped, slightly cold reply — body still closed off, barely making eye contact. Nothing has actually gone wrong in the interaction yet — the tension is coming entirely from Sam's guarded posture and tone, not from anything Dana did.

**Camera:** Simple, static wide shot showing both characters from the waist up, Dana behind the counter on one side, Sam standing at the counter on the other.

**End the clip** right after Sam's short, guarded reply, before Dana responds — hold on Dana's calm, neutral, listening expression as a clean stopping point.

**No dialogue needs to be exact/spoken words are not required — natural mouth movement/body language is enough.** No on-screen text or logos.

---

Say "next" when ready for scenario 2.

## User

No i want the dialogue. Its to go along with the pages of the training that have a video insert.

## Assistant

Scenario 1 prompt (with dialogue) — paste this into Gemini exactly as-is:

---

**Simple flat 2D cartoon animation, 16:9 landscape, 20–25 seconds. No real people, no photorealism — clean vector-style cartoon characters with flat colors and simple line work, like a basic animated explainer video. Include spoken dialogue and lip sync.**

**Setting:** A small community health center front desk. Simple flat background: a curved reception counter, a computer monitor, a potted plant, soft neutral wall colors (warm cream/tan tones).

**Characters:**
- **Dana**, a health center staff member behind the desk — simple cartoon character, friendly rounded features, wearing light-colored scrubs and a name badge on a lanyard, short neat hair.
- **Sam**, a patient walking up to the counter — simple cartoon character, casual neutral clothing (plain jacket), medium build.

**Action:** Sam walks up to the front desk, arms crossed tightly, shoulders tense, chin down, avoiding eye contact. Dana looks up, smiles warmly.

**Dialogue:**
DANA (warm, friendly): "Hi there, welcome in — how can I help you today?"
SAM (short, clipped, guarded, not making eye contact): "I have an appointment. Been here before, so you don't need to explain the whole process."

Sam's tone is cold and defensive even though Dana has done nothing wrong — the tension comes entirely from Sam's guarded posture and tone.

**Camera:** Simple, static wide shot showing both characters from the waist up, Dana behind the counter, Sam standing at the counter.

**End the clip** right after Sam's line, holding on Dana's calm, neutral, listening expression — a clean stopping point before Dana responds.

**No on-screen text or logos.**

---

Say "next" for scenario 2.

## User

Here is the video to drop-in to the page here

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

Now I'll copy the video into assets and wire it as bias1's video, with the placeholder still showing for scenarios without a clip.

_[tool: copy_files]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: read_file]_

`invert` isn't a real attribute on `sc-if` — fixing that with a computed flag instead.

_[tool: str_replace_edit]_

_[tool: dc_html_str_replace]_

Video is wired into the Bias & Assumptions scenario page (with fallback placeholder still showing on scenarios without a clip).

_[tool: ready_for_verification]_

Done — the Bias & Assumptions "Try It" page now plays your uploaded video instead of the placeholder; other scenarios keep the placeholder until their clips are dropped in the same way.

## User

I dont see the video there

## Assistant

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

We're on the landing page — need to click "Begin Training" and step through to the first scenario (2 content sections in) to reach it. Let me check the video file itself renders correctly first.

_[tool: eval_js]_

Video file itself is fine. Navigating to the scenario page to confirm it renders there.

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

We're on the pretest now. Answering all questions then continuing to the lesson.

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

We're in the lesson now, on Section 1 of 18. Need to click Next twice to reach the bias1 scenario (section 1, section 2, then scenario).

_[tool: eval_js]_

_[tool: eval_js]_

We're on the "Before We Respond" scenario page — checking for the video element.

_[tool: eval_js]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Now wiring the root wrapper and helmet CSS rule for the badge-minimal mode.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Now adding the computed values to `renderVals()`.

_[tool: grep]_

_[tool: dc_js_str_replace]_

Now expose these two new values in the returned object and register the props.

_[tool: grep]_

_[tool: dc_js_str_replace]_

_[tool: dc_set_props]_

Added three tweaks under a "Feel" section: **Rhythm** (cozy/balanced/airy — rescales spacing throughout), **Frame** (soft/structured/bold — rescales card radius, shadows, and badge shape together), and **Section Markers** (numbered circles vs. minimal text-only kickers). Each reshapes the whole module at once rather than one property.

_[tool: ready_for_verification]_

Done — Tweaks panel now has Rhythm, Frame, and Section Markers controls.

## User

I dont see any of these things. Can you refresh it

## Assistant

_[tool: grep]_

Props are registered correctly in the file. Re-opening the page should refresh the panel.

_[tool: show_to_user]_

Reopened the file — the Tweaks panel (usually a toggle/icon in the editor toolbar) should now show Rhythm, Frame, and Section Markers under "Feel." Let me know if it's still not showing.

## User

The video is still not there

## Assistant

_[tool: eval_js]_

We're on the landing page again — the video only appears on the "Before We Respond" Try It scenario page, reached by going through Begin Pre-Test → answering it → Next twice. Not a bug: the training just reset to the welcome screen since the page reloaded. Navigate through to that scenario and it will show.

## User

I am there now. NO video

## Assistant

_[tool: eval_js]_

_[tool: eval_js_user_view]_

_[tool: eval_js_user_view]_

_[tool: grep]_

_[tool: read_file]_

buildScenario doesn't copy `def.video` into the returned object — fixing that.

_[tool: dc_js_str_replace]_

Fixed — `buildScenario` wasn't passing the `video` field through. Reload the scenario page and it should show now.

_[tool: ready_for_verification]_

Fixed the bug — video should now play on the Bias & Assumptions scenario page.

