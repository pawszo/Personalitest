import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Brain, ArrowRight, RefreshCw, ChevronRight, Activity } from "lucide-react";
import { questions } from "./data/questions";
import { PersonalityScores, PersonalityResult, getPersonalityAnalysis } from "./services/gemini";

// --- Components ---

function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-200 rounded-full blur-[100px] opacity-40 animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-amber-200 rounded-full blur-[100px] opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100 rounded-full blur-[120px] opacity-30" />
      <div className="absolute top-12 right-12 flex gap-4 z-20">
        <div className="w-3 h-3 bg-pink-500 rounded-full shadow-lg shadow-pink-200" />
        <div className="w-3 h-3 bg-amber-500 rounded-full shadow-lg shadow-amber-200" />
        <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-200" />
      </div>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="relative z-10 w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/50 overflow-hidden flex flex-col md:flex-row min-h-[600px]"
    >
      <div className="w-full md:w-80 bg-indigo-600 p-12 flex flex-col justify-center text-white">
        <Brain className="w-16 h-16 mb-8 text-indigo-300" />
        <h3 className="text-3xl font-black leading-tight mb-4">Deep Insights Await.</h3>
        <p className="text-indigo-100 opacity-80 text-sm leading-relaxed">
          Unlock the secrets of your psychological profile using real-time analysis and Generative AI.
        </p>
      </div>
      <div className="flex-1 p-12 flex flex-col justify-center items-center text-center">
        <div className="bg-indigo-50 p-4 rounded-2xl mb-8">
          <Sparkles className="w-10 h-10 text-indigo-600" />
        </div>
        <h1 className="text-5xl font-black text-slate-800 mb-6 tracking-tight leading-tight">
          Discover Your <br />
          <span className="text-indigo-600 italic underline decoration-amber-400 decoration-4 underline-offset-4">Persona</span> Type
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto">
          Embark on a high-fidelity voyage of self-discovery mapping your unique atmospheric traits.
        </p>
        <button
          onClick={onStart}
          id="start-quiz-btn"
          className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 hover:shadow-2xl transition-all group flex items-center gap-3"
        >
          Begin Discovery
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

function Quiz({ onComplete, answers: rawAnswers }: { onComplete: (scores: PersonalityScores) => void; answers: Record<string, number[]>; }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({
    openness: [],
    conscientiousness: [],
    extraversion: [],
    agreeableness: [],
    neuroticism: [],
  });

  const question = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  const handleSelect = (value: number) => {
    const newAnswers = { ...answers };
    newAnswers[question.trait] = [...newAnswers[question.trait], value];
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const average = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 3);
      const scores: PersonalityScores = {
        openness: average(newAnswers.openness),
        conscientiousness: average(newAnswers.conscientiousness),
        extraversion: average(newAnswers.extraversion),
        agreeableness: average(newAnswers.agreeableness),
        neuroticism: average(newAnswers.neuroticism),
      };
      onComplete(scores);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      const prevTrait = questions[prevIdx].trait;
      const newAnswers = { ...answers };
      newAnswers[prevTrait] = newAnswers[prevTrait].slice(0, -1);
      setAnswers(newAnswers);
      setCurrentIdx(prevIdx);
    }
  };

  // Trait calculation for sidebar visualization
  const getTraitScore = (trait: keyof PersonalityScores) => {
    const vals = answers[trait];
    if (vals.length === 0) return 50; // default
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return (avg / 5) * 100;
  };

  return (
    <div className="relative z-10 w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/50 overflow-hidden flex flex-col md:flex-row min-h-[640px]">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-indigo-600 p-8 flex flex-col justify-between text-white shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <div className="w-4 h-4 bg-indigo-600 rounded-sm rotate-45" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight leading-none">Persona</span>
          </div>

          <h3 className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-8">Real-time Analysis</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase">
                <span>Creativity</span>
                <span>{Math.round(getTraitScore("openness"))}%</span>
              </div>
              <div className="h-1.5 w-full bg-indigo-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "50%" }}
                  animate={{ width: `${getTraitScore("openness")}%` }}
                  className="h-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase">
                <span>Social</span>
                <span>{Math.round(getTraitScore("extraversion"))}%</span>
              </div>
              <div className="h-1.5 w-full bg-indigo-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "50%" }}
                  animate={{ width: `${getTraitScore("extraversion")}%` }}
                  className="h-full bg-pink-400 transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase">
                <span>Empathy</span>
                <span>{Math.round(getTraitScore("agreeableness"))}%</span>
              </div>
              <div className="h-1.5 w-full bg-indigo-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "50%" }}
                  animate={{ width: `${getTraitScore("agreeableness")}%` }}
                  className="h-full bg-emerald-400 transition-all" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-700/50 p-5 rounded-2xl border border-white/10 mt-8">
          <p className="text-indigo-100 text-xs leading-relaxed italic opacity-80">
            "Your pattern suggests a unique blend of curiosity and social resonance."
          </p>
        </div>
      </div>

      {/* Main quiz content */}
      <div className="flex-1 p-8 md:p-12 flex flex-col">
        <div className="flex justify-between items-center mb-12">
          <div className="flex gap-1.5">
            {Array.from({ length: questions.length }).map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-500 ${
                  i < currentIdx ? "w-8 bg-indigo-600" : 
                  i === currentIdx ? "w-10 bg-indigo-600 shadow-md shadow-indigo-200" : "w-2 bg-indigo-100"
                }`} 
              />
            ))}
          </div>
          <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter">
            Question {String(currentIdx + 1).padStart(2, '0')} <span className="font-normal opacity-50">/ {String(questions.length).padStart(2, '0')}</span>
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 leading-[1.2]">
                  {question.text.split(' ').map((word, i) => {
                    const emphasized = ["roadblock", "unexpected", "chores", "feelings", "party", "ideas", "mood", "talk", "problems", "proper", "abstract", "relaxed"].includes(word.toLowerCase().replace(/[.,!]/g, ''));
                    return (
                      <span key={i} className={emphasized ? "text-indigo-600 italic underline decoration-amber-400 decoration-4 underline-offset-4 mr-2" : "mr-2"}>
                        {word}
                      </span>
                    );
                  })}
                </h1>
                <p className="text-slate-500 md:text-lg max-w-lg">
                  Pick the option that resonates most naturally with your spontaneous self.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {question.options.map((opt, idx) => {
                  const colors = [
                    "bg-pink-50 text-pink-600",
                    "bg-indigo-50 text-indigo-600",
                    "bg-amber-50 text-amber-600",
                    "bg-emerald-50 text-emerald-600",
                    "bg-slate-50 text-slate-600"
                  ];
                  return (
                    <button
                      key={idx}
                      id={`opt-${idx}`}
                      onClick={() => handleSelect(opt.value)}
                      className="p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all group shadow-sm flex flex-col"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${colors[idx % colors.length]}`}>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <span className="block font-black text-slate-800 mb-1">{opt.label}</span>
                      <span className="text-xs text-slate-400 font-medium leading-tight">Selection confirms choice.</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex justify-between items-center">
          <button 
            onClick={handleBack}
            disabled={currentIdx === 0}
            className="text-slate-400 font-bold hover:text-slate-600 disabled:opacity-0 flex items-center gap-2 transition-all"
          >
            ← Back
          </button>
          <div className="text-[10px] font-mono text-slate-300 tracking-widest uppercase">
            Interactive Analysis Environment
          </div>
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl p-12 text-center border border-white/50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="inline-block mb-8"
      >
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <RefreshCw className="w-8 h-8 text-white" />
        </div>
      </motion.div>
      <h2 className="text-3xl font-black text-slate-800 mb-4">Synthesizing Profile</h2>
      <p className="text-slate-500 font-medium leading-relaxed animate-pulse">
        Our neural engine is mapping your response patterns to high-fidelity personality archetypes.
      </p>
    </div>
  );
}

function Result({ result, onRestart }: { result: PersonalityResult; onRestart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/50 overflow-hidden flex flex-col md:flex-row min-h-[640px]"
    >
      <div className="w-full md:w-80 bg-slate-900 p-12 flex flex-col justify-between text-white shrink-0">
        <div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">The Verdict</h3>
          <h2 className="text-4xl font-black mb-8 leading-tight">{result.archetype}</h2>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "{result.description}"
            </p>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="mt-12 w-full py-4 rounded-2xl border-2 border-white/10 text-white hover:bg-white/5 transition-all font-bold flex items-center justify-center gap-2 group"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Re-evaluate
        </button>
      </div>

      <div className="flex-1 p-8 md:p-16 flex flex-col">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-pink-600" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Core Strengths</h3>
            </div>
            <ul className="space-y-4">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex gap-3 text-slate-600 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Brain className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Blind Spots</h3>
            </div>
            <ul className="space-y-4">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="flex gap-3 text-slate-600 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="bg-amber-50 rounded-[2.5rem] p-10 border border-amber-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/50 rounded-full blur-3xl -mr-16 -mt-16" />
          <h3 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-8 relative z-10">Optimized Growth Pathways</h3>
          <div className="grid sm:grid-cols-3 gap-8 relative z-10">
            {result.growthTips.map((tip, i) => (
              <div key={i} className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center text-sm font-black text-amber-600 shadow-sm">
                  {i + 1}
                </div>
                <p className="text-sm text-amber-900/70 leading-relaxed font-bold">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


// --- Main App ---

export default function App() {
  const [step, setStep] = useState<"intro" | "quiz" | "loading" | "result">("intro");
  const [result, setResult] = useState<PersonalityResult | null>(null);

  const startQuiz = () => setStep("quiz");
  
  const completeQuiz = async (scores: PersonalityScores) => {
    setStep("loading");
    try {
      const analysis = await getPersonalityAnalysis(scores);
      setResult(analysis);
      setStep("result");
    } catch (error) {
      console.error(error);
      setStep("intro"); // Fallback
      alert("Failed to connect to Gemini. Please verify your environment.");
    }
  };

  const restart = () => {
    setResult(null);
    setStep("intro");
  };

  return (
    <div className="min-h-screen bg-indigo-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col relative overflow-x-hidden">
      <Background />

      <header className="px-8 py-6 relative z-50 flex justify-between items-center w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3" id="logo">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="font-black tracking-tight text-2xl text-slate-800">PersonaQuest</span>
        </div>
        <nav className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <a href="#" className="hover:text-indigo-600 transition-colors">Atmospheric Test</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Neural Methods</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Growth Hub</a>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10 w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <Intro onStart={startQuiz} />
            </motion.div>
          )}
          {step === "quiz" && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <Quiz onComplete={completeQuiz} answers={{}} />
            </motion.div>
          )}
          {step === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <Loading />
            </motion.div>
          )}
          {step === "result" && result && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <Result result={result} onRestart={restart} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-10 relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/40 mt-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Neural-Mapping Protocols Active
        </p>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full border border-white bg-white/20 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer">
            <Activity className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 rounded-full border border-white bg-white/20 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer">
            <Brain className="w-5 h-5" />
          </div>
        </div>
      </footer>
    </div>
  );
}

