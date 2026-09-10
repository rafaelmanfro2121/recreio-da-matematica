import { Route, Routes } from "react-router-dom";
import { LevelMapScreen } from "./screens/LevelMapScreen";
import { LessonScreen } from "./screens/LessonScreen";
import { QuizScreen } from "./screens/QuizScreen";
import { PracticeScreen } from "./screens/PracticeScreen";
import { TabuadaScreen } from "./screens/TabuadaScreen";

export function MathModule() {
  return (
    <Routes>
      <Route index element={<LevelMapScreen />} />
      <Route path="licao/:levelId" element={<LessonScreen />} />
      <Route path="quiz/:levelId" element={<QuizScreen />} />
      <Route path="jogar/:levelId" element={<PracticeScreen />} />
      <Route path="tabuada" element={<TabuadaScreen />} />
    </Routes>
  );
}
