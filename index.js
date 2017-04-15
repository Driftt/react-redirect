'use strict';

var React = require('react'),
    PropTypes = require('prop-types'),
    withSideEffect = require('react-side-effect');

function reducePropsToState(propsList) {
  var innermostProps = propsList[propsList.length - 1];
  if (innermostProps) {
    return innermostProps.location;
  }
}

function handleStateChangeOnClient(location) {
  if (location) { window.location = location };
};

function ReactRedirect() {}
ReactRedirect.prototype = Object.create(React.Component.prototype);
ReactRedirect.displayName = 'ReactRedirect';
ReactRedirect.propTypes = { location: PropTypes.string.isRequired };

ReactRedirect.prototype.render = function() {
  if (this.props.children) {
    return React.Children.only(this.props.children);
  } else {
    return null;
  }
};

module.exports = withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(ReactRedirect);
