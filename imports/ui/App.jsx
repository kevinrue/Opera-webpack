import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
// Meteor.user() to get the currently logged in user
import { Meteor } from 'meteor/meteor';
// To use data from a Meteor collection inside a React component,
// we can use an Atmosphere package react-meteor-data
// which allows us to create a "data container" to feed Meteor's reactive data
// into React's component hierarchy.
import { createContainer } from 'meteor/react-meteor-data';

import { Experiments } from '../api/experiments.js';
import ExperimentsDropdown from './ExperimentsDropdown.jsx';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// Import the DataGrid component
// Data and properties are supplied further below
// There may be a better place for this line
let DataGrid = require('react-datagrid')

// App component - represents the whole app
class App extends Component {

  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const experimentName = ReactDOM.findDOMNode(this.refs.experimentNameInput).value.trim();
 
    Meteor.call('experiments.insert', experimentName);
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.experimentNameInput).value = '';
  }

  getDataGridColumns() {
    return [
      { name: '_id', width: '5%' },
      { name: 'name', width: '85%' },
      { name: 'Nsamples', title: 'Samples', width: '10%' }
    ]
  }

  getMaxExperimentId() {
    return
  }

  renderExperimentTable() {
    return (
      <DataGrid
          idProperty='id'
          dataSource={this.props.experiments}
          columns={this.getDataGridColumns()}
          style={{
            height: 200,
             width:'90%',
             marginLeft:'5%',
             marginRight:'5%'
           }}
           withColumnMenu={false}

        />
      )
  }

  renderWelcomeHeader(user) {
    return "Hello, " + (user ? user.username : "stranger") + "!"
  }

  render() {

    return (
      <div className="container">
        <AccountsUIWrapper />

        <header>
          <h1>{this.renderWelcomeHeader(this.props.currentUser)}</h1>
        </header>

        <header>
          <h2>Experiments (count: {this.props.experimentsCount})</h2>
        </header>

        <p>
          Let us imagine we have a table of experiments samples made of two columns:
        </p>
        <ul>
            <li>a friendly name</li>
            <li>the number of samples</li>
        </ul>
        <p>
          The table would then look something like the following (modulo CSS):
        </p>
        {/* Render (=insert) the experiment table here. */}
        {this.renderExperimentTable()}
        
        {/*
          The form element has an 'onSubmit' attribute that references a method on the component
          called 'handleSubmit'.
          In React, this is how you listen to browser events, like the submit event on the form.
          The input element has a ref property which will let us easily access this element later.
        */
        // Only display the form to users logged in
        this.props.currentUser ? (
          <div> {/* TODO: Make this div a Component */}
            <header>
              <h2>Add a new experiment</h2>
             </header>
             <p>
               At its simplest, adding a new experiment in the database should be as simple
               as inserting a new name in the collection of experiments, without any associated
               sample.
             </p>
             <form className="new-experiment" onSubmit={this.handleSubmit.bind(this)} >
               <input
                 type="text"
                 ref="experimentNameInput"
                 placeholder="Type to add a new experiment"
               />
             </form>
             <p>
               Note that MongoDB automatically creates an identifier for the new entry
               as described <a href="https://docs.mongodb.com/manual/reference/bson-types/#objectid">here</a>.
             </p>
             <p>
               However, the application does not check whether the name of the new experiment
               already exists in the collection. This will require some additional sanity check.
             </p>
           </div>) : ''
        }

        { this.props.currentUser ? 
          <ExperimentsDropdown label="Delete an experiment" searchable /> : ''
        }
        
      </div>
    );
  }
}

App.propTypes = {
  experiments: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

// The wrapped 'App' component fetches tasks from the Tasks collection
// and supplies them to the underlying 'App' component it wraps as the 'tasks' prop.
export default createContainer(() => {
  // let's subscribe to that publication when the App component is created
  Meteor.subscribe('experiments');

  return {
    experiments: Experiments.find({}).fetch(),
    experimentsCount: Experiments.find({}).count(),
    currentUser: Meteor.user(),
  };
}, App);