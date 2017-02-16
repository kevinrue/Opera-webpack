import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// On the server, this sets up a MongoDB collection called my-collection;
// On the client, this creates a cache connected to the server collection. 
export const Experiments = new Mongo.Collection('experiments');

// Let's add a publication for all tasks:
if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish the list of experiments to authenticated users
  Meteor.publish('experiments', function tasksPublication() {
    return this.userId ? Experiments.find() : [];
  });
}

Meteor.methods({
  'experiments.insert'(experimentName) {
    check(experimentName, String);
 
    // Make sure the user is logged in before inserting an experiment
    // This is currently redundant as the form is not displayed to anonymous users
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Experiments.insert({
      name: experimentName,
      Nsamples: 0
    });
  },

  'experiments.remove'(experimentId) {
    check(experimentId, String);
 
    // Make sure the user is logged in before inserting an experiment
    // This is currently redundant as the form is not displayed to anonymous users
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Experiments.remove(experimentId);
  },

});