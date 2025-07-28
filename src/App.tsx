import './App.css'
import { useState } from 'react'
import Game from './components/Game'
import type {Difficulty} from "./types";

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)

  const handleSelectDifficulty = (level: Difficulty) => {
    setDifficulty(level)
  }

  const handleGoToMenu = () => {
    setDifficulty(null)
  }

  if (difficulty) {
    return <Game difficulty={difficulty} onBackToMenu={handleGoToMenu}/>
  }
  return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
        <h1>Shape Collector</h1>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={() => handleSelectDifficulty('low')}>Low</button>
          <button onClick={() => handleSelectDifficulty('medium')}>Medium</button>
          <button onClick={() => handleSelectDifficulty('high')}>High</button>
        </div>
      </div>
  )
}

export default App