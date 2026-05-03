export interface Question {
  id: number;
  text: string;
  trait: "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "neuroticism";
  options: {
    label: string;
    value: number; // -2 to 2 typically, or 1 to 5
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "I am the life of the party.",
    trait: "extraversion",
    options: [
      { label: "Strongly Disagree", value: 1 },
      { label: "Disagree", value: 2 },
      { label: "Neutral", value: 3 },
      { label: "Agree", value: 4 },
      { label: "Strongly Agree", value: 5 },
    ],
  },
  {
    id: 2,
    text: "I symphathize with others' feelings.",
    trait: "agreeableness",
    options: [
      { label: "Strongly Disagree", value: 1 },
      { label: "Disagree", value: 2 },
      { label: "Neutral", value: 3 },
      { label: "Agree", value: 4 },
      { label: "Strongly Agree", value: 5 },
    ],
  },
  {
    id: 3,
    text: "I get chores done right away.",
    trait: "conscientiousness",
    options: [
      { label: "Strongly Disagree", value: 1 },
      { label: "Disagree", value: 2 },
      { label: "Neutral", value: 3 },
      { label: "Agree", value: 4 },
      { label: "Strongly Agree", value: 5 },
    ],
  },
  {
    id: 4,
    text: "I have a rich vocabulary and love complex ideas.",
    trait: "openness",
    options: [
      { label: "Strongly Disagree", value: 1 },
      { label: "Disagree", value: 2 },
      { label: "Neutral", value: 3 },
      { label: "Agree", value: 4 },
      { label: "Strongly Agree", value: 5 },
    ],
  },
  {
    id: 5,
    text: "I have frequent mood swings.",
    trait: "neuroticism",
    options: [
      { label: "Strongly Disagree", value: 1 },
      { label: "Disagree", value: 2 },
      { label: "Neutral", value: 3 },
      { label: "Agree", value: 4 },
      { label: "Strongly Agree", value: 5 },
    ],
  },
  {
    id: 6,
    text: "I don't talk a lot and prefer quiet environments.",
    trait: "extraversion",
    options: [
      { label: "Strongly Disagree", value: 5 },
      { label: "Disagree", value: 4 },
      { label: "Neutral", value: 3 },
      { label: "Agree", value: 2 },
      { label: "Strongly Agree", value: 1 },
    ],
  },
  {
    id: 7,
    text: "I am not interested in other people's problems.",
    trait: "agreeableness",
    options: [
      { label: "Strongly Disagree", value: 5 },
      { label: "Disagree", value: 4 },
      { label: "Neutral", value: 3 },
      { label: "Agree", value: 2 },
      { label: "Strongly Agree", value: 1 },
    ],
  },
  {
    id: 8,
    text: "I often forget to put things back in their proper place.",
    trait: "conscientiousness",
    options: [
      { label: "Strongly Disagree", value: 5 },
      { label: "Disagree", value: 4 },
      { label: "Neutral", value: 3 },
      { label: "Agree", value: 2 },
      { label: "Strongly Agree", value: 1 },
    ],
  },
  {
    id: 9,
    text: "I am not interested in abstract ideas.",
    trait: "openness",
    options: [
      { label: "Strongly Disagree", value: 5 },
      { label: "Disagree", value: 4 },
      { label: "Neutral", value: 3 },
      { label: "Agree", value: 2 },
      { label: "Strongly Agree", value: 1 },
    ],
  },
  {
    id: 10,
    text: "I am relaxed most of the time.",
    trait: "neuroticism",
    options: [
      { label: "Strongly Disagree", value: 5 },
      { label: "Disagree", value: 4 },
      { label: "Neutral", value: 3 },
      { label: "Agree", value: 2 },
      { label: "Strongly Agree", value: 1 },
    ],
  },
];
