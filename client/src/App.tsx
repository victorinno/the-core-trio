/**
 * STYLE — Afterglow has one uninterrupted visual-novel stage; React remains an invisible picture frame.
 */
import ErrorBoundary from "./components/ErrorBoundary";
import GameCanvas from "./components/GameCanvas";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <GameCanvas />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
