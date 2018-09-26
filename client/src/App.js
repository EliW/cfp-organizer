import React, { Component } from 'react';
import moment from 'moment';
import { SortDirection } from './SortDirection.js';
import { EventRow } from './EventRow.js';
import './App.css';

class App extends Component {
  state = {
    data: [],
    filteredData: [],
    filter: '',
    sort: {
      field: '',
      direction: ''
    }
  };

  componentDidMount() {
    this.callApi()
      .then((res) => {
        // data cleanup
        return res.events.map((e) => {
          return {
            ...e,
            momentDate: !!e.date ? moment(e.date, 'MMMM DD, YYYY') : null,
            momentCfpClose: !!e.cfpClose ? moment(e.cfpClose, 'MMMM DD, YYYY HH: mm UTC') : null
          }
        })
      })
      .then(events => this.setState({ data: events, filteredData: events }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/openCfps');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  compareBy = (key, sortAsc) => {
    let comparator;
    if (sortAsc) comparator = 1;
    if (!sortAsc) comparator = -1;

    return function (a, b) {
      let aValue = a[key];
      let bValue = b[key];
      if (typeof (aValue) === "string") aValue = aValue.toLowerCase();
      if (typeof (bValue) === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return comparator * -1;
      if (aValue > bValue) return comparator * 1;
      return 0;
    };
  }

  sortBy = (sortKey, stateKey) => {
    let arrayCopy = [...this.state.filteredData];
    const sortAsc = this.state.sort.field === stateKey ? this.state.sort.direction !== 'asc' : true;
    arrayCopy.sort(this.compareBy(sortKey, sortAsc));

    this.setState({ filteredData: arrayCopy, sort: { field: stateKey, direction: sortAsc ? 'asc' : 'desc' } });
  }

  filterBy = (event, keys) => {
    let arrayCopy = [...this.state.data];
    arrayCopy = arrayCopy.filter((cfpEvent) => {
      return keys.some(key => cfpEvent[key].toLowerCase().includes(event.target.value.toLowerCase()))
    })
    this.setState({ filteredData: arrayCopy, filter: event.target.value ? event.target.name : '' })
  }

  render() {
    const rows = this.state.filteredData.map((papercallEvent, i) => <EventRow key={i} {...papercallEvent} />);

    return (
      <div className="App">
        <div className="App-header">
          <h1>CFP Organizer</h1>
          <h2>Sort and filter Papercall CFPs</h2>
        </div>
        <div className="Table">
          <header className="Table-header">
            <div className="Table-headerCell">
              <div className="Sortable" onClick={() => this.sortBy('name', 'name')}>
                <span>Name</span> 
                <SortDirection name='name' sort={this.state.sort} />
              </div>
              <input 
                type='text'
                name='name' 
                onChange={(event) => this.filterBy(event, ['name'])} 
                disabled={this.state.filter && this.state.filter !== 'name'} 
                placeholder='Search' 
              />
            </div>
            <div className="Table-headerCell">
              <div className="Sortable" onClick={() => this.sortBy('location', 'location')}>
                <span >Location</span> 
                <SortDirection name='location' sort={this.state.sort} />
              </div>
              <input 
                type='text' 
                name='location'
                onChange={(event) => this.filterBy(event, ['location', 'country', 'countryCode', 'city'])} 
                disabled={this.state.filter && this.state.filter !== 'location'} 
                placeholder='Search'/>
            </div>
            <div className="Table-headerCell">
              <div className="Sortable" onClick={() => this.sortBy('momentDate', 'date')}>
                <span >Event Date</span>
                <SortDirection name='date' sort={this.state.sort} />
              </div>
            </div>
            <div className="Table-headerCell">
              <div className="Sortable" onClick={() => this.sortBy('momentCfpClose', 'cfpClose')}>
              <span >CFP Close Date</span>
              <SortDirection name='cfpClose' sort={this.state.sort} />
              </div>
            </div>
            <div className="Table-headerCell">
              <span>Event Tags</span>
              <input 
                type='text' 
                name='eventTags'
                onChange={(event) => this.filterBy(event, ['eventTags'])} 
                disabled={this.state.filter && this.state.filter !== 'eventTags'} 
                placeholder='Search'/>
            </div>
          </header>
          <div className="Table-body">
            {rows}
          </div>
        </div>
      </div>
    );
  }
}

export default App;