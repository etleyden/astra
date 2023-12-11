import React from 'react';
import logo from './logo.svg';
import Table from './components/Table';
import './App.css';

function App() {
    const testTableData = {
        "cols": ["Company", "Contact", "Country"],
        "rows":[["Alfreds Futterkiste", "Maria Anders", "Germany"],
                ["Centro comercial Moctezuma", "Francisco Chang", "Mexico"],
                ["Ernst Handel", "Roland Mendel", "Austria"],
                ["Island Trading", "Helen Bennett", "UK"],
                ["Laughing Bacchus Winecellars", "Yoshi Tannamuri", "Canada"],
                ["Magazzini Alimentari Ruiniti", "Giovanni Rovelli", "Italy"]]
        }
 
    return (
        <div className="App">
            <Table data={testTableData}/>
        </div>
    );
}

export default App;
