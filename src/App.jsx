import React, { Component } from 'react';
import './App.css';
import Profile from './Profile';
import Gallery from './Gallery';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      artist: null,
      tracks: []
    };
  }

  search() {
    console.log('this.state', this.state);
    const BASE_URL = 'https://api.spotify.com/v1/search?';
    let FETCH_URL = `${BASE_URL}q=${this.state.query}&type=artist&limit=1`;
    const ALBUM = 'https://api.spotify.com/v1/artists/';
    const accessToken =
      'BQD8Qyvpl5lputyLqyxMc7YgFQsr1nfR0e9PchfVOGBDyVLV5f7U5swD50E3iHypqIPJLqaolN-jld74q_U2TkHZtBmBCieUvtIAfpPgZpQpL6MEtnFv9pMllQqbygnh4Cde-PMkCtyST121UW4XjccD-BCfoXw';
    // const myHeaders = new Headers();

    const myOptions = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
      mode: 'cors',
      cache: 'default'
    };

    fetch(FETCH_URL, myOptions)
      .then(response => response.json())
      .then(json => {
        const artist = json.artists.items[0];
        this.setState({ artist });

        FETCH_URL = `${ALBUM}${artist.id}/top-tracks?country=US&`;
        fetch(FETCH_URL, myOptions)
          .then(response => response.json())
          .then(json => {
            console.log("artist's top tracks:", json);
            const { tracks } = json;
            this.setState({ tracks });
          });
      });
  }

  render() {
    return (
      <div className="App overlay">
        <div className="App-title">
          <h1>JukeBox Hero</h1>
        </div>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Search for an Artist"
              value={this.state.query}
              onChange={event => {
                this.setState({ query: event.target.value });
              }}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.search();
                }
              }}
            />
            <InputGroup.Addon onClick={() => this.search()}>
              <Glyphicon glyph="search" />
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        {this.state.artist !== null ? (
          <div>
            <Profile artist={this.state.artist} />
            <Gallery tracks={this.state.tracks} />
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default App;
