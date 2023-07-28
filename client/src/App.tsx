import './App.css';
import {ErrorJournal} from "./ErrorJournal.tsx";
import {StoredErrors} from "./StoredErrors.tsx";


function App() {

  return (
      <div className="App">

          <header className="App-header">
          <h1>Application de gestion d'erreurs</h1>
        </header>
        <main className={"container"}>
            <div>
                <ErrorJournal />
            </div>

            <div><StoredErrors/></div>
        </main>
          <footer className="bg-light text-center text-lg-start">
              <div className="text-center p-3">
                  © 2023 Copyright:
                  <a className="text-dark">Sileber Yannis</a>
              </div>
          </footer>
      </div>
  )
}

export default App
