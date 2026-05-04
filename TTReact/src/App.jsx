import Header from './components/layout/Header'
import FlashcardApp from './components/flashcard/FlashcardApp'

import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <FlashcardApp />
      </main>
    </div>
  )
}

export default App