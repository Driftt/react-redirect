/*jshint newcap: false */
/*global global, describe, it, afterEach, before, after */
'use strict';
var expect = require('expect.js'),
  React = require('react'),
  ReactRedirect = require('../');

describe('DocumentTitle (in a browser)', function () {
  afterEach(function () {
    React.unmountComponentAtNode(global.document.body);
    delete global.document.title;
  });
  before(function () {
    // Prepare the globals React expects in a browser
    global.window = require('global/window');
    global.document = require('global/document');
    global.window.document = document;
    global.window.location = {};
    global.window.navigator = {userAgent: 'Chrome'};
    console.debug = console.log;
  });
  after(function () {
    delete global.window;
    delete global.document;
    delete console.debug;
  });
  it('changes the document title on mount', function (done) {
    var location = 'www.driftt.com';
    var Component = React.createClass({
      componentDidMount: function () {
        expect(global.window.location).to.equal(location);
        done();
      },
      render: function () {
        return React.createElement(ReactRedirect, {location: location});
      }
    });
    React.render(React.createElement(Component), global.document.body);
  });
  it('supports nesting', function (done) {
    var component2Called = false;
    var location = 'www.driftt.com';
    var Component1 = React.createClass({
      componentDidMount: function () {
        setTimeout(function () {
          expect(component2Called).to.be(true);
          expect(global.window.location).to.equal(location);
          done();
        });
      },
      render: function () {
        return React.createElement(ReactRedirect, {location: location});
      }
    });
    var Component2 = React.createClass({
      componentDidMount: function () {
        component2Called = true;
      },
      render: function () {
        return React.createElement(ReactRedirect, {location: 'hell nah'},
          React.DOM.div(null, React.createElement(Component1))
        );
      }
    });
    React.render(React.createElement(Component2), global.document.body);
  });
});