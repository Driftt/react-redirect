'use strict';

var React = require('react'),
    createSideEffect = require('react-side-effect');

var _serverRedirect = null;

function getRedirectFromPropsList(propsList) {
    var innermostProps = propsList[propsList.length - 1];
    if (innermostProps) {
	return innermostProps.location;
    }
}

var WindowRedirect = createSideEffect(function handleChange(propsList) {
	var location = getRedirectFromPropsList(propsList);

	if (typeof document !== 'undefined') {
	    if (location)
      window.location = location;
	  } else {
	    _serverRedirect = location || null;
	}
    }, {
	displayName: 'WindowRedirect',

	propTypes: {
	    location: React.PropTypes.string.isRequired
	},

	statics: {
	    peek: function () {
		return _serverRedirect;
	    },

	    rewind: function () {
		var location = _serverRedirect;
		this.dispose();
		return location;
	    }
	}
    });

module.exports = WindowRedirect;