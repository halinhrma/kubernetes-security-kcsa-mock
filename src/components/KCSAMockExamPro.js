import React, { useMemo, useState } from "react";

// --- Helper UI Components ---
function Stat({ icon: Icon, label, value, hint }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderRadius: '16px',
      border: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-surface)',
      padding: '16px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease'
    }}>
      <div style={{
        display: 'flex',
        height: '48px',
        width: '48px',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.15), rgba(0, 102, 204, 0.05))'
      }}>
        <Icon style={{ height: '24px', width: '24px', color: 'var(--color-primary-500)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ fontSize: '14px', color: 'var(--color-text-tertiary)' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>{value}</span>
          {hint ? <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{hint}</span> : null}
        </div>
      </div>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      borderRadius: '9999px',
      border: '1px solid var(--color-border)',
      padding: '4px 12px',
      fontSize: '14px',
      color: 'var(--color-text-secondary)'
    }}>
      {children}
    </span>
  );
}

// Simple icon components using emojis
const Shield = ({ style, ...props }) => <span style={style} {...props}>🛡️</span>;
const Star = ({ style, ...props }) => <span style={style} {...props}>⭐</span>;
const Layers3 = ({ style, ...props }) => <span style={style} {...props}>📚</span>;
const Zap = ({ style, ...props }) => <span style={style} {...props}>⚡</span>;
const Play = ({ style, ...props }) => <span style={style} {...props}>▶️</span>;
const Settings2 = ({ style, ...props }) => <span style={style} {...props}>⚙️</span>;
const BadgeCheck = ({ style, ...props }) => <span style={style} {...props}>✅</span>;
const Timer = ({ style, ...props }) => <span style={style} {...props}>⏱️</span>;
const Shuffle = ({ style, ...props }) => <span style={style} {...props}>🔀</span>;
const ChevronDown = ({ style, ...props }) => <span style={style} {...props}>▼</span>;
const ChevronRight = ({ style, ...props }) => <span style={style} {...props}>▶</span>;

// Simple UI components with inline styles
const Button = ({ children, variant = "default", style = {}, onClick, ...props }) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ...style
  };

  const variantStyles = {
    default: {
      backgroundColor: 'var(--color-primary-500)',
      color: 'white'
    },
    outline: {
      border: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-text-primary)'
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-text-primary)'
    }
  };

  return (
    <button
      style={{ ...baseStyles, ...variantStyles[variant] }}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, style = {}, ...props }) => (
  <div style={{
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    ...style
  }} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, style = {}, ...props }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '24px',
    ...style
  }} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, style = {}, ...props }) => (
  <h3 style={{
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: 1,
    margin: 0,
    ...style
  }} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, style = {}, ...props }) => (
  <p style={{
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    margin: 0,
    ...style
  }} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, style = {}, ...props }) => (
  <div style={{
    padding: '24px',
    paddingTop: 0,
    ...style
  }} {...props}>
    {children}
  </div>
);

const Input = ({ style = {}, ...props }) => (
  <input style={{
    display: 'flex',
    height: '40px',
    width: '100%',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    padding: '8px 12px',
    fontSize: '14px',
    ...style
  }} {...props} />
);

const Label = ({ children, htmlFor, style = {}, ...props }) => (
  <label htmlFor={htmlFor} style={{
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    ...style
  }} {...props}>
    {children}
  </label>
);

const Switch = ({ checked, onCheckedChange, ...props }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    style={{
      position: 'relative',
      display: 'inline-flex',
      height: '24px',
      width: '44px',
      alignItems: 'center',
      borderRadius: '9999px',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: checked ? 'var(--color-primary-500)' : 'var(--color-border)',
      transition: 'all 0.2s ease'
    }}
    {...props}
  >
    <span style={{
      display: 'inline-block',
      height: '16px',
      width: '16px',
      borderRadius: '50%',
      backgroundColor: 'white',
      transform: checked ? 'translateX(20px)' : 'translateX(4px)',
      transition: 'transform 0.2s ease'
    }} />
  </button>
);

const Slider = ({ value, min, max, step, onValueChange, ...props }) => (
  <div style={{ position: 'relative', width: '100%' }} {...props}>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([parseInt(e.target.value)])}
      style={{
        width: '100%',
        height: '8px',
        borderRadius: '4px',
        background: 'var(--color-border)',
        outline: 'none',
        cursor: 'pointer'
      }}
    />
  </div>
);

const Badge = ({ children, variant = "default", style = {}, ...props }) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '9999px',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: 600,
    ...style
  };

  const variantStyles = {
    default: {
      backgroundColor: 'var(--color-primary-500)',
      color: 'white',
      border: 'none'
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-text-primary)',
      border: 'none'
    },
    outline: {
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-border)'
    }
  };

  return (
    <div style={{ ...baseStyles, ...variantStyles[variant] }} {...props}>
      {children}
    </div>
  );
};

const Tabs = ({ children, defaultValue, style = {}, ...props }) => (
  <div style={{ width: '100%', ...style }} {...props}>
    {children}
  </div>
);

const TabsList = ({ children, style = {}, ...props }) => (
  <div style={{
    display: 'inline-flex',
    height: '40px',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    backgroundColor: 'var(--color-muted)',
    padding: '4px',
    ...style
  }} {...props}>
    {children}
  </div>
);

const TabsTrigger = ({ children, value, style = {}, ...props }) => (
  <button style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '14px',
    fontWeight: 500,
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ...style
  }} {...props}>
    {children}
  </button>
);

const TabsContent = ({ children, value, style = {}, ...props }) => (
  <div style={{
    marginTop: '8px',
    ...style
  }} {...props}>
    {children}
  </div>
);

const Select = ({ children, onValueChange, value, style = {}, ...props }) => (
  <div style={{ position: 'relative', ...style }} {...props}>
    {children}
  </div>
);

const SelectTrigger = ({ children, style = {}, ...props }) => (
  <button style={{
    display: 'flex',
    height: '40px',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    padding: '8px 12px',
    fontSize: '14px',
    cursor: 'pointer',
    ...style
  }} {...props}>
    {children}
  </button>
);

const SelectValue = ({ placeholder, style = {}, ...props }) => (
  <span style={{ fontSize: '14px', ...style }} {...props}>
    {placeholder}
  </span>
);

const SelectContent = ({ children, style = {}, ...props }) => (
  <div style={{
    position: 'relative',
    zIndex: 50,
    minWidth: '8rem',
    overflow: 'hidden',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-popover)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    ...style
  }} {...props}>
    {children}
  </div>
);

const SelectGroup = ({ children, style = {}, ...props }) => (
  <div style={style} {...props}>
    {children}
  </div>
);

const SelectLabel = ({ children, style = {}, ...props }) => (
  <div style={{
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
    ...style
  }} {...props}>
    {children}
  </div>
);

const SelectItem = ({ children, value, style = {}, ...props }) => (
  <button style={{
    position: 'relative',
    display: 'flex',
    width: '100%',
    cursor: 'pointer',
    alignItems: 'center',
    borderRadius: '4px',
    padding: '6px 16px',
    fontSize: '14px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-text-primary)',
    ...style
  }} {...props}>
    {children}
  </button>
);

const DOMAINS = [
  "Kubernetes Security Fundamentals",
  "Kubernetes Cluster Component Security",
  "Kubernetes Threat Model",
  "Cloud Native Security",
  "Platform Security",
  "Compliance and Security Frameworks",
];

export default function KCSAMockExamPro({
  numQuestions,
  setNumQuestions,
  startExam,
  maxQuestions,
  availableDomains,
  selectedDomains,
  setSelectedDomains,
  starredQuestions,
  setStarredQuestions
}) {
  const [starredOnly, setStarredOnly] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [shuffle, setShuffle] = useState(true);

  const totalQuestions = maxQuestions || 1000;
  const starredCount = starredQuestions?.length || 0;
  const totalDomains = availableDomains?.length || 6;

  // Function to get shorter display names for domains
  const getDomainDisplayName = (domain) => {
    const shortNames = {
      "Kubernetes Security Fundamentals": "Security Fundamentals",
      "Kubernetes Cluster Component Security": "Cluster Components",
      "Kubernetes Threat Model": "Threat Model",
      "Cloud Native Security": "Cloud Native",
      "Platform Security": "Platform Security",
      "Compliance and Security Frameworks": "Compliance & Frameworks"
    };
    return shortNames[domain] || domain;
  };

  const domainBadges = useMemo(
    () =>
      (selectedDomains.length ? selectedDomains : availableDomains || DOMAINS).slice(0, 6).map((d) => (
        <Badge key={d} variant="secondary" style={{ marginRight: '8px', marginTop: '8px' }}>
          {getDomainDisplayName(d)}
        </Badge>
      )),
    [selectedDomains, availableDomains]
  );

  const handleStartExam = () => {
    startExam(starredOnly);
  };

  const handleStartStarred = () => {
    startExam(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-background)',
      fontFamily: 'var(--font-family-sans)',
      color: 'var(--color-text-primary)'
    }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          maxWidth: '72rem',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '12px 16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              height: '36px',
              width: '36px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 102, 204, 0.1)'
            }}>
              <Shield style={{ height: '20px', width: '20px', color: 'var(--color-primary-500)' }} />
            </div>
            <div>
              <p style={{
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-text-tertiary)',
                margin: 0
              }}>KCSA Mock Exam</p>
              <h1 style={{
                fontSize: '18px',
                fontWeight: 600,
                lineHeight: 1.2,
                margin: 0
              }}>Master Kubernetes Security</h1>
            </div>
          </div>
          {/* <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button variant="outline" style={{ gap: '8px' }}>
              <Settings2 style={{ height: '16px', width: '16px' }} />Preferences
            </Button>
            <Button style={{ gap: '8px' }} onClick={handleStartExam}>
              <Play style={{ height: '16px', width: '16px' }} /> Start Exam
            </Button>
          </div> */}
        </div>
      </header>

      <main className="main-layout">
        {/* Left column */}
        <section className="main-content">
          <Card style={{ overflow: 'hidden' }}>
            <CardHeader style={{ paddingBottom: '8px' }}>
              <div style={{ marginBottom: '4px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                <Badge variant="outline" style={{ gap: '4px', fontSize: '12px' }}>
                  <Zap style={{ height: '12px', width: '12px' }} /> Quick Start
                </Badge>
                <Badge variant="secondary" style={{ gap: '4px', fontSize: '12px' }}>
                  <BadgeCheck style={{ height: '12px', width: '12px' }} /> Real‑world Scenarios
                </Badge>
              </div>
              <CardTitle style={{ fontSize: '24px' }}>Prepare for your KCSA certification</CardTitle>
              <CardDescription>
                Choose your question count, domains, and difficulty. Start immediately or practice from your starred questions.
              </CardDescription>
            </CardHeader>
            <CardContent style={{
              display: 'grid',
              gap: '24px',
              paddingTop: '8px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Label htmlFor="qCount">Number of Questions</Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Input
                    id="qCount"
                    type="number"
                    min={5}
                    max={totalQuestions}
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Math.min(totalQuestions, Math.max(5, Number(e.target.value))))}
                    style={{ minWidth: 100, fontSize: '16px', padding: '12px 16px' }}
                  />
                  <Pill>Max: {totalQuestions}</Pill>
                </div>
                <Slider
                  value={[numQuestions]}
                  min={5}
                  max={totalQuestions}
                  step={5}
                  onValueChange={(v) => setNumQuestions(v[0])}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingTop: '8px' }}>
                  <Button style={{ gap: '8px' }} onClick={handleStartExam}>
                    <Play style={{ height: '16px', width: '16px' }} /> Start Practice
                  </Button>
                  <Button variant="outline" style={{ gap: '8px' }} onClick={handleStartStarred}>
                    <Star style={{ height: '16px', width: '16px' }} /> Starred ({starredCount})
                  </Button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Label>Focus Domains</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {domainBadges}
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  paddingTop: '4px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    padding: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Timer style={{ height: '16px', width: '16px' }} />
                      <Label htmlFor="timer" style={{ fontSize: '14px', color: 'var(--color-text-tertiary)' }}>Exam Timer</Label>
                    </div>
                    <Switch id="timer" checked={timerEnabled} onCheckedChange={setTimerEnabled} />
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    padding: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shuffle style={{ height: '16px', width: '16px' }} />
                      <Label htmlFor="shuffle" style={{ fontSize: '14px', color: 'var(--color-text-tertiary)' }}>Shuffle Questions</Label>
                    </div>
                    <Switch id="shuffle" checked={shuffle} onCheckedChange={setShuffle} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced */}
          <Card>
            <CardHeader>
              <div className="advanced-options">
                <div>
                  <CardTitle style={{ fontSize: '20px' }}>Advanced Options</CardTitle>
                  <CardDescription>Fine‑tune your practice session.</CardDescription>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button style={{ gap: '8px' }} onClick={handleStartExam}>
                    <Play style={{ height: '16px', width: '16px' }} /> Start Now
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Tabs defaultValue="domains" style={{ width: '100%' }}>
                <TabsList style={{
                  display: 'grid',
                  width: '100%',
                  gridTemplateColumns: 'repeat(3, 1fr)'
                }}>
                  <TabsTrigger value="domains" style={{ gap: '8px' }}>
                    <Layers3 style={{ height: '16px', width: '16px' }} />Domains
                  </TabsTrigger>
                  <TabsTrigger value="filters" style={{ gap: '8px' }}>
                    <Star style={{ height: '16px', width: '16px' }} />Filters
                  </TabsTrigger>
                  <TabsTrigger value="review" style={{ gap: '8px' }}>
                    <Shield style={{ height: '16px', width: '16px' }} />Review
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="domains" style={{ paddingTop: '16px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '12px'
                  }}>
                    {(availableDomains || DOMAINS).map((d) => {
                      const active = selectedDomains.includes(d);
                      return (
                        <button
                          key={d}
                          onClick={() =>
                            setSelectedDomains((cur) =>
                              cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]
                            )
                          }
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            borderRadius: '16px',
                            border: `1px solid ${active ? 'var(--color-primary-500)' : 'var(--color-border)'}`,
                            padding: '16px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            backgroundColor: active ? 'rgba(0, 102, 204, 0.05)' : 'transparent',
                            transition: 'all 0.2s ease'
                          }}
                          aria-pressed={active}
                        >
                          <div>
                            <p style={{ fontWeight: 500, lineHeight: 1.2, margin: 0 }}>{getDomainDisplayName(d)}</p>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', margin: '4px 0 0 0' }}>~160 questions</p>
                          </div>
                          <div style={{
                            marginLeft: '12px',
                            marginTop: '4px',
                            display: 'inline-flex',
                            height: '24px',
                            width: '24px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            border: '1px solid var(--color-border)',
                            backgroundColor: active ? 'rgba(0, 102, 204, 0.1)' : 'transparent'
                          }}>
                            {active ?
                              <ChevronDown style={{ height: '16px', width: '16px', color: 'var(--color-primary-500)' }} /> :
                              <ChevronRight style={{ height: '16px', width: '16px', color: 'var(--color-text-tertiary)' }} />
                            }
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="filters" style={{ paddingTop: '16px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '16px'
                  }}>
                    <div style={{
                      borderRadius: '16px',
                      border: '1px solid var(--color-border)',
                      padding: '16px'
                    }}>
                      <Label style={{ fontSize: '14px' }}>Include Starred</Label>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                        You have {starredCount} starred questions.
                      </p>
                      <div style={{
                        marginTop: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        padding: '12px'
                      }}>
                        <span style={{ fontSize: '14px', color: 'var(--color-text-tertiary)' }}>Starred only</span>
                        <Switch checked={starredOnly} onCheckedChange={setStarredOnly} />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="review" style={{ paddingTop: '16px' }}>
                  <div style={{
                    borderRadius: '16px',
                    border: '1px solid var(--color-border)',
                    padding: '16px'
                  }}>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', margin: 0 }}>Summary</p>
                    <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                      <li style={{ marginBottom: '8px', fontSize: '14px' }}>
                        <strong>{numQuestions}</strong> questions
                      </li>
                      <li style={{ marginBottom: '8px', fontSize: '14px' }}>
                        Domains: {selectedDomains.length ? selectedDomains.map(d => getDomainDisplayName(d)).join(", ") : "All"}
                      </li>
                      <li style={{ marginBottom: '8px', fontSize: '14px' }}>
                        {timerEnabled ? "Timer enabled" : "Timer off"} • {shuffle ? "Shuffled" : "Ordered"}
                      </li>
                      <li style={{ marginBottom: '8px', fontSize: '14px' }}>
                        {starredOnly ? "Use starred questions only" : "Use all questions"}
                      </li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Right column */}
        <aside className="sidebar">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: '18px' }}>Your Progress</CardTitle>
              <CardDescription>Track overall pool and bookmarks.</CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Stat icon={Layers3} label="Questions Available" value={`${totalQuestions}`} />
              <Stat icon={Star} label="Starred Questions" value={`${starredCount}`} />
              <Stat icon={Shield} label="Security Domains" value={`${totalDomains}`} />
            </CardContent>
          </Card>

          <Card style={{ borderStyle: 'dashed' }}>
            <CardHeader>
              <CardTitle style={{ fontSize: '18px' }}>Tips</CardTitle>
              <CardDescription>Make the most of each session.</CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                padding: '12px',
                fontSize: '14px',
                color: 'var(--color-text-secondary)'
              }}>
                Use <strong>Starred only</strong> for targeted revision.
              </div>
              <div style={{
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                padding: '12px',
                fontSize: '14px',
                color: 'var(--color-text-secondary)'
              }}>
                Practice with the <strong>Timer</strong> to simulate real exam pressure.
              </div>
              <div style={{
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                padding: '12px',
                fontSize: '14px',
                color: 'var(--color-text-secondary)'
              }}>
                Focus on 2–3 <strong>domains</strong> per session for depth.
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>

      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: '40px 0'
      }}>
        <div style={{
          maxWidth: '72rem',
          margin: '0 auto',
          padding: '0 16px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-text-tertiary)',
              margin: 0
            }}>
              © {new Date().getFullYear()} KCSA Prep • Crafted with Kubernetes love
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge variant="outline" style={{ gap: '4px', fontSize: '12px' }}>
                <Shield style={{ height: '12px', width: '12px' }} /> Security First
              </Badge>
              <Badge variant="outline" style={{ gap: '4px', fontSize: '12px' }}>
                <Zap style={{ height: '12px', width: '12px' }} /> Fast Practice
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
