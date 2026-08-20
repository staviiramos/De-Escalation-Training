# De-Escalation Training — Video Brief for Gemini

Use this to generate short scenario videos for the CHCR de-escalation e-learning module. Each scenario below should become its own short video (aim for 20–40 seconds).

## Style & brand
- Setting: a community health center — front desk, waiting room, or exam room.
- Style: simple flat 2D cartoon animation (not realistic, not photoreal, no real people). Clean flat-color character designs, simple line work, minimal background detail. Think basic explainer-video style animation.
- Cast two recurring characters so learners recognize them across videos:
  - **Staff member "Dana"** — CHCR front-desk/clinical staff, wears a name badge, calm and professional demeanor even under stress.
  - **Patient "Sam"** — a recurring patient character (vary the specific scenario context; can swap for a second patient character "Maria" if a scenario needs someone else).
- Wardrobe: Dana in simple scrubs or a collared shirt with a lanyard; neutral, non-branded clothing for patients.
- Tone: respectful, not exaggerated or comedic — this is a professional training tool, just rendered as simple cartoon animation instead of live action.
- No on-screen text/logos needed; CHCR will add its own title cards in the course.
- Each video should end on a natural pause right when Dana responds, so the learner can then pick their own response in the app (the video demonstrates the SITUATION and, optionally, a second "good response" version — see format below).

## Note on using this brief with Gemini
Gemini's video generation does better with one very detailed, self-contained prompt per scenario rather than the short bullets below. Ask for prompts one at a time — see chat.

## Suggested format per scenario
For each prompt below, generate two short clips if possible:
1. **Setup clip** — shows the situation escalating up to the decision point (ends before Dana responds).
2. **Model-response clip** (optional) — shows Dana using the "correct" response from the script, for playback after the learner picks an answer.

If only one video per scenario is feasible, just produce the setup clip and let the app's written feedback carry the teaching point.

## Scenarios (13)

1. **Bias & assumptions** — Sam is short and defensive with Dana from the first moment of an interaction, even though nothing has gone wrong yet. Sam's body language is guarded, arms crossed, minimal eye contact.

2. **Cultural humility** — Sam (neurodivergent-coded: avoids eye contact, gives short flat answers) is being asked routine questions by Dana. Dana should not read this as rudeness.

3. **Common trigger — long wait** — Sam has been waiting a long time in the waiting room, stands up and raises their voice about the wait at the front desk, arms crossed, pacing.

4. **Common trigger — billing surprise** — Sam is at the front desk and just found out about a surprise cost insurance didn't cover; visibly frustrated, voice rising.

5. **Early warning signs** — Sam is seated, waiting for lab results, giving clipped one-word answers and rapidly tapping a foot — subtle signs of rising frustration, not yet a confrontation.

6. **Unintentional escalation** — Dana is behind schedule; Sam asks the same question a third time. Show Dana's non-verbal impatience (a sigh, glancing at a watch/clock).

7. **Stay calm** — Sam raises their voice directly at Dana. Focus the shot on Dana's reaction: taking a breath, keeping posture relaxed and hands visible.

8. **Respect & empathy** — Sam says something like "nobody here listens to me," clearly frustrated and feeling dismissed.

9. **Simple communication** — Dana needs to give Sam multiple instructions (change rooms, vitals, sign a form) while Sam seems overwhelmed and stressed.

10. **Safe space** — An exam room interaction where Sam seems uneasy; camera should show the physical layout (door, distance between Dana and Sam).

11. **Offer choices** — Sam is refusing to sit down for an exam, arms crossed, resistant.

12. **Non-verbal awareness** — Dana is listening to a distressed Sam but catches themselves crossing their arms defensively mid-conversation.

13. **Safety & disengagement** — Sam's behavior escalates from raised voice to slamming a hand on the counter and stepping closer to Dana — the moment just before Dana would need to disengage and call for support.

## Technical specs
- Aspect ratio: 16:9, landscape (embeds in a widescreen lesson card).
- Length: 20–40 seconds per clip.
- Format: MP4, H.264, reasonably compressed (this is a browser-based course).
- No dialogue is strictly required to be word-for-word — natural improvisation around the situation described is fine, since the app's own choice buttons and feedback text carry the teaching content.

## How these get inserted
Once you have the exported MP4 files, send them over and they can be dropped into a `<video>` placeholder on each "Try It" scenario page, right above the multiple-choice responses.
