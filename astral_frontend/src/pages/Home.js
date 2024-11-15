import logo from '../logo.svg';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function Home() {
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>Welcome to Astral!</h1>
            <div>
              <a className="mx-3 btn btn-primary" href="/login">Login</a>
              <a className="mx-3 btn btn-primary" href="/register">Register</a>
            </div>
          </header>
        </div>
      );
}

export default Home;