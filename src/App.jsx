import { useState } from 'react'
import Registeration from './Registeration';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Registeration/>
    </div>
  );
}

export default App
