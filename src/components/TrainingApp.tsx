"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { LessonSection } from "./LessonSections";
import { useReadAloud } from "@/lib/speech";
import {
  CONTENT_STEP_COUNT,
  GAME_TEXT_ES,
  Language,
  PASSING_SCORE,
  QUESTIONS,
  QUESTIONS_ES,
  RELATED_ES,
  SAY_THIS_NOT_THAT_GAME,
  SCENARIO_BANK,
  SCENARIO_BANK_ES,
  STEPS,
  UI,
  shuffle,
} from "@/lib/content";

type Screen =
  | "welcome"
  | "facilitatorPage"
  | "aboutChcr"
  | "references"
  | "pretest"
  | "lesson"
  | "posttest"
  | "results"
  | "facilitatorLogin"
  | "facilitatorDashboard";

type GameCatId = "say" | "notSay";

interface ServerResult {
  preCorrectCount: number;
  preTotal: number;
  postCorrectCount: number;
  postTotal: number;
  passed: boolean;
}

interface CompletionRecord {
  id: string;
  name: string;
  email: string;
  preScore: number;
  postScore: number;
  passed: boolean;
  completedAt: string;
}

interface AssignmentRecord {
  id: string;
  name: string | null;
  email: string;
  assignedAt: string;
  lastRemindedAt: string | null;
  reminderCount: number;
  completedAt: string | null;
}

const ARROW = (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export function TrainingApp() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [prevScreen, setPrevScreen] = useState<Screen>("welcome");
  const [language, setLanguage] = useState<Language>("en");

  const [learnerName, setLearnerName] = useState("");
  const [learnerEmail, setLearnerEmail] = useState("");
  const [startedAt, setStartedAt] = useState<string | null>(null);

  const [pretestAnswers, setPretestAnswers] = useState<Record<number, number>>({});
  const [posttestAnswers, setPosttestAnswers] = useState<Record<number, number>>({});
  const [lessonIndex, setLessonIndex] = useState(0);
  const [scenarioChoices, setScenarioChoices] = useState<Record<string, number>>({});

  const [gameOrder, setGameOrder] = useState<string[]>(() => shuffle(SAY_THIS_NOT_THAT_GAME.statements.map((s) => s.id)));
  const [gameAssignments, setGameAssignments] = useState<Record<string, GameCatId>>({});
  const [gameDraggingId, setGameDraggingId] = useState<string | null>(null);
  const [gameDragOverCat, setGameDragOverCat] = useState<GameCatId | null>(null);

  const [serverResult, setServerResult] = useState<ServerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [facilitatorPasswordInput, setFacilitatorPasswordInput] = useState("");
  const [facilitatorError, setFacilitatorError] = useState("");
  const [facilitatorBusy, setFacilitatorBusy] = useState(false);
  const [completions, setCompletions] = useState<CompletionRecord[] | null>(null);
  const [completionsError, setCompletionsError] = useState("");

  const [assignments, setAssignments] = useState<AssignmentRecord[] | null>(null);
  const [assignText, setAssignText] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignResult, setAssignResult] = useState<{ assigned: number; invalidLines: string[]; emailFailures: string[] } | { error: string } | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const { supported: speechSupported, speaking, speak, stop: stopReading } = useReadAloud();

  const ui = UI[language];
  const isPretest = screen === "pretest";
  const isLesson = screen === "lesson";
  const isPosttest = screen === "posttest";
  const isProgressVisible = isPretest || isLesson || isPosttest;

  const currentStep = isLesson ? STEPS[lessonIndex] : null;
  const contentSteps = STEPS.filter((s) => s.kind === "content");
  const contentNumber =
    currentStep && currentStep.kind === "content" ? contentSteps.indexOf(currentStep) + 1 : null;
  const sectionWord = language === "es" ? "Sección" : "Section";
  const ofWord = language === "es" ? "de" : "of";
  const coreSkillWord = language === "es" ? "Habilidad Clave" : "Core Skill";
  const relatedLabel =
    currentStep && currentStep.kind === "scenario"
      ? language === "es"
        ? RELATED_ES[currentStep.related] || currentStep.related
        : currentStep.related
      : null;
  const stepLabel = isPretest
    ? ui.pretestTitle
    : isLesson && currentStep
      ? currentStep.kind === "content"
        ? `${sectionWord} ${contentNumber} ${ofWord} ${CONTENT_STEP_COUNT}`
        : currentStep.kind === "practice"
          ? ui.practiceKicker
          : `${ui.tryIt} · ${relatedLabel}`
      : isPosttest
        ? ui.posttestTitle
        : "";
  const stepPct = isPretest ? 8 : isLesson ? Math.round(((lessonIndex + 1) / STEPS.length) * 80) + 8 : isPosttest ? 96 : 0;

  useEffect(() => {
    if (screen !== "facilitatorDashboard") return;
    let cancelled = false;
    fetch("/api/completions")
      .then(async (res) => {
        if (res.status === 401) {
          if (!cancelled) setScreen("facilitatorLogin");
          return;
        }
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        if (!cancelled) {
          setCompletions(data.completions);
          setCompletionsError("");
        }
      })
      .catch(() => {
        if (!cancelled) setCompletionsError("Could not load completion records.");
      });
    loadAssignments();
    return () => {
      cancelled = true;
    };
  }, [screen]);

  function loadAssignments() {
    fetch("/api/assignments")
      .then(async (res) => {
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        setAssignments(data.assignments);
      })
      .catch(() => {
        // Non-fatal — the completions table above is the primary view; leave
        // assignments as null so that section shows its own quiet error state.
      });
  }

  async function submitAssignments() {
    setAssigning(true);
    setAssignResult(null);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: assignText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAssignResult({ error: data.error || "Could not send assignments." });
        return;
      }
      setAssignResult(data);
      setAssignText("");
      loadAssignments();
    } catch {
      setAssignResult({ error: "Could not send assignments. Check your connection and try again." });
    } finally {
      setAssigning(false);
    }
  }

  // Stop any in-progress read-aloud when the learner navigates to a different
  // section, or away from the lesson screen entirely.
  useEffect(() => {
    return () => stopReading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonIndex, screen]);

  function toggleLanguage() {
    setLanguage((l) => (l === "en" ? "es" : "en"));
  }

  function beginTraining() {
    if (!learnerName.trim() || !learnerEmail.trim()) return;
    setStartedAt(new Date().toISOString());
    setScreen("pretest");
  }

  function submitPretest() {
    setScreen("lesson");
    setLessonIndex(0);
  }

  function prevLesson() {
    setLessonIndex((i) => Math.max(0, i - 1));
  }
  function nextLesson() {
    if (lessonIndex >= STEPS.length - 1) {
      setScreen("posttest");
    } else {
      setLessonIndex((i) => i + 1);
    }
  }

  function selectScenario(id: string, oi: number) {
    setScenarioChoices((s) => ({ ...s, [id]: oi }));
  }

  function assignStatement(id: string, cat: GameCatId) {
    setGameAssignments((s) => ({ ...s, [id]: cat }));
    setGameDraggingId(null);
    setGameDragOverCat(null);
  }
  function unassignStatement(id: string) {
    setGameAssignments((s) => {
      const next = { ...s };
      delete next[id];
      return next;
    });
  }

  async function submitPosttest() {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: learnerName,
          email: learnerEmail,
          language,
          preAnswers: pretestAnswers,
          postAnswers: posttestAnswers,
          startedAt,
        }),
      });
      if (!res.ok) {
        setSubmitError("Could not submit the post-test. Please try again.");
        return;
      }
      const data: ServerResult = await res.json();
      setServerResult(data);
      setScreen("results");
    } catch {
      setSubmitError("Could not submit the post-test. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function retakePosttest() {
    setPosttestAnswers({});
    setServerResult(null);
    setScreen("posttest");
  }

  function startOver() {
    setScreen("welcome");
    setLearnerName("");
    setLearnerEmail("");
    setStartedAt(null);
    setPretestAnswers({});
    setPosttestAnswers({});
    setLessonIndex(0);
    setScenarioChoices({});
    setGameAssignments({});
    setGameOrder(shuffle(SAY_THIS_NOT_THAT_GAME.statements.map((s) => s.id)));
    setServerResult(null);
  }

  function openFacilitatorLogin() {
    setPrevScreen(screen);
    setFacilitatorPasswordInput("");
    setFacilitatorError("");
    setScreen("facilitatorLogin");
  }

  async function submitFacilitatorLogin() {
    setFacilitatorBusy(true);
    setFacilitatorError("");
    try {
      const res = await fetch("/api/facilitator/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: facilitatorPasswordInput }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFacilitatorError(data.error || "Incorrect passcode.");
        return;
      }
      setFacilitatorPasswordInput("");
      setScreen("facilitatorDashboard");
    } catch {
      setFacilitatorError("Something went wrong. Try again.");
    } finally {
      setFacilitatorBusy(false);
    }
  }

  async function exitFacilitator() {
    if (screen === "facilitatorDashboard") {
      await fetch("/api/facilitator/logout", { method: "POST" }).catch(() => {});
      setCompletions(null);
      setScreen("welcome");
    } else {
      setScreen(prevScreen);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)", fontFamily: "var(--font-body)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-4) var(--space-6)", borderBottom: "1px solid var(--color-neutral-300)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/chcr-logo.png" alt="Community Health Center of Richmond" style={{ height: 36, width: "auto" }} />
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 20, borderLeft: "1px solid var(--color-neutral-300)", paddingLeft: "var(--space-4)" }}>
            {ui.courseTitle}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <button type="button" className="btn btn-ghost" onClick={toggleLanguage}>{ui.langToggle}</button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => (screen === "facilitatorDashboard" || screen === "facilitatorLogin" ? exitFacilitator() : openFacilitatorLogin())}
          >
            {screen === "facilitatorDashboard" || screen === "facilitatorLogin" ? ui.backToTraining : ui.adminToggle}
          </button>
        </div>
      </div>

      {isProgressVisible && (
        <div style={{ padding: "var(--space-3) var(--space-6)", background: "var(--color-neutral-100)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, opacity: 0.7, marginBottom: "var(--space-1)" }}>
            <span>{stepLabel}</span>
            <span>{stepPct}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "var(--color-neutral-300)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 999, background: "var(--color-accent)", width: `${stepPct}%` }} />
          </div>
        </div>
      )}

      <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: "var(--space-8) var(--space-4)" }}>
        <div style={{ width: "100%", maxWidth: 820 }}>
          {screen === "welcome" && (
            <WelcomeScreen
              ui={ui}
              learnerName={learnerName}
              learnerEmail={learnerEmail}
              onNameChange={setLearnerName}
              onEmailChange={setLearnerEmail}
              onBegin={beginTraining}
              onFacilitator={() => setScreen("facilitatorPage")}
              onAboutChcr={() => setScreen("aboutChcr")}
            />
          )}

          {screen === "facilitatorPage" && <FacilitatorPage ui={ui} onBack={() => setScreen("welcome")} />}
          {screen === "aboutChcr" && <AboutChcrPage ui={ui} onBack={() => setScreen("welcome")} />}
          {screen === "references" && <ReferencesPage ui={ui} onBack={() => setScreen("welcome")} />}

          {isPretest && (
            <QuizScreen
              ui={ui}
              kicker={ui.beforeBegin}
              title={ui.pretestTitle}
              intro={`${ui.pretestIntro}`}
              questions={language === "es" ? QUESTIONS_ES : QUESTIONS}
              answers={pretestAnswers}
              onSelect={(qi, oi) => setPretestAnswers((s) => ({ ...s, [qi]: oi }))}
              submitLabel={ui.submitPretest}
              onSubmit={submitPretest}
              namePrefix="pre"
            />
          )}

          {isLesson && currentStep && (
            <>
              {currentStep.kind === "content" && (
                <>
                  {speechSupported && (
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          if (speaking) {
                            stopReading();
                          } else if (sectionRef.current) {
                            const text = (sectionRef.current.textContent || "").replace(/\s+/g, " ").trim();
                            if (text) speak(text);
                          }
                        }}
                      >
                        {speaking ? (
                          <>
                            <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><rect x={6} y={5} width={4} height={14} /><rect x={14} y={5} width={4} height={14} /></svg>
                            {ui.stopReading}
                          </>
                        ) : (
                          <>
                            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                              <path d="M18.5 6a9 9 0 0 1 0 12" />
                            </svg>
                            {ui.readAloud}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                  <div ref={sectionRef}>
                    <LessonSection
                      idx={currentStep.idx}
                      number={contentNumber ?? 0}
                      sectionWord={sectionWord}
                      ofWord={ofWord}
                      coreSkillWord={coreSkillWord}
                      onGoReferences={() => setScreen("references")}
                    />
                  </div>
                </>
              )}
              {currentStep.kind === "scenario" && (
                <ScenarioView
                  ui={ui}
                  scenario={(language === "es" ? SCENARIO_BANK_ES : SCENARIO_BANK)[currentStep.id]}
                  related={relatedLabel ?? ""}
                  chosen={scenarioChoices[currentStep.id]}
                  onSelect={(oi) => selectScenario(currentStep.id, oi)}
                />
              )}
              {currentStep.kind === "practice" && (
                <GameView
                  ui={ui}
                  language={language}
                  ofWord={ofWord}
                  order={gameOrder}
                  assignments={gameAssignments}
                  draggingId={gameDraggingId}
                  dragOverCat={gameDragOverCat}
                  onDragStart={(id) => setGameDraggingId(id)}
                  onDragEnd={() => {
                    setGameDraggingId(null);
                    setGameDragOverCat(null);
                  }}
                  onDragOverCat={(cat) => setGameDragOverCat(cat)}
                  onDragLeaveCat={(cat) => setGameDragOverCat((c) => (c === cat ? null : c))}
                  onDrop={(id, cat) => assignStatement(id, cat)}
                  onRemove={unassignStatement}
                />
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
                <button type="button" className="btn btn-secondary" disabled={lessonIndex === 0} onClick={prevLesson}>
                  {ui.back_}
                </button>
                <button type="button" className="btn btn-primary" onClick={nextLesson}>
                  {lessonIndex >= STEPS.length - 1 ? ui.continueToPosttest : ui.next}
                </button>
              </div>
            </>
          )}

          {isPosttest && (
            <QuizScreen
              ui={ui}
              kicker={ui.finalCheck}
              title={ui.posttestTitle}
              intro={`${ui.posttestIntroPrefix}${PASSING_SCORE}${ui.posttestIntroSuffix}`}
              questions={language === "es" ? QUESTIONS_ES : QUESTIONS}
              answers={posttestAnswers}
              onSelect={(qi, oi) => setPosttestAnswers((s) => ({ ...s, [qi]: oi }))}
              submitLabel={submitting ? "…" : ui.submitPosttest}
              onSubmit={submitPosttest}
              submitDisabled={submitting}
              namePrefix="post"
            />
          )}
          {isPosttest && submitError && (
            <p style={{ color: "var(--color-accent-700)", fontSize: 13, marginTop: 8, textAlign: "right" }}>{submitError}</p>
          )}

          {screen === "results" && serverResult && (
            <ResultsView
              ui={ui}
              learnerName={learnerName}
              serverResult={serverResult}
              onRetake={retakePosttest}
              onStartOver={startOver}
            />
          )}

          {screen === "facilitatorLogin" && (
            <div className="card elev-md" style={{ padding: "var(--space-8)", maxWidth: 420, margin: "0 auto" }}>
              <div className="card-kicker">Restricted</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 24, marginBottom: "var(--space-2)" }}>Facilitator Access</div>
              <p className="card-body" style={{ marginBottom: "var(--space-4)" }}>
                This report contains learner names, emails, and scores. Enter the facilitator passcode to continue.
              </p>
              <div className="field" style={{ marginBottom: "var(--space-4)" }}>
                <label htmlFor="cq-admin-pass">Passcode</label>
                <input
                  className="input"
                  id="cq-admin-pass"
                  type="password"
                  value={facilitatorPasswordInput}
                  onChange={(e) => setFacilitatorPasswordInput(e.target.value)}
                  placeholder="Enter passcode"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitFacilitatorLogin();
                  }}
                />
              </div>
              {facilitatorError && (
                <p style={{ color: "var(--color-accent-700)", fontSize: 14, marginBottom: "var(--space-4)" }}>{facilitatorError}</p>
              )}
              <div style={{ display: "flex", gap: "var(--space-3)" }}>
                <button type="button" className="btn btn-primary" disabled={facilitatorBusy} onClick={submitFacilitatorLogin}>
                  {facilitatorBusy ? "Unlocking…" : "Unlock"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={exitFacilitator}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {screen === "facilitatorDashboard" && (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: 26 }}>Facilitator Report</div>
                {completions && completions.length > 0 && (
                  <button type="button" className="btn btn-secondary" onClick={() => exportCSV(completions)}>
                    Export CSV
                  </button>
                )}
              </div>
              <p style={{ opacity: 0.7, maxWidth: "65ch", marginBottom: "var(--space-6)" }}>
                This report lists every completion attempt recorded, across everyone who has taken the training.
              </p>
              {completionsError && <p style={{ color: "var(--color-accent-700)", fontSize: 13, marginBottom: 12 }}>{completionsError}</p>}
              {completions && completions.length > 0 && (
                <table className="table" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Pre-Test</th>
                      <th>Post-Test</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completions.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>{c.email}</td>
                        <td className="text-muted">{new Date(c.completedAt).toLocaleString()}</td>
                        <td>{c.preScore}/10</td>
                        <td>{c.postScore}/10</td>
                        <td>
                          <span className={`tag ${c.passed ? "tag-accent-2" : "tag-outline"}`}>{c.passed ? "Passed" : "Not Passed"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {completions && completions.length === 0 && (
                <div className="card">
                  <p className="card-body">No completions recorded yet.</p>
                </div>
              )}

              <div style={{ fontFamily: "var(--font-heading)", fontSize: 22, margin: "var(--space-8) 0 var(--space-2)" }}>Assign Training</div>
              <p style={{ opacity: 0.7, maxWidth: "65ch", marginBottom: "var(--space-4)" }}>
                One name/email per line — either just an email, or <code>Name, email@example.com</code>.
                Each person gets an email with a link to start now, then a reminder every few days
                until they complete it.
              </p>
              <div className="field" style={{ marginBottom: "var(--space-3)" }}>
                <label htmlFor="cq-assign-text">People to assign</label>
                <textarea
                  id="cq-assign-text"
                  className="input"
                  style={{ borderRadius: "var(--radius-lg)", minHeight: 120, resize: "vertical", fontFamily: "var(--font-body)" }}
                  value={assignText}
                  onChange={(e) => setAssignText(e.target.value)}
                  placeholder={"Jane Doe, jane.doe@chcrichmond.org\njohn.smith@chcrichmond.org"}
                />
              </div>
              <button type="button" className="btn btn-primary" disabled={assigning || !assignText.trim()} onClick={submitAssignments}>
                {assigning ? "Sending…" : "Send Assignments"}
              </button>
              {assignResult && "error" in assignResult && (
                <p style={{ color: "var(--color-accent-700)", fontSize: 13, marginTop: 8 }}>{assignResult.error}</p>
              )}
              {assignResult && "assigned" in assignResult && (
                <p style={{ fontSize: 13, marginTop: 8, opacity: 0.85 }}>
                  Assigned and emailed {assignResult.assigned} {assignResult.assigned === 1 ? "person" : "people"}.
                  {assignResult.invalidLines.length > 0 && ` Skipped ${assignResult.invalidLines.length} line(s) that weren't valid emails.`}
                  {assignResult.emailFailures.length > 0 && ` Saved, but the email failed to send to: ${assignResult.emailFailures.join(", ")}.`}
                </p>
              )}

              <div style={{ fontFamily: "var(--font-heading)", fontSize: 22, margin: "var(--space-8) 0 var(--space-2)" }}>Assignments</div>
              {assignments && assignments.length > 0 && (
                <table className="table" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Assigned</th>
                      <th>Reminders sent</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((a) => (
                      <tr key={a.id}>
                        <td>{a.name || "—"}</td>
                        <td>{a.email}</td>
                        <td className="text-muted">{new Date(a.assignedAt).toLocaleDateString()}</td>
                        <td>{a.reminderCount}</td>
                        <td>
                          <span className={`tag ${a.completedAt ? "tag-accent-2" : "tag-outline"}`}>{a.completedAt ? "Completed" : "Pending"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {assignments && assignments.length === 0 && (
                <div className="card">
                  <p className="card-body">No one has been assigned yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function exportCSV(rows: CompletionRecord[]) {
  const header = ["Name", "Email", "Date", "Pre-Test", "Post-Test", "Result"];
  const lines = [header, ...rows.map((a) => [a.name, a.email, a.completedAt, `${a.preScore}/10`, `${a.postScore}/10`, a.passed ? "Passed" : "Not Passed"])];
  const csv = lines.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "de-escalation-completions.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── Welcome ──────────────────────────────────────────────────────────────

function WelcomeScreen({
  ui,
  learnerName,
  learnerEmail,
  onNameChange,
  onEmailChange,
  onBegin,
  onFacilitator,
  onAboutChcr,
}: {
  ui: (typeof UI)["en"];
  learnerName: string;
  learnerEmail: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onBegin: () => void;
  onFacilitator: () => void;
  onAboutChcr: () => void;
}) {
  const cannotBegin = !(learnerName.trim() && learnerEmail.trim());
  return (
    <div className="card elev-md" style={{ padding: 20, gap: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/photos/welcome-hero.webp" alt="Community Health Center of Richmond" style={{ width: "100%", height: 220, objectFit: "contain", background: "var(--color-neutral-100)", borderRadius: 16, marginBottom: 12 }} />
      <div className="card-title" style={{ fontSize: 28, marginBottom: 6 }}>{ui.courseTitle}</div>
      <p className="card-body" style={{ fontSize: 14, marginBottom: 4 }}>{ui.welcomeIntro1}</p>
      <p className="card-body" style={{ fontSize: 14 }}>
        {ui.welcomeIntro2Prefix}{PASSING_SCORE}{ui.welcomeIntro2Suffix}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "14px 0" }}>
        <div className="card" style={{ padding: 12, gap: 4 }}>
          <div className="card-kicker" style={{ fontSize: 14 }}>{ui.aboutFacilitator}</div>
          <p className="card-body" style={{ fontSize: 13 }}>
            {ui.aboutFacilitatorBody}
            <br />
            {ui.aboutFacilitatorRole}
          </p>
          <button type="button" className="btn btn-ghost" style={{ marginTop: 2, paddingLeft: 0 }} onClick={onFacilitator}>
            {ui.readMore}
          </button>
        </div>
        <div className="card" style={{ padding: 12, gap: 4 }}>
          <div className="card-kicker" style={{ fontSize: 14 }}>{ui.aboutChcr}</div>
          <p className="card-body" style={{ fontSize: 13 }}>{ui.aboutChcrBody}</p>
          <button type="button" className="btn btn-ghost" style={{ marginTop: 2, paddingLeft: 0 }} onClick={onAboutChcr}>
            {ui.readMore}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 0 12px" }}>
        <div className="field">
          <label htmlFor="cq-name">{ui.yourName}</label>
          <input className="input" id="cq-name" value={learnerName} onChange={(e) => onNameChange(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="field">
          <label htmlFor="cq-email">{ui.yourEmail}</label>
          <input className="input" id="cq-email" type="email" value={learnerEmail} onChange={(e) => onEmailChange(e.target.value)} placeholder="jane.doe@chcrichmond.org" />
        </div>
      </div>
      <button type="button" className="btn btn-primary" disabled={cannotBegin} onClick={onBegin}>
        {ui.beginPretest}
        {ARROW}
      </button>
    </div>
  );
}

// ── Facilitator / About CHCR / References sub-pages ────────────────────

function FacilitatorPage({ ui, onBack }: { ui: (typeof UI)["en"]; onBack: () => void }) {
  return (
    <div className="card elev-md" style={{ padding: 20, gap: 0 }}>
      <button type="button" className="btn btn-ghost" style={{ paddingLeft: 0, marginBottom: 8 }} onClick={onBack}>
        {ui.back}
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 16, alignItems: "start" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/stavros-headshot.jpg" alt="Stavros E. Delardas, LCSW, PMH-C, CLC" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }} />
        <div>
          <div className="card-kicker">{ui.facilitatorKicker}</div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 22, marginBottom: 2 }}>Stavros E. Delardas</div>
          <div style={{ opacity: 0.75, marginBottom: 6, fontSize: 14 }}>{ui.facilitatorRoleLine}</div>
        </div>
      </div>
      <p className="card-body" style={{ marginTop: 12, fontSize: 16 }}>{ui.facilitatorBio1}</p>
      <p className="card-body" style={{ fontSize: 16 }}>{ui.facilitatorBio2}</p>
    </div>
  );
}

const SERVICES: Array<{ titleKey: keyof (typeof UI)["en"]; bodyKey: keyof (typeof UI)["en"]; bg: string; fg: string; icon: ReactNode }> = [
  { titleKey: "svcPrimaryTitle", bodyKey: "svcPrimaryBody", bg: "var(--color-accent-100)", fg: "var(--color-accent-700)", icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" /> },
  { titleKey: "svcPediTitle", bodyKey: "svcPediBody", bg: "var(--color-accent-100)", fg: "var(--color-accent-700)", icon: <><circle cx={12} cy={7} r={3} /><path d="M6 21v-2a6 6 0 0 1 12 0v2" /></> },
  { titleKey: "svcWomensTitle", bodyKey: "svcWomensBody", bg: "var(--color-accent-2-100)", fg: "var(--color-accent-2-700)", icon: <path d="M12 21s-6.7-4.35-9.3-8.3C1 10 1.6 6.6 4.4 5 6.6 3.7 9.4 4.3 11 6.3c.4.5.7 1 1 1.5.3-.5.6-1 1-1.5 1.6-2 4.4-2.6 6.6-1.3 2.8 1.6 3.4 5 1.7 7.7C18.7 16.65 12 21 12 21Z" /> },
  { titleKey: "svcBehavioralTitle", bodyKey: "svcBehavioralBody", bg: "var(--color-accent-100)", fg: "var(--color-accent-700)", icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /> },
  { titleKey: "svcDentalTitle", bodyKey: "svcDentalBody", bg: "var(--color-accent-2-100)", fg: "var(--color-accent-2-700)", icon: <><path d="M8 3v4M16 3v4M4 11h16M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M9.5 15.5 11 17l3.5-3.5" /></> },
  { titleKey: "svcNutritionTitle", bodyKey: "svcNutritionBody", bg: "var(--color-accent-100)", fg: "var(--color-accent-700)", icon: <><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Z" /><circle cx={12} cy={9} r={2.5} /></> },
  { titleKey: "svcPodiatryTitle", bodyKey: "svcPodiatryBody", bg: "var(--color-accent-2-100)", fg: "var(--color-accent-2-700)", icon: <path d="M12 20a7 7 0 0 0 7-7c0-2-1-3.5-2-5-1.5 1-2 2.5-2 2.5S13.5 8 12 4c-1.5 4-3 6.5-3 8.5S9 15 9 15s-1-1.5-2-2.5c-1 1.5-2 3-2 5a7 7 0 0 0 7 7Z" /> },
  { titleKey: "svcSupportTitle", bodyKey: "svcSupportBody", bg: "var(--color-accent-100)", fg: "var(--color-accent-700)", icon: <><path d="M17 20h5v-1a4 4 0 0 0-4-4h-1M9 20H4v-1a4 4 0 0 1 4-4h1m1-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" /></> },
];

function AboutChcrPage({ ui, onBack }: { ui: (typeof UI)["en"]; onBack: () => void }) {
  return (
    <div className="card elev-md" style={{ padding: 20, gap: 0 }}>
      <button type="button" className="btn btn-ghost" style={{ paddingLeft: 0, marginBottom: 8 }} onClick={onBack}>
        {ui.back}
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://chcrichmond.org/wp-content/uploads/2021/12/circle-of-care-collage-graphic.png"
        alt="CHCR Circle of Care"
        style={{ width: "100%", height: 180, objectFit: "contain", background: "var(--color-neutral-100)", borderRadius: "var(--radius-lg)", marginBottom: 12, boxShadow: "var(--shadow-sm)" }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="card-kicker">{ui.aboutChcrKicker}</div>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: 24, marginBottom: 4 }}>{ui.chcrOrgName}</div>
      <div style={{ opacity: 0.75, marginBottom: 8, fontSize: 14 }}>{ui.chcrTagline}</div>
      <p className="card-body" style={{ fontSize: 14, marginBottom: 6 }}>{ui.chcrMission}</p>

      <div className="card-kicker" style={{ margin: "12px 0 6px", fontSize: 16 }}>{ui.neighborhoodKicker}</div>
      <p className="card-body" style={{ fontSize: 14 }}>{ui.neighborhoodBody}</p>

      <div className="card-kicker" style={{ margin: "12px 0 6px", fontSize: 16 }}>{ui.servicesKicker}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        {SERVICES.map((svc) => (
          <div className="card" key={svc.titleKey} style={{ padding: 12, gap: 4 }}>
            <div style={{ width: 34, height: 34, borderRadius: 999, background: svc.bg, color: svc.fg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round">{svc.icon}</svg>
            </div>
            <div className="card-title" style={{ fontSize: 15 }}>{ui[svc.titleKey]}</div>
            <p className="card-body" style={{ fontSize: 13 }}>{ui[svc.bodyKey]}</p>
          </div>
        ))}
      </div>
      <p className="card-body" style={{ opacity: 0.75, fontSize: 12 }}>
        {ui.chcrFooter}{" "}
        <a href="https://chcrichmond.org" target="_blank" rel="noopener noreferrer">chcrichmond.org</a>.
      </p>
    </div>
  );
}

const ACADEMIC_REFS = [
  <>Goodman, H., Papastavrou Brooks, C., Price, O., &amp; Barley, E. A. (2020). Barriers and facilitators to the effective de-escalation of conflict behaviours in forensic high-secure settings: A qualitative study. <em>International Journal of Mental Health Systems, 14</em>, Article 59. <a href="https://doi.org/10.1186/s13033-020-00392-5" target="_blank" rel="noopener noreferrer">doi.org/10.1186/s13033-020-00392-5</a></>,
  <>Institute for Healthcare Improvement. (2019). <em>Improving Health Equity: Build Infrastructure to Support Health Equity</em> [Guide]. <a href="https://www.ihi.org/resources/Pages/Publications/Improving-Health-Equity-Build-Infrastructure-Guide.aspx" target="_blank" rel="noopener noreferrer">ihi.org</a></>,
  <>Price, O., Papastavrou Brooks, C., Johnston, I., et al. (2024). Development and evaluation of a de-escalation training intervention in adult acute and forensic units: The EDITION systematic review and feasibility trial. <em>Health Technology Assessment, 28</em>(03). National Institute for Health and Care Research.</>,
  <>Substance Abuse and Mental Health Services Administration. (2014). <em>Trauma-Informed Care in Behavioral Health Services: Treatment Improvement Protocol (TIP) Series 57</em> (HHS Publication No. SMA 13-4801). U.S. Department of Health and Human Services.</>,
  <>Tervalon, M., &amp; Murray-García, J. (1998). Cultural humility versus cultural competence: A critical distinction in defining physician training outcomes in multicultural education. <em>Journal of Health Care for the Poor and Underserved, 9</em>(2), 117-125.</>,
  <>Trauma Interventions Research Center. (2020, May 15). <em>Calming &amp; de-escalation strategies</em> [Video]. YouTube. <a href="https://youtu.be/R2PSExM-NhU" target="_blank" rel="noopener noreferrer">youtu.be/R2PSExM-NhU</a></>,
  <>Yeager, K. A., &amp; Bauer-Wu, S. (2013). Cultural humility: Essential foundation for clinical researchers. <em>Applied Nursing Research, 26</em>(4), 251-256. <a href="https://doi.org/10.1016/j.apnr.2013.06.008" target="_blank" rel="noopener noreferrer">doi.org/10.1016/j.apnr.2013.06.008</a></>,
];

function ReferencesPage({ ui, onBack }: { ui: (typeof UI)["en"]; onBack: () => void }) {
  return (
    <div className="card elev-md" style={{ padding: 20, gap: 0 }}>
      <button type="button" className="btn btn-ghost" style={{ paddingLeft: 0, marginBottom: 8 }} onClick={onBack}>
        {ui.back}
      </button>
      <div className="card-kicker">{ui.referencesKicker}</div>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: 22, marginBottom: 8 }}>{ui.referencesTitle}</div>
      <p className="card-body" style={{ marginBottom: 12, fontSize: 14 }}>{ui.referencesIntro}</p>
      <div style={{ display: "grid", gap: 8 }}>
        <div className="card" style={{ padding: 12, gap: 4 }}>
          <div className="card-title" style={{ fontSize: 15 }}>CHCR De-Escalation Quick Reference Guide</div>
          <p className="card-body" style={{ fontSize: 13 }}>Stavros E. Delardas&apos;s original 5-step (Recognize, Respond, Set Limits, Engage Non-Verbally, Reflect &amp; Learn) infographic, the basis for this course&apos;s quick-reference cycle.</p>
        </div>
        <div className="card" style={{ padding: 12, gap: 4 }}>
          <div className="card-title" style={{ fontSize: 15 }}>Community Health Center of Richmond</div>
          <p className="card-body" style={{ fontSize: 13 }}>
            Mission, services, and location information. <a href="https://chcrichmond.org" target="_blank" rel="noopener noreferrer">chcrichmond.org</a>
          </p>
        </div>
        <div className="card" style={{ padding: 12, gap: 4 }}>
          <div className="card-title" style={{ fontSize: 15 }}>Center of Excellence for Behavioral Health in Nursing Facilities: De-Escalation Strategies In-Service Toolkit</div>
          <p className="card-body" style={{ fontSize: 13 }}>
            SAMHSA-funded toolkit (Aug. 2025) informing the debrief worksheet and discussion of personal readiness.{" "}
            <a href="https://www.cms.gov/files/document/de-escalation-strategies-service-toolkit-final-2025.pdf" target="_blank" rel="noopener noreferrer">cms.gov</a>
          </p>
        </div>
        <div className="card" style={{ padding: 12, gap: 4 }}>
          <div className="card-title" style={{ fontSize: 15 }}>Crisis Prevention Institute (CPI): Health Care De-Escalation Training</div>
          <p className="card-body" style={{ fontSize: 13 }}>
            Industry best practices on early warning signs, trauma-informed response, and post-crisis debrief.{" "}
            <a href="https://www.crisisprevention.com/industries/health-care/" target="_blank" rel="noopener noreferrer">crisisprevention.com</a>
          </p>
        </div>
      </div>
      <div className="card-kicker" style={{ margin: "12px 0 6px" }}>{ui.academicKicker}</div>
      <div style={{ display: "grid", gap: 8 }}>
        {ACADEMIC_REFS.map((ref, i) => (
          <div className="card" key={i} style={{ padding: 12 }}>
            <p className="card-body" style={{ fontSize: 13 }}>{ref}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Quiz (pretest / posttest) ───────────────────────────────────────────

function QuizScreen({
  ui,
  kicker,
  title,
  intro,
  questions,
  answers,
  onSelect,
  submitLabel,
  onSubmit,
  submitDisabled,
  namePrefix,
}: {
  ui: (typeof UI)["en"];
  kicker: string;
  title: string;
  intro: string;
  questions: { text: string; options: string[] }[];
  answers: Record<number, number>;
  onSelect: (qi: number, oi: number) => void;
  submitLabel: string;
  onSubmit: () => void;
  submitDisabled?: boolean;
  namePrefix: string;
}) {
  const answeredCount = Object.keys(answers).length;
  const incomplete = answeredCount < questions.length;
  return (
    <>
      <div style={{ marginBottom: "var(--space-6)" }}>
        <div className="card-kicker">{kicker}</div>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: 26, marginBottom: "var(--space-2)" }}>{title}</div>
        <p style={{ opacity: 0.75, maxWidth: "60ch" }}>{intro}</p>
      </div>
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        {questions.map((q, qi) => (
          <div className="card" key={qi}>
            <div className="card-kicker">{ui.questionOf} {qi + 1} {ui.of10}</div>
            <div className="card-title" style={{ fontSize: 18 }}>{q.text}</div>
            <div style={{ display: "grid", gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
              {q.options.map((text, oi) => (
                <label className="radio cq-radio" key={oi}>
                  <input type="radio" name={`${namePrefix}-${qi}`} checked={answers[qi] === oi} onChange={() => onSelect(qi, oi)} />
                  <span className="dot" />
                  {text}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "var(--space-6)" }}>
        <button type="button" className="btn btn-primary btn-block" disabled={incomplete || submitDisabled} onClick={onSubmit}>
          {submitLabel}
        </button>
      </div>
    </>
  );
}

// ── Scenario ("Try It") ─────────────────────────────────────────────────

function ScenarioView({
  ui,
  scenario,
  related,
  chosen,
  onSelect,
}: {
  ui: (typeof UI)["en"];
  scenario: { narrative: string; prompt: string; options: { text: string; correct: boolean; feedback: string }[] };
  related: string;
  chosen: number | undefined;
  onSelect: (oi: number) => void;
}) {
  return (
    <>
      <div className="card-kicker">{ui.tryIt} · {related}</div>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: 28, marginBottom: "var(--space-5)" }}>{ui.applyWhatYouLearned}</div>
      <div className="card elev-md" style={{ padding: "var(--space-6)" }}>
        <div style={{ background: "var(--color-accent-100)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", marginBottom: "var(--space-5)" }}>
          <div className="card-kicker" style={{ marginBottom: "var(--space-2)" }}>{ui.scenarioKicker}</div>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, fontStyle: "italic" }}>{scenario.narrative}</p>
        </div>
        <p style={{ fontWeight: 600, marginBottom: "var(--space-3)" }}>{scenario.prompt}</p>
        <div style={{ display: "grid", gap: 12 }}>
          {scenario.options.map((opt, i) => {
            const btnClass = chosen === i ? (opt.correct ? "btn-primary" : "btn-secondary") : "btn-secondary";
            return (
              <button
                key={i}
                type="button"
                className={`btn ${btnClass} btn-block`}
                style={{ justifyContent: "flex-start", textAlign: "left", height: "auto", padding: "var(--space-3) var(--space-4)", margin: 0 }}
                onClick={() => onSelect(i)}
              >
                {opt.text}
              </button>
            );
          })}
        </div>
        {chosen !== undefined && (
          <p style={{ marginTop: "var(--space-4)", fontWeight: 600 }}>{scenario.options[chosen].feedback}</p>
        )}
      </div>
    </>
  );
}

// ── "Say This, Not That" game ───────────────────────────────────────────

function GameView({
  ui,
  language,
  ofWord,
  order,
  assignments,
  draggingId,
  dragOverCat,
  onDragStart,
  onDragEnd,
  onDragOverCat,
  onDragLeaveCat,
  onDrop,
  onRemove,
}: {
  ui: (typeof UI)["en"];
  language: Language;
  ofWord: string;
  order: string[];
  assignments: Record<string, GameCatId>;
  draggingId: string | null;
  dragOverCat: GameCatId | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDragOverCat: (cat: GameCatId) => void;
  onDragLeaveCat: (cat: GameCatId) => void;
  onDrop: (id: string, cat: GameCatId) => void;
  onRemove: (id: string) => void;
}) {
  const statements = SAY_THIS_NOT_THAT_GAME.statements;
  const textFor = (id: string) => {
    const s = statements.find((s) => s.id === id)!;
    return language === "es" ? GAME_TEXT_ES[id] : s.text;
  };
  const unassigned = order.filter((id) => !assignments[id]);
  const isComplete = statements.every((s) => assignments[s.id]);
  const score = statements.filter((s) => assignments[s.id] === s.category).length;

  return (
    <>
      <div style={{ marginBottom: "var(--space-4)" }}>
        <div className="card-kicker">{ui.practiceKicker}</div>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: 24, marginBottom: "var(--space-2)" }}>{ui.gameTitle}</div>
        <p style={{ opacity: 0.75, maxWidth: "65ch", fontSize: 14 }}>{ui.gameInstructions} {ui.gameInstructionsSuffix}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
        {SAY_THIS_NOT_THAT_GAME.categories.map((cat) => {
          const items = statements.filter((s) => assignments[s.id] === cat.id);
          return (
            <div
              key={cat.id}
              onDragOver={(e) => {
                e.preventDefault();
                onDragOverCat(cat.id);
              }}
              onDragLeave={() => onDragLeaveCat(cat.id)}
              onDrop={(e) => {
                e.preventDefault();
                const id = draggingId || e.dataTransfer.getData("text/plain");
                if (id) onDrop(id, cat.id);
              }}
              style={{
                borderRadius: "var(--radius-lg)", padding: "var(--space-3)", background: cat.bg, minHeight: 160,
                borderWidth: 3, borderStyle: "dashed", borderColor: dragOverCat === cat.id ? cat.varColor : "transparent",
                transition: "border-color .15s ease",
              }}
            >
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 18, marginBottom: "var(--space-2)", color: cat.varColor, textAlign: "center" }}>
                {cat.id === "say" ? ui.sayThis : ui.notThat}
              </div>
              <div style={{ display: "grid", gap: "var(--space-2)" }}>
                {items.map((item) => (
                  <div key={item.id} style={{ background: "#fff", padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", fontSize: 14, lineHeight: 1.4, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)" }}>
                    <span>&quot;{textFor(item.id)}&quot;</span>
                    <button type="button" className="btn-icon" title="Move back" onClick={() => onRemove(item.id)} style={{ flexShrink: 0 }}>✕</button>
                  </div>
                ))}
                {items.length === 0 && (
                  <div style={{ opacity: 0.45, textAlign: "center", padding: "var(--space-4) var(--space-3)", fontSize: 13, borderRadius: "var(--radius-md)" }}>
                    {ui.dropHere}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: "var(--space-4)" }}>
        <div style={{ fontWeight: 600, marginBottom: "var(--space-2)", fontSize: 13, opacity: 0.7 }}>{ui.dragHint}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {unassigned.map((id) => (
            <div
              key={id}
              draggable
              onDragStart={(e) => {
                onDragStart(id);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", id);
              }}
              onDragEnd={onDragEnd}
              style={{
                cursor: "grab", userSelect: "none", background: "#fff", padding: "var(--space-2) var(--space-3)",
                borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)", fontSize: 14, lineHeight: 1.4,
                maxWidth: 340, opacity: draggingId === id ? 0.4 : 1,
              }}
            >
              &quot;{textFor(id)}&quot;
            </div>
          ))}
          {unassigned.length === 0 && <div style={{ opacity: 0.5, padding: "var(--space-2) 0", fontSize: 14 }}>{ui.allSorted}</div>}
        </div>
      </div>

      {isComplete && (
        <div className="card" style={{ background: "var(--color-accent-2-100)", marginBottom: "var(--space-4)" }}>
          <div style={{ fontWeight: 600, marginBottom: "var(--space-1)", fontSize: 14 }}>
            {ui.scoreLabel} {score} {ofWord} {statements.length}
          </div>
          <p style={{ margin: 0, fontSize: 14 }}>{ui.gameCompleteMsg}</p>
        </div>
      )}
    </>
  );
}

// ── Results ──────────────────────────────────────────────────────────────

function ResultsView({
  ui,
  learnerName,
  serverResult,
  onRetake,
  onStartOver,
}: {
  ui: (typeof UI)["en"];
  learnerName: string;
  serverResult: ServerResult;
  onRetake: () => void;
  onStartOver: () => void;
}) {
  const { passed, preCorrectCount, preTotal, postCorrectCount, postTotal } = serverResult;
  const resultLabel = passed ? "Course Complete" : "Not Yet Passed";
  const resultTagClass = passed ? "tag-accent-2" : "tag-outline";
  const resultMessage = passed
    ? "You've met the passing score and completed this year's de-escalation training. Thank you."
    : `A score of ${PASSING_SCORE}% or higher is needed to complete the course. Review the lesson sections as needed, then retake the post-test.`;

  return (
    <div className="card elev-md" style={{ padding: "var(--space-8)", textAlign: "center" }}>
      <span className={`tag ${resultTagClass}`}>{resultLabel}</span>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: 30, margin: "var(--space-4) 0 var(--space-1)" }}>{learnerName}</div>
      <p style={{ opacity: 0.7, marginBottom: "var(--space-6)" }}>{new Date().toLocaleDateString()}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", maxWidth: 420, margin: "0 auto var(--space-6)" }}>
        <div className="card">
          <div className="card-kicker">{ui.pretestTitle}</div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 28 }}>{preCorrectCount}/{preTotal}</div>
        </div>
        <div className="card">
          <div className="card-kicker">{ui.posttestTitle}</div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 28 }}>{postCorrectCount}/{postTotal}</div>
        </div>
      </div>
      <p style={{ maxWidth: "50ch", margin: "0 auto var(--space-6)", opacity: 0.85 }}>{resultMessage}</p>
      <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center" }}>
        {!passed && (
          <button type="button" className="btn btn-primary" onClick={onRetake}>
            Retake Post-Test
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={onStartOver}>
          Done
        </button>
      </div>
      <p style={{ marginTop: "var(--space-6)", fontSize: 12, opacity: 0.55 }}>Your completion record has been saved.</p>
    </div>
  );
}
