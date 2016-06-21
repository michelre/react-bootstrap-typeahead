'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactHighlighter = require('react-highlighter');

var _reactHighlighter2 = _interopRequireDefault(_reactHighlighter);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Menu = function Menu(props) {
  return _react2.default.createElement(
    'ul',
    _extends({}, props, {
      className: (0, _classnames2.default)('dropdown-menu', props.className) }),
    props.children
  );
};

var MenuItem = _react2.default.createClass({
  displayName: 'MenuItem',

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      (0, _reactDom.findDOMNode)(this).firstChild.focus();
    }
  },
  render: function render() {
    return _react2.default.createElement(
      'li',
      {
        className: (0, _classnames2.default)({
          'active': this.props.active,
          'disabled': this.props.disabled
        }, this.props.className) },
      _react2.default.createElement(
        'a',
        { href: '#', onClick: this._handleClick },
        this.props.children
      )
    );
  },
  _handleClick: function _handleClick(e) {
    e.preventDefault();
    this.props.onClick && this.props.onClick();
  }
});

var TypeaheadMenu = _react2.default.createClass({
  displayName: 'TypeaheadMenu',

  propTypes: {
    activeIndex: _react.PropTypes.number,
    align: _react.PropTypes.oneOf(['justify', 'left', 'right']),
    emptyLabel: _react.PropTypes.string,
    initialResultCount: _react.PropTypes.number,
    labelKey: _react.PropTypes.string.isRequired,
    maxHeight: _react.PropTypes.number,
    newSelectionPrefix: _react.PropTypes.string,
    options: _react.PropTypes.array,
    renderMenuItemChildren: _react.PropTypes.func,
    text: _react.PropTypes.string.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      align: 'justify',
      emptyLabel: 'No matches found.',
      initialResultCount: 100,
      maxHeight: 300,
      newSelectionPrefix: 'New selection:'
    };
  },
  getInitialState: function getInitialState() {
    return {
      /**
       * Max number of results to display, for performance reasons. If this
       * number is less than the number of available results, the user will see
       * an option to display more results.
       */
      resultCount: this.props.initialResultCount
    };
  },
  render: function render() {
    var _props = this.props;
    var align = _props.align;
    var maxHeight = _props.maxHeight;
    var options = _props.options;

    // Render the max number of results or all results.

    var results = options.slice(0, this.state.resultCount || options.length);
    results = results.length ? results.map(this._renderMenuItem) : _react2.default.createElement(
      MenuItem,
      { disabled: true },
      this.props.emptyLabel
    );

    // Allow user to see more results, if available.
    var paginationItem = void 0;
    var separator = void 0;
    if (results.length < options.length) {
      paginationItem = _react2.default.createElement(
        MenuItem,
        {
          className: 'bootstrap-typeahead-menu-paginator',
          onClick: this._handlePagination },
        'Display next ',
        this.props.initialResultCount,
        ' results...'
      );
      separator = _react2.default.createElement('li', { className: 'divider', role: 'separator' });
    }

    return _react2.default.createElement(
      Menu,
      {
        className: (0, _classnames2.default)('bootstrap-typeahead-menu', {
          'dropdown-menu-justify': align === 'justify',
          'dropdown-menu-right': align === 'right'
        }),
        style: {
          maxHeight: maxHeight + 'px',
          overflow: 'auto'
        } },
      results,
      separator,
      paginationItem
    );
  },
  _renderMenuItem: function _renderMenuItem(option, idx) {
    var _props2 = this.props;
    var activeIndex = _props2.activeIndex;
    var labelKey = _props2.labelKey;
    var newSelectionPrefix = _props2.newSelectionPrefix;
    var onClick = _props2.onClick;
    var renderMenuItemChildren = _props2.renderMenuItemChildren;
    var text = _props2.text;


    var menuItemProps = {
      active: idx === activeIndex,
      key: idx,
      onClick: onClick.bind(null, option)
    };

    return renderMenuItemChildren ? _react2.default.createElement(
      MenuItem,
      menuItemProps,
      renderMenuItemChildren(this.props, option, idx)
    ) : _react2.default.createElement(
      MenuItem,
      menuItemProps,
      option.customOption && newSelectionPrefix + ' ',
      _react2.default.createElement(
        _reactHighlighter2.default,
        { search: text },
        option[labelKey]
      )
    );
  },
  _handlePagination: function _handlePagination(e) {
    var resultCount = this.state.resultCount + this.props.initialResultCount;
    this.setState({ resultCount: resultCount });
  }
});

exports.default = TypeaheadMenu;