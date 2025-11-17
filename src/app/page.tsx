// App.jsx - Main entry point
import GameBoard from './components/GameBoard';
import GameInfo from './components/GameInfo';
import GameOverModal from './components/GameOverModal';
import LevelCompleteModal from './components/LevelCompleteModal';
import { GameProvider } from './context/GameContext';
import './page.css'

function App() {
  return (
    <GameProvider>
      <div className="gameContainer">
        <GameBoard />
        <GameInfo />
        <GameOverModal />
        <LevelCompleteModal />
      </div>
    </GameProvider>
  );
}

export default App;