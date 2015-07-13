React Document Title
====================

Provides a declarative way to specify `window.location` in a single-page app.
This component can be used on server side as well.

Built with [React Side Effect](https://github.com/gaearon/react-side-effect).

====================

## Installation

```
npm install --save react-redirect
```

Dependencies: React >= 0.11.0

## Features

* Like a normal React compoment, can use its parent's `props` and `state`;
* Can be defined in many places throughout the application;
* Supports arbitrary levels of nesting, so you can define app-wide and page-specific titles;
* Works just as well with isomorphic apps.

## Example

Assuming you use something like [react-router](https://github.com/rackt/react-router):

```javascript
var App = React.createClass({
  render: function () {
    // Redirect to "www.driftt.com" if no child overrides this
    return (
      <ReactRedirect location='www.driftt.com'>
        <this.props.activeRouteHandler />
      </ReactRedirect>
    );
  }
});

var HomePageRedirect = React.createClass({
  render: function () {
    // redirect to "www.driftt.com" while this component is mounted
    return (
      <ReactRedirect location='www.driftt.com'>
      </ReactRedirect>
    );
  }
});

var NewArticlePage = React.createClass({
  mixins: [LinkStateMixin],

  render: function () {
    // Redirect using value from state when this component is mounted
    return (
      <ReactRedirect location={this.state.redirect || ''}>
        <div>
          Redirecting...
        </div>
      </ReactRedirect>
    );
  }
});
```

## Server Usage

If you use it on server, call `ReactRedirect.rewind()` **after rendering components to string** to retrieve the redirect location given to the innermost `ReactRedirect`. You can then embed this title into HTML page template.

Because this component keeps track of mounted instances, **you have to make sure to call `rewind` on server**, or you'll get a memory leak.
