/*jshint newcap: false */
/*global describe, it */
'use strict';
var expect = require('expect.js'),
    React = require('react'),
    ReactDOMServer = require('react-dom/server'),
    createReactClass = require('create-react-class'),
    ReactRedirect = require('../');

describe('ReactRedirect', function () {
  before(function() {
    ReactRedirect.canUseDOM = false;
  })
  it('has a displayName', function () {
    var el = React.createElement(ReactRedirect, {location: 'irrelevant'});
    expect(el.type.displayName).to.be.a('string');
    expect(el.type.displayName).not.to.be.empty();
  });
  it('hides itself from the DOM', function () {
    var Component = createReactClass({
      render: function () {
        return React.createElement(ReactRedirect, {location: 'irrelevant'}, React.createElement('div', null, 'hello'));
      }
    });
    var markup = ReactDOMServer.renderToStaticMarkup(React.createElement(Component));
    expect(markup).to.equal('<div>hello</div>');
  });
  it('throws an error if it has multiple children', function (done) {
    var Component = createReactClass({
      render: function () {
        return React.createElement(ReactRedirect, {location: 'irrelevant'},
          React.createElement('div', null, 'hello'),
          React.createElement('div', null, 'world')
        );
      }
    });
    expect(function () {
      ReactDOMServer.renderToStaticMarkup(React.createElement(Component));
    }).to.throwException(function (e) {
        expect(e.message).to.match(/^React.Children.only expected to receive a single React element child/);
        done();
      });
  });
  it('works with complex children', function () {
    var Component1 = createReactClass({
      render: function() {
        return React.createElement('p', null,
          React.createElement('span', null, 'c'),
          React.createElement('span', null, 'd')
        );
      }
    });
    var Component2 = createReactClass({
      render: function () {
        return React.createElement(ReactRedirect, {location: 'irrelevant'},
          React.createElement('div', null,
            React.createElement('div', null, 'a'),
            React.createElement('div', null, 'b'),
            React.createElement('div', null, React.createElement(Component1))
          )
        );
      }
    });
    var markup = ReactDOMServer.renderToStaticMarkup(React.createElement(Component2));
    expect(markup).to.equal(
      '<div>' +
      '<div>a</div>' +
      '<div>b</div>' +
      '<div>' +
      '<p>' +
      '<span>c</span>' +
      '<span>d</span>' +
      '</p>' +
      '</div>' +
      '</div>'
    );
  });
});

describe('ReactRedirect.rewind', function () {
  it('clears the mounted instances', function () {
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReactRedirect, {location: 'a'},
        React.createElement(ReactRedirect, {location: 'b'}, React.createElement(ReactRedirect, {location: 'c'}))
      )
    );
    expect(ReactRedirect.peek()).to.equal('c');
    ReactRedirect.rewind();
    expect(ReactRedirect.peek()).to.equal(undefined);
  });
  it('returns the latest document title', function () {
    var location = 'www.driftt.com';
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReactRedirect, {location: 'a'},
        React.createElement(ReactRedirect, {location: 'b'}, React.createElement(ReactRedirect, {location: location}))
      )
    );
    expect(ReactRedirect.rewind()).to.equal(location);
  });
  it('returns nothing if no mounted instances exist', function () {
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(ReactRedirect, {location: 'a'},
        React.createElement(ReactRedirect, {location: 'b'}, React.createElement(ReactRedirect, {location: 'c'}))
      )
    );
    ReactRedirect.rewind();
    expect(ReactRedirect.peek()).to.equal(undefined);
  });
});
