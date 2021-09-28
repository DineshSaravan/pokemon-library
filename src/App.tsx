import React, {FC} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import pokeball from './pokeball.png'
import './App.css';
import DataListView from "./views/DataLists/DataListView";

const App: FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <img src={pokeball} className="App-logo" alt="logo" />
            </header>
            <Switch>
                <Route exact path="/pokemons" component={DataListView}/>
                <Route exact path="/pokemons/:number" component={DataListView}/>

                <Redirect exact from="/" to="/pokemons"/>
            </Switch>
        </div>
    );
};

export default App;
