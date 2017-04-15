/*jshint newcap: false */
/*global global, describe, it, afterEach, before, after, beforeEach */
'use strict';
var expect = require('expect.js'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    createReactClass = require('create-react-class'),
    ReactRedirect = require('../');

describe('ReactRedirect (in a browser)', function () {
  var container;
  beforeEach(function () {
    global.document = require('global/document')
    global.window = require('global/window');
    global.window.location = {}
    container = document.createElement('div');
  });
  afterEach(function () {
    ReactDOM.unmountComponentAtNode(container);
    delete global.window;
    delete global.document;
  });
  before(function() {
    ReactRedirect.canUseDOM = true;
  })

  it('changes the location on mount', function (done) {
    var location = 'www.driftt.com';
    var Component = createReactClass({
      componentDidMount: function () {
        expect(global.window.location).to.equal(location);
        done();
      },
      render: function () {
        return React.createElement(ReactRedirect, {location: location});
      }
    });
    ReactDOM.render(React.createElement(Component), container);
  });

  it('supports nesting', function (done) {
    var called = false;
    var location = 'www.driftt.com';
    var Component1 = createReactClass({
      componentDidMount: function () {
        setTimeout(function () {
          expect(called).to.be(true);
          expect(global.window.location).to.equal('location');
          done();
        });
      },
      render: function () {
        console.log('render1')
        return React.createElement(ReactRedirect, {location: location});
      }
    });
    var Component2 = createReactClass({
      componentDidMount: function () {
        called = true;
      },
      render: function () {
        console.log('render2')
        return React.createElement(ReactRedirect, {location: 'hell nah'},
          React.DOM.div(null, React.createElement(Component1))
        );
      }
    });
    ReactDOM.render(React.createElement(Component2), container);
  });
});
