import type { CSSProperties, ReactNode } from "react";

const CORE_SKILL_IDX: Record<number, number> = { 7: 1, 8: 2, 9: 3, 10: 4, 11: 5, 12: 6 };
const TITLES: Record<number, string> = {
  0: "Why De-Escalation Matters",
  1: "Before We Respond: Bias, Privilege & Power",
  2: "Cultural Humility",
  2.1: "Not the Same as Cultural Competence",
  2.2: "Cultural Humility in Practice",
  3: "Common Triggers: Circumstances",
  4: "Common Triggers: Inner State",
  5: "Early Warning Signs",
  6: "Unintentional Escalation",
  7: "Stay Calm & Controlled",
  8: "Show Respect & Empathy",
  9: "Use Simple & Clear Communication",
  10: "Maintain a Safe Space",
  11: "Offer Choices, if Possible",
  12: "Non-Verbal Awareness",
  13: "Safety & Boundaries",
  13.1: "Safety & Boundaries: Team & Limits",
  14: "After the Crisis: Debrief & Document",
  15: "After the Crisis: Support & Reconnect",
  16: "Key Takeaways",
  17: "Resource Hub",
};

function Header({
  number,
  idx,
  title,
  sectionWord,
  ofWord,
  coreSkillWord,
}: {
  number: number;
  idx: number;
  title: string;
  sectionWord: string;
  ofWord: string;
  coreSkillWord: string;
}) {
  const isCoreSkill = idx in CORE_SKILL_IDX;
  const badgeBg = isCoreSkill ? "var(--color-accent-2)" : "var(--color-accent)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
      <div className="sec-badge" style={{ background: badgeBg }}>{number}</div>
      <div>
        <div className="card-kicker" style={{ marginBottom: 2 }}>
          {sectionWord} {number} {ofWord} 21{isCoreSkill ? ` · ${coreSkillWord} ${CORE_SKILL_IDX[idx]}` : ""}
        </div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 28, margin: 0, color: idx === 0 ? "var(--color-accent-900)" : undefined }}>
          {title}
        </h1>
      </div>
    </div>
  );
}

const bodyP: CSSProperties = { maxWidth: "100ch", fontSize: 16, lineHeight: 1.6 };
const iconCardStyle: CSSProperties = {
  background: "#fff", borderRadius: 8, boxShadow: "0 4px 8px rgba(0,0,0,0.05)", padding: 20,
  display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "var(--space-2)",
};

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-900)" strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export function LessonSection({
  idx,
  number,
  sectionWord,
  ofWord,
  coreSkillWord,
  onGoReferences,
}: {
  idx: number;
  number: number;
  sectionWord: string;
  ofWord: string;
  coreSkillWord: string;
  onGoReferences: () => void;
}) {
  const title = TITLES[idx] ?? "";
  const headerProps = { number, idx, title, sectionWord, ofWord, coreSkillWord };

  switch (idx) {
    case 0:
      return (
        <>
          <Header {...headerProps} />
          <p style={{ ...bodyP, marginBottom: "var(--space-3)", color: "var(--color-accent-900)" }}>
            De-escalation is a set of strategies used to reduce the intensity of conflict, agitation, or distress, to create safety, restore calm, and prevent harm, without the need for physical intervention.
          </p>
          <p style={{ ...bodyP, marginBottom: "var(--space-6)", color: "var(--color-accent-900)" }}>
            It&apos;s especially important in healthcare, where patients may be vulnerable, scared, or in crisis.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: "var(--space-4)" }}>
            <div style={iconCardStyle}>
              <Icon><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></Icon>
              <div className="card-kicker" style={{ color: "var(--color-accent-900)" }}>Protects</div>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: "var(--color-accent-900)" }}>The safety of patients, staff, and visitors.</p>
            </div>
            <div style={iconCardStyle}>
              <Icon>
                <path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /><path d="m21 3 1 11h-2" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /><path d="M3 4h8" />
              </Icon>
              <div className="card-kicker" style={{ color: "var(--color-accent-900)" }}>Preserves</div>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: "var(--color-accent-900)" }}>The dignity of individuals experiencing stress, confusion, or agitation.</p>
            </div>
            <div style={iconCardStyle}>
              <Icon>
                <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" /><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" /><path d="m2 15 6 6" /><path d="M19.8 17.8a2 2 0 0 0 3.4-1.4V9a2 2 0 0 0-2-2h-5.8" />
              </Icon>
              <div className="card-kicker" style={{ color: "var(--color-accent-900)" }}>Supports</div>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: "var(--color-accent-900)" }}>Therapeutic relationships by showing empathy and respect.</p>
            </div>
            <div style={iconCardStyle}>
              <Icon><rect x={8} y={2} width={8} height={4} rx={1} /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></Icon>
              <div className="card-kicker" style={{ color: "var(--color-accent-900)" }}>Meets</div>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: "var(--color-accent-900)" }}>Compliance &amp; best-practice standards (CMS, OSHA, Joint Commission, etc.)</p>
            </div>
          </div>
        </>
      );

    case 1:
      return (
        <>
          <Header {...headerProps} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/photos/section-bias.webp" alt="A staff member speaking with a patient" style={{ width: "100%", height: 320, borderRadius: 16, objectFit: "cover", marginBottom: "var(--space-5)" }} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-5)", marginTop: 15, fontSize: 16 }}>
            Before diving into techniques, it&apos;s important to understand the dynamics we may not be consciously considering, dynamics that shape how we approach situations, perceive others, and the assumptions we carry.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
            <div className="card">
              <div style={numBubble("var(--color-accent-100)", "var(--color-accent-700)")}>1</div>
              <div className="card-title" style={{ fontSize: 18 }}>Internal Bias</div>
              <p className="card-body" style={{ fontSize: 16 }}>Automatic thoughts, stereotypes, or assumptions we may hold about others, even when we consciously believe in fairness. Cultural humility asks us to continually examine our own position and acknowledge how power, privilege, and prejudice might affect our perceptions and responses, especially during conflict.</p>
            </div>
            <div className="card">
              <div style={numBubble("var(--color-accent-2-100)", "var(--color-accent-2-700)")}>2</div>
              <div className="card-title" style={{ fontSize: 18 }}>Systemic Influence</div>
              <p className="card-body" style={{ fontSize: 16 }}>Not every reaction is about this moment alone. Many people carry experiences shaped by racism, homophobia, sexism, ableism, or classism that affect how safe or respected they feel in healthcare settings. Someone who has faced past discrimination may approach staff with mistrust or fear, an echo of past harm, not necessarily this interaction. Responding with empathy rather than judgment helps rebuild trust.</p>
            </div>
          </div>
          <div className="card" style={{ marginBottom: "var(--space-6)" }}>
            <div style={numBubble("var(--color-accent-100)", "var(--color-accent-700)")}>3</div>
            <div className="card-title" style={{ fontSize: 18 }}>Power Dynamics</div>
            <p className="card-body" style={{ fontSize: 16 }}>Authority, influence, and control naturally differ by role, knowledge, and access to resources, some structure is necessary for safety and care. But when power is unbalanced or used without awareness, it can create tension, fear, or resistance in someone who already feels vulnerable. Recognizing how your position, tone, and actions shape another person&apos;s sense of control helps you reduce defensiveness and build collaboration. Physical presence is part of this too, being taller, larger, or standing over someone can unintentionally read as intimidating, regardless of intent; and in some interactions, who responds (for example, matching staff gender to a patient&apos;s comfort level) can itself lower tension.</p>
          </div>
        </>
      );

    case 2:
      return (
        <>
          <Header {...headerProps} />
          <p style={{ ...bodyP, marginBottom: "var(--space-2)" }}>
            Every patient brings their own background, language, and history with the healthcare system into the room. Those factors shape how they express pain, fear, or frustration, and how safe they feel speaking up.
          </p>
          <div className="card" style={{ marginBottom: "var(--space-4)", marginTop: 20 }}>
            <div className="card-title" style={{ fontSize: 22 }}>Cultural humility isn&apos;t about knowing all cultures.</div>
            <p className="card-body" style={{ fontSize: 16 }}>It&apos;s about knowing you have blind spots, and choosing to stay open, curious, and respectful when someone&apos;s experience doesn&apos;t match your own.</p>
          </div>
          <p style={bodyP}>Practicing cultural humility means checking your own assumptions before reacting to someone else&apos;s behavior. A response that feels &quot;difficult&quot; to you may simply reflect a different way of communicating distress.</p>
        </>
      );

    case 2.1:
      return (
        <>
          <Header {...headerProps} />
          <p style={{ maxWidth: "100ch", fontSize: 16, marginBottom: "var(--space-5)" }}>
            Cultural humility is not about mastering facts about every culture you might encounter; that&apos;s an impossible, moving target. It&apos;s not just about being &quot;culturally competent,&quot; but about remaining teachable and respectful.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
            <div className="card">
              <div className="card-title" style={{ fontSize: 18, textAlign: "center" }}>Cultural Competence</div>
              <p className="card-body" style={{ fontSize: 15 }}>Treated as a checklist of facts to learn about other groups, implying an endpoint you can reach and &quot;know.&quot;</p>
            </div>
            <div className="card">
              <div className="card-title" style={{ fontSize: 18, textAlign: "center" }}>Cultural Humility</div>
              <p className="card-body" style={{ fontSize: 15 }}>An ongoing practice of self-evaluation and self-critique, staying curious about what you don&apos;t know, especially about your own biases.</p>
            </div>
          </div>
          <p style={bodyP}>This distinction matters most in the moment, not just in training. In a tense interaction, reaching for a memorized fact about someone&apos;s background can lead to stereotyping. Staying humble means asking, listening, and adjusting instead.</p>
        </>
      );

    case 2.2:
      return (
        <>
          <Header {...headerProps} />
          <div className="card-kicker" style={{ marginBottom: "var(--space-2)", fontSize: 15 }}>Putting it into practice</div>
          <ul style={{ margin: "0 0 var(--space-5)", paddingLeft: "var(--space-5)", display: "grid", gap: "var(--space-2)", fontSize: 16 }}>
            <li>Avoid assumptions about how a patient &quot;should&quot; behave, cultural expressions of distress vary.</li>
            <li>Ask instead of assume: &quot;Is there a way I can explain this better for you?&quot; or &quot;Would you prefer a different language or interpreter?&quot;</li>
            <li>Be aware of power and identity; patients from marginalized communities may escalate faster if they feel ignored, judged, or dismissed based on past experience.</li>
            <li>Normalize emotion without labeling behavior as &quot;aggressive&quot; based only on tone or volume.</li>
          </ul>
          <div className="card" style={{ marginBottom: "var(--space-6)", background: "var(--color-accent-2-100)", marginTop: 30 }}>
            <div className="card-kicker" style={{ fontSize: 16 }}>In practice</div>
            <p className="card-body" style={{ fontSize: 16 }}>A patient communicates in a way that feels unusually indirect or formal to you. Assuming they&apos;re being evasive shuts down trust. Recognizing this may simply be how they communicate and adjusting your approach with patience keeps the door open.</p>
          </div>
        </>
      );

    case 3:
      return (
        <>
          <Header {...headerProps} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/photos/section-triggers.webp" alt="A busy clinic waiting room" style={{ width: "100%", height: 320, borderRadius: 16, objectFit: "cover", marginBottom: "var(--space-5)" }} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-5)" }}>We may never know exactly why someone is reacting the way they are. Recognizing common triggers helps us move toward a solutions-based approach rather than a defensive one. Some triggers come from the circumstances of the visit itself.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-title" style={{ fontSize: 16 }}>Long wait times</div><p className="card-body" style={{ fontSize: 14 }}>Not being seen on time, others called ahead (perceived), no clear communication about the wait.</p></div>
            <div className="card" style={{ background: "var(--color-accent-2-100)" }}><div className="card-title" style={{ fontSize: 16 }}>Communication breakdowns</div><p className="card-body" style={{ fontSize: 14 }}>Conflicting instructions, medical jargon, staff appearing rushed or dismissive, discussing patients in public spaces.</p></div>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-title" style={{ fontSize: 16 }}>Billing &amp; insurance issues</div><p className="card-body" style={{ fontSize: 14 }}>Surprise costs, denials, and frustration with payment processes.</p></div>
            <div className="card" style={{ background: "var(--color-accent-2-100)" }}><div className="card-title" style={{ fontSize: 16 }}>Perceived rudeness or judgment</div><p className="card-body" style={{ fontSize: 14 }}>Short responses, lack of eye contact, being asked to repeat themselves, being &quot;corrected,&quot; tone and body language.</p></div>
          </div>
        </>
      );

    case 4:
      return (
        <>
          <Header {...headerProps} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-5)", fontSize: 16 }}>Triggers can come from many places, not just externally. What a person is carrying internally, like fear, pain, or a condition that changes how they process the moment can impact how someone perceives and interacts with the their environment.</p>
          <div style={{ display: "grid", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
            <div style={rowCard("var(--color-accent-100)")}>
              <div style={roundIcon}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-700)" strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6v6l4 2" /></svg></div>
              <div><div className="card-title" style={{ fontSize: 18 }}>Fear, pain, or anxiety</div><p className="card-body" style={{ fontSize: 16 }}>Fear of diagnosis or treatment, physical discomfort, fear of being ignored, forgotten, or judged.</p></div>
            </div>
            <div style={rowCard("var(--color-accent-2-100)")}>
              <div style={roundIcon}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2-700)" strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={9} /><path d="M9 12h6" /></svg></div>
              <div><div className="card-title" style={{ fontSize: 18 }}>Perceived lack of control</div><p className="card-body" style={{ fontSize: 16 }}>Being told what to do with no reason, no options offered, feeling talked down to, receiving negative news.</p></div>
            </div>
            <div style={rowCard("var(--color-accent-100)")}>
              <div style={roundIcon}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-700)" strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /></svg></div>
              <div><div className="card-title" style={{ fontSize: 18 }}>Behavioral health / substance use</div><p className="card-body" style={{ fontSize: 16 }}>Withdrawal symptoms, hallucinations or delusions, executive-functioning difficulty (e.g., waiting), feeling misunderstood.</p></div>
            </div>
          </div>
        </>
      );

    case 5:
      return (
        <>
          <Header {...headerProps} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-5)", fontSize: 16 }}>Spotting these signs early is one of the best ways to address a situation before it escalates further. Everyone shows signs of how they&apos;re feeling, whether they notice it or not.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
            <div className="card" style={{ background: "var(--color-accent-100)", alignItems: "center", textAlign: "center" }}><div className="card-title" style={{ fontSize: 18 }}>Verbal indicators</div><p className="card-body" style={{ fontSize: 16, textAlign: "center" }}>Changes in tone (more direct, curt, or louder) passive or aggressive remarks, sarcasm.</p></div>
            <div className="card" style={{ background: "var(--color-accent-2-100)", textAlign: "center" }}><div className="card-title" style={{ fontSize: 18 }}>Non-verbal behaviors</div><p className="card-body" style={{ fontSize: 16 }}>Fidgeting, restlessness, clenched fists, pacing, stiff posture, deep sighs, tapping hands or feet.</p></div>
            <div className="card" style={{ background: "var(--color-accent-100)", textAlign: "center" }}><div className="card-title" style={{ fontSize: 18 }}>Facial expressions</div><p className="card-body" style={{ fontSize: 16 }}>Eye rolling, narrowed eyes, grinding teeth, a forced or insincere smile, flushed face, pursed lips.</p></div>
            <div className="card" style={{ background: "var(--color-accent-2-100)", textAlign: "center" }}><div className="card-title" style={{ fontSize: 18 }}>Emotional indicators</div><p className="card-body" style={{ fontSize: 16 }}>Irritability, impatience, visible frustration, verbal cues like &quot;you&apos;re not listening.&quot;</p></div>
            <div className="card" style={{ background: "var(--color-accent-100)", alignItems: "center", textAlign: "center" }}><div className="card-title" style={{ fontSize: 18 }}>Boundary testing</div><p className="card-body" style={{ fontSize: 16, textAlign: "center" }}>Interrupting staff, questioning rules repeatedly, pushing back subtly or aggressively.</p></div>
          </div>
        </>
      );

    case 6:
      return (
        <>
          <Header {...headerProps} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-5)", fontSize: 16 }}>We can escalate a situation without meaning to, usually when we&apos;re not mindful of how we deliver information, verbally or non-verbally.</p>
          <div style={{ display: "grid", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-title" style={{ fontSize: 18 }}>Tone &amp; dismissiveness</div><p className="card-body" style={{ fontSize: 16 }}>A sharp, rushed tone (&quot;What&apos;s the problem now?&quot;); minimizing language (&quot;It&apos;s not that bad,&quot; &quot;we already explained this&quot;); rapid-fire jargon with no translation.</p></div>
            <div className="card" style={{ background: "var(--color-accent-2-100)" }}><div className="card-title" style={{ fontSize: 18 }}>Talking about the patient, not to them</div><p className="card-body" style={{ fontSize: 16 }}>Labels like &quot;non-compliant&quot; or &quot;dramatic&quot; said within earshot, or arguing over small details (&quot;it wasn&apos;t three hours, it was two&quot;) can feel invalidating.</p></div>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-title" style={{ fontSize: 18 }}>Body language</div><p className="card-body" style={{ fontSize: 16 }}>Standing over someone, crossed arms, lack of eye contact or turning your back, sighing or checking the clock, moving too close without consent.</p></div>
            <div className="card" style={{ background: "var(--color-accent-2-100)" }}><div className="card-title" style={{ fontSize: 18 }}>Control, rules &amp; boundaries</div><p className="card-body" style={{ fontSize: 16 }}>Quoting policy before acknowledging feelings, sudden changes with no preparation, or casual threats (&quot;I&apos;ll have to call security&quot;).</p></div>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-title" style={{ fontSize: 18 }}>Documentation &amp; side conversations</div><p className="card-body" style={{ fontSize: 16 }}>Charting language a patient may later read, venting at the nurses&apos; station within earshot, promising a follow-up and not returning, or inconsistent limits between staff.</p></div>
          </div>
        </>
      );

    case 7:
      return (
        <>
          <Header {...headerProps} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/photos/section-calm.webp" alt="A calm staff interaction" style={{ width: "100%", height: 320, borderRadius: 16, objectFit: "cover", marginBottom: "var(--space-5)" }} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-2)", fontSize: 16 }}>You can&apos;t control someone else&apos;s behavior, but you can control yours, and the energy you bring into the room. Calm isn&apos;t passive; it&apos;s power with purpose. In a crisis, the other person&apos;s brain may be in fight, flight, or freeze mode; your calm presence signals they don&apos;t need to stay there.</p>
          <div className="card-kicker" style={{ margin: "var(--space-4) 0 var(--space-2)", fontSize: 18 }}>How to do it</div>
          <ul style={{ margin: "0 0 var(--space-6)", paddingLeft: "var(--space-5)", display: "grid", gap: 10, fontSize: 16 }}>
            <li><strong>Breathe intentionally</strong>, slow, steady breaths regulate your own body before you address others.</li>
            <li><strong>Lower your tone &amp; volume</strong>, speaking slowly and softly reduces the chance someone feels threatened. Silence can give the other person room to think.</li>
            <li><strong>Keep a neutral posture</strong>, hands visible and relaxed, arms uncrossed, a safe distance kept.</li>
            <li><strong>Name your own cues</strong>, notice a tight jaw or racing thoughts and reset in the moment.</li>
            <li><strong>Do a 3-count</strong>, it gives you a moment to choose your response instead of reacting.</li>
          </ul>
        </>
      );

    case 8:
      return (
        <>
          <Header {...headerProps} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-2)", fontSize: 16 }}>When tension is high, people often feel unheard or dismissed; that&apos;s where empathy makes the biggest impact. Showing empathy doesn&apos;t mean agreeing with someone&apos;s behavior; it means recognizing their emotion in the moment.</p>
          <div className="card-kicker" style={{ margin: "var(--space-4) 0 var(--space-2)", fontSize: 18 }}>How to do it</div>
          <ul style={{ margin: "0 0 var(--space-5)", paddingLeft: "var(--space-5)", display: "grid", gap: "var(--space-2)", fontSize: 16 }}>
            <li><strong>Treat every person with dignity</strong>, regardless of their behavior use their name, a polite tone, and give personal space.</li>
            <li><strong>Listen to understand, not to respond</strong>, look for the emotion driving the behavior: fear, frustration, or powerlessness.</li>
            <li><strong>Acknowledge feelings before addressing actions</strong>, instead of &quot;You need to calm down,&quot; try &quot;I can see this is really upsetting, let&apos;s figure out how to make this better.&quot;</li>
            <li><strong>Use validating language</strong>, &quot;I can see this is really upsetting for you&quot; lowers defensiveness without requiring agreement.</li>
            <li><strong>Respect personal space, culture, and autonomy</strong>, being mindful of someone&apos;s history shows cultural humility and helps prevent re-traumatization.</li>
          </ul>
          <div className="card" style={{ marginBottom: "var(--space-6)", background: "var(--color-accent-2-100)" }}>
            <div className="card-kicker" style={{ fontSize: 18 }}>In practice</div>
            <p className="card-body" style={{ fontSize: 16 }}>A patient snaps, &quot;You people never explain anything.&quot; Reacting with, &quot;That&apos;s not fair, I&apos;m right in the middle of it&quot; argues the point instead of the feeling. Try instead: &quot;You&apos;re right that this hasn&apos;t been explained well, let me slow down and walk through it with you.&quot; Empathy doesn&apos;t concede the facts; it concedes the frustration is real.</p>
          </div>
        </>
      );

    case 9:
      return (
        <>
          <Header {...headerProps} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-2)", fontSize: 16 }}>When someone is escalated, their ability to process information drops; even people who are usually calm and articulate can struggle with complex details. Clarity becomes a de-escalation tool.</p>
          <div className="card-kicker" style={{ margin: "var(--space-4) 0 var(--space-2)", fontSize: 18 }}>How to do it</div>
          <ul style={{ margin: "0 0 var(--space-6)", paddingLeft: "var(--space-5)", display: "grid", gap: "var(--space-2)", fontSize: 16 }}>
            <li><strong>Use short, simple sentences</strong>, instead of &quot;I need you to sit down so we can take your vitals and get your medication ready,&quot; try &quot;Let&apos;s start by sitting down together.&quot;</li>
            <li><strong>Avoid medical jargon</strong>, words like &quot;triage&quot; or &quot;compliance&quot; can sound confusing or intimidating. Plain language builds trust.</li>
            <li><strong>Give one instruction at a time</strong>, this reduces overwhelm and gives the person a sense of control.</li>
            <li><strong>Check for understanding</strong>, a quick &quot;Does that make sense so far?&quot; catches confusion before it turns into frustration.</li>
            <li><strong>Slow your pace, not just your words</strong>, rushed delivery can undercut even the simplest sentence.</li>
          </ul>
          <div className="card" style={{ marginBottom: "var(--space-6)", background: "var(--color-accent-2-100)" }}>
            <div className="card-kicker" style={{ fontSize: 18 }}>In practice</div>
            <p className="card-body" style={{ fontSize: 16 }}>Instead of &quot;Your labs are pending so we can&apos;t finalize discharge until the attending reviews and signs off,&quot; try: &quot;We&apos;re waiting on one more result. Once it&apos;s back, the doctor signs off and you&apos;re free to go.&quot; Same information, far less to process under stress.</p>
          </div>
        </>
      );

    case 10:
      return (
        <>
          <Header {...headerProps} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/photos/section-space.webp" alt="An open exam room" style={{ width: "100%", height: 320, borderRadius: 16, objectFit: "cover", marginBottom: "var(--space-5)" }} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-2)", fontSize: 16 }}>Physical space communicates as much as words. When someone feels cornered or physically overpowered, their brain shifts into survival mode. Our goal is to reduce that sense of threat.</p>
          <div className="card-kicker" style={{ margin: "var(--space-4) 0 var(--space-2)", fontSize: 18 }}>How to do it</div>
          <ul style={{ margin: 0, paddingLeft: "var(--space-5)", display: "grid", gap: "var(--space-2)", fontSize: 16 }}>
            <li><strong>Respect personal space</strong>, keep roughly two arm&apos;s lengths of distance when possible.</li>
            <li><strong>Keep exits visible and accessible</strong>, people feel safer, and are less likely to escalate, when they know they have a way out.</li>
            <li><strong>Avoid standing over or cornering someone</strong>, lower yourself slightly to eye level to reduce the power imbalance.</li>
          </ul>
          <p style={{ maxWidth: "65ch", marginTop: "var(--space-4)", opacity: 0.85, fontSize: 16, textAlign: "center" }}>
            <b style={{ fontStyle: "italic" }}>Safety is mutual, when the other person feels physically safe, you are safer too.</b>
          </p>
        </>
      );

    case 11:
      return (
        <>
          <Header {...headerProps} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-2)", fontSize: 16 }}>When someone is agitated, they&apos;ve often lost a sense of control. Offering choices, even small ones, helps restore their autonomy.</p>
          <div className="card-kicker" style={{ margin: "var(--space-4) 0 var(--space-2)", fontSize: 18 }}>How to do it</div>
          <ul style={{ margin: "0 0 var(--space-6)", paddingLeft: "var(--space-5)", display: "grid", gap: "var(--space-2)", fontSize: 16 }}>
            <li><strong>Frame requests as options</strong>, instead of &quot;You need to sit down,&quot; try &quot;Would you like to sit here or by the window?&quot; The task stays the same; the tone shifts to collaboration.</li>
            <li><strong>Allow the person to say &quot;no&quot; when it&apos;s safe to do so</strong>, this reduces their need to resist and lowers anxiety and defensiveness.</li>
            <li><strong>Reinforce autonomy while keeping clear boundaries</strong>, &quot;We can&apos;t continue while voices are raised, but we can step outside or take a short break, which would you prefer?&quot;</li>
            <li><strong>Keep choices real</strong>, only offer options you can actually honor; a hollow choice erodes trust faster than no choice at all.</li>
          </ul>
          <div className="card" style={{ marginBottom: "var(--space-6)", background: "var(--color-accent-2-100)" }}>
            <div className="card-kicker" style={{ fontSize: 18 }}>In practice</div>
            <p className="card-body" style={{ fontSize: 16 }}>A patient refuses a blood draw. Rather than &quot;We need this before you can be seen,&quot; try: &quot;We do need a sample to move forward, would you rather we draw from this arm, or would sitting help more than lying down?&quot; The requirement stays; how it happens is theirs to shape.</p>
          </div>
        </>
      );

    case 12:
      return (
        <>
          <Header {...headerProps} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-2)", fontSize: 16 }}>Body language often communicates more than words. People in distress are hyper-aware of non-verbal cues, so how we carry ourselves can calm or escalate a situation just as much as what we say.</p>
          <div className="card-kicker" style={{ margin: "var(--space-4) 0 var(--space-2)", fontSize: 18 }}>How to do it</div>
          <ul style={{ margin: "0 0 var(--space-6)", paddingLeft: "var(--space-5)", display: "grid", gap: "var(--space-2)", fontSize: 16 }}>
            <li><strong>Open posture</strong>, hands visible, arms uncrossed; slow, deliberate movements read as calm rather than rushed or aggressive.</li>
            <li><strong>Balanced eye contact</strong>, brief and respectful; too little seems dismissive, too much can feel confrontational.</li>
            <li><strong>Watch your own cues</strong>, sighing, eye-rolling, or checking your watch can signal impatience or disrespect, even unintentionally.</li>
            <li><strong>Match energy down, not up</strong>, a lowered voice and relaxed shoulders invite the other person to mirror you rather than escalate further.</li>
          </ul>
          <div className="card" style={{ marginBottom: "var(--space-6)", background: "var(--color-accent-2-100)" }}>
            <div className="card-kicker" style={{ fontSize: 18 }}>In practice</div>
            <p className="card-body" style={{ fontSize: 16 }}>You&apos;re rushing between rooms and arrive short of breath, arms full. Before speaking, pause at the door for one breath and let your shoulders drop; patients read your entrance before they hear a word you say.</p>
          </div>
        </>
      );

    case 13:
      return (
        <>
          <Header {...headerProps} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/photos/section-safety.webp" alt="Workplace safety" style={{ width: "100%", height: 320, borderRadius: 16, objectFit: "cover", marginBottom: "var(--space-5)" }} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-5)", fontSize: 16 }}>Safety is the foundation of de-escalation, for both staff and the individual in distress. De-escalation isn&apos;t about forcing calm, it&apos;s about guiding it, only when it&apos;s safe to do so. Our goal is to reduce risk, not to win an argument.</p>
          <div style={{ display: "grid", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-title" style={{ fontSize: 18 }}>Know when to disengage</div><p className="card-body" style={{ fontSize: 16 }}>If behavior becomes threatening, yelling aggressively, physical threats, closing distance unsafely, it&apos;s appropriate to step back. Calmly explain you&apos;ll return once everyone can communicate safely.</p></div>
            <div className="card" style={{ background: "var(--color-accent-2-100)" }}><div className="card-title" style={{ fontSize: 18 }}>Follow safety protocols</div><p className="card-body" style={{ fontSize: 16 }}>Always follow your organization&apos;s protocols: activating an alert system, calling a supervisor, or using a team response.</p></div>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-title" style={{ fontSize: 18 }}>Maintain environmental awareness</div><p className="card-body" style={{ fontSize: 16 }}>Know your exits, keep a clear path to the door, and avoid corners or getting boxed in behind desks.</p></div>
          </div>
        </>
      );

    case 13.1:
      return (
        <>
          <Header {...headerProps} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-5)", fontSize: 16 }}>Safety also depends on the team around you, and on limits that protect everyone without shutting the conversation down.</p>
          <div style={{ display: "grid", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-title" style={{ fontSize: 18 }}>Use team communication</div><p className="card-body" style={{ fontSize: 16 }}>Use code phrases to alert coworkers when you sense tension building, de-escalation works best as a team process.</p></div>
            <div className="card" style={{ background: "var(--color-accent-2-100)" }}><div className="card-title" style={{ fontSize: 18 }}>Set firm, respectful limits</div><p className="card-body" style={{ fontSize: 16 }}>Boundaries don&apos;t shut people down, they make space safe enough for real connection. &quot;I want to continue this conversation, but I can&apos;t do that while voices are raised.&quot;</p></div>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-title" style={{ fontSize: 18 }}>Involve law enforcement only as a last resort</div><p className="card-body" style={{ fontSize: 16 }}>Reserved for when safety truly can&apos;t be maintained. Debrief with your team afterward, and continue to treat the individual with dignity, even during a crisis response.</p></div>
          </div>
        </>
      );

    case 14:
      return (
        <>
          <Header {...headerProps} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-5)", fontSize: 16 }}>A crisis doesn&apos;t end the moment behavior calms down. What happens in the minutes and days after shapes whether the next interaction for you, your team, and the patient is safer.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
            <div className="card" style={{ background: "var(--color-accent-100)", textAlign: "center" }}><div className="card-title" style={{ fontSize: 18 }}>Debrief as a team</div><p className="card-body" style={{ fontSize: 16 }}>Talk through what happened while it&apos;s fresh: what worked, what didn&apos;t, and what you&apos;d try differently next time. This isn&apos;t blame; it&apos;s how teams get better together.</p></div>
            <div className="card" style={{ background: "var(--color-accent-2-100)", textAlign: "center" }}><div className="card-title" style={{ fontSize: 18 }}>Document thoroughly</div><p className="card-body" style={{ fontSize: 16 }}>Factual, detailed notes: what was observed, what was said and done, and the outcome.</p></div>
            <div className="card" style={{ background: "var(--color-accent-100)", textAlign: "center" }}><div className="card-title" style={{ fontSize: 18 }}>Report through the proper channel</div><p className="card-body" style={{ fontSize: 16 }}>Reporting incidents (even ones that didn&apos;t require security or law enforcement) helps CHCR track patterns and catch emerging risks early.</p></div>
          </div>
        </>
      );

    case 15:
      return (
        <>
          <Header {...headerProps} />
          <p style={{ maxWidth: "65ch", marginBottom: "var(--space-5)", fontSize: 16 }}>Recovery isn&apos;t only paperwork, it&apos;s people, too.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-title" style={{ fontSize: 18 }}>Support each other</div><p className="card-body" style={{ fontSize: 16 }}>A tense encounter can take an emotional toll even when nothing &quot;bad&quot; happened. Lean on your team, your supervisor, or your Employee Assistance Program.</p></div>
            <div className="card" style={{ background: "var(--color-accent-2-100)" }}><div className="card-title" style={{ fontSize: 18 }}>Reconnect when it&apos;s safe to</div><p className="card-body" style={{ fontSize: 16 }}>Where appropriate, revisit the relationship with the patient. Most people don&apos;t want to be defined by their hardest moment, and a respectful follow-up rebuilds trust.</p></div>
          </div>
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-4)", opacity: 0.85, fontSize: 16 }}>After any tense encounter, walk through these four questions with your team, alone, or out loud.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-kicker" style={{ fontSize: 18 }}>1. What happened?</div><p className="card-body" style={{ fontSize: 16 }}>Just the facts: what led up to it, and what occurred.</p></div>
            <div className="card" style={{ background: "var(--color-accent-2-100)" }}><div className="card-kicker" style={{ fontSize: 18 }}>2. What went well?</div><p className="card-body" style={{ fontSize: 16 }}>Name what you or your team did that helped.</p></div>
            <div className="card" style={{ background: "var(--color-accent-2-100)" }}><div className="card-kicker" style={{ fontSize: 18 }}>3. What would we improve?</div><p className="card-body" style={{ fontSize: 16 }}>What would you try differently next time?</p></div>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-kicker" style={{ fontSize: 18 }}>4. What did we learn?</div><p className="card-body" style={{ fontSize: 16 }}>What does this tell you about this patient, or about your own practice?</p></div>
          </div>
        </>
      );

    case 16:
      return (
        <>
          <Header {...headerProps} />
          <p style={{ maxWidth: "100ch", marginBottom: "var(--space-4)", fontSize: 16 }}>This isn&apos;t about control; it&apos;s about making connections. The way we show up often determines how safe and supported someone feels. Every person we encounter carries their own story; de-escalation is about responding with professionalism, empathy, and calm, not about fixing someone.</p>
          <ul style={{ margin: "0 0 var(--space-6)", paddingLeft: "var(--space-5)", display: "grid", gap: "var(--space-2)", fontSize: 16 }}>
            <li>Staying calm and respectful helps stabilize the situation.</li>
            <li>Validating and listening helps people feel seen.</li>
            <li>Clear boundaries and safety protect everyone involved.</li>
            <li>De-escalation takes practice, it&apos;s okay not to get it perfect. What matters is your awareness and effort to keep learning.</li>
            <li>Successful de-escalation preserves dignity, theirs and yours, and helps every interaction end a little safer and a little more human.</li>
          </ul>
          <div style={{ textAlign: "center", padding: "var(--space-6)", background: "var(--color-accent-2-100)", borderRadius: "var(--radius-lg)" }}>
            <p className="card-body" style={{ fontStyle: "italic", fontSize: 20, fontFamily: "var(--font-heading)", fontWeight: 400, color: "var(--color-accent-2-700)", margin: 0 }}>
              &quot;De-escalation begins where judgment ends when we choose to connect instead of control.&quot;
            </p>
          </div>
        </>
      );

    case 17:
      return (
        <>
          <Header {...headerProps} />
          <div className="card-kicker" style={{ marginBottom: "var(--space-2)", fontSize: 18 }}>Quick Reference: The 5-Step Cycle</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-kicker" style={{ fontSize: 16 }}>RECOGNIZE</div><p className="card-body" style={{ fontSize: 14 }}>Identify signs of escalation through body language and vocal tone.</p></div>
            <div className="card" style={{ background: "var(--color-accent-2-100)" }}><div className="card-kicker" style={{ fontSize: 16 }}>RESPOND</div><p className="card-body" style={{ fontSize: 14 }}>Use a calm voice, listen actively, and acknowledge feelings without judgment.</p></div>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-kicker" style={{ fontSize: 16 }}>SET LIMITS</div><p className="card-body" style={{ fontSize: 14 }}>Establish clear boundaries and offer choices, ensuring a sense of control.</p></div>
            <div className="card" style={{ background: "var(--color-accent-2-100)" }}><div className="card-kicker" style={{ fontSize: 16 }}>ENGAGE NON-VERBALLY</div><p className="card-body" style={{ fontSize: 14 }}>Maintain an open posture and relaxed facial expression to promote safety.</p></div>
            <div className="card" style={{ background: "var(--color-accent-100)" }}><div className="card-kicker" style={{ fontSize: 16 }}>REFLECT &amp; LEARN</div><p className="card-body" style={{ fontSize: 14 }}>Debrief, document, and prioritize self-care for future improvement.</p></div>
          </div>
          <div className="card elev-md" style={{ padding: "var(--space-6)", display: "grid", gridTemplateColumns: "auto 1fr", gap: "var(--space-6)", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/resource-hub-qr.png" alt="QR code to the online Resource Hub" style={{ width: 120, height: 120, borderRadius: "var(--radius-lg)" }} />
            <div>
              <div className="card-kicker" style={{ fontSize: 16 }}>Resource Hub</div>
              <p className="card-body" style={{ marginBottom: "var(--space-3)", fontSize: 14 }}>Questions after this course? Reach out to Stavros E. Delardas, LCSW, PMH-C, CLC, or your facility&apos;s Workplace Safety &amp; Infection Control Committee. Scan the code for the full online resources hub.</p>
              <button type="button" className="btn btn-ghost" style={{ paddingLeft: 0 }} onClick={onGoReferences}>View References →</button>
            </div>
          </div>
        </>
      );

    default:
      return null;
  }
}

function numBubble(bg: string, color: string): CSSProperties {
  return {
    width: 36, height: 36, borderRadius: 999, background: bg, color,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-heading)", marginBottom: "var(--space-2)",
  };
}
function rowCard(bg: string): CSSProperties {
  return { display: "flex", gap: "var(--space-4)", alignItems: "flex-start", padding: "var(--space-4)", background: bg, borderRadius: "var(--radius-lg)" };
}
const roundIcon: CSSProperties = { width: 40, height: 40, borderRadius: 999, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
