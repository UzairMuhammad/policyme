import { useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js';
import CharacterSheet from './CharacterSheet'

function App() {
  const [num, setNum] = useState<number>(0);
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise - Uzair Muhammad</h1>
      </header>
      <section className="App-section">
      <CharacterSheet /> 
      </section>
    </div>
  );
}

export default App;
