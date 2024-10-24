
import './App.css';
import './SearchDropdown';
import SearchDropdown from './SearchDropdown';
import NavBar from './NavBar';
import Footer from './Footer'
function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <main className='main-container'>
       <SearchDropdown></SearchDropdown>
      </main>
    <Footer></Footer>
    </div>
  );
}

export default App;
