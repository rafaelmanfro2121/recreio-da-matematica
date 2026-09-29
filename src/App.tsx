import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { HubPage } from "./pages/HubPage";
import { MathModule } from "./modules/math/MathModule";
import { LogicModule } from "./modules/logic/LogicModule";
import { QuickThinkModule } from "./modules/quickthink/QuickThinkModule";
import { FocusModule } from "./modules/focus/FocusModule";
import { PageTransition } from "./shared/components/PageTransition";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HubPage />
            </PageTransition>
          }
        />
        <Route
          path="/matematica/*"
          element={
            <PageTransition>
              <MathModule />
            </PageTransition>
          }
        />
        <Route
          path="/mente/*"
          element={
            <PageTransition>
              <LogicModule />
            </PageTransition>
          }
        />
        <Route
          path="/reflexo/*"
          element={
            <PageTransition>
              <QuickThinkModule />
            </PageTransition>
          }
        />
        <Route
          path="/foco/*"
          element={
            <PageTransition>
              <FocusModule />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return <AnimatedRoutes />;
}

export default App;
