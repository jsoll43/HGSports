import './App.css'

function App() {
  return (
    <main className="hello-page">
      <section className="hello-panel" aria-label="Hello world">
        <div className="mini-graphic" aria-hidden="true">
          <span className="sun"></span>
          <span className="ray ray-one"></span>
          <span className="ray ray-two"></span>
          <span className="ray ray-three"></span>
          <span className="ground"></span>
        </div>

        <div className="hello-copy">
          <p className="eyebrow">Tiny React starter</p>
          <h1>Hello World!</h1>
          <p>Fresh page, small graphic, ready to build from here.</p>
        </div>
      </section>
    </main>
  )
}

export default App
