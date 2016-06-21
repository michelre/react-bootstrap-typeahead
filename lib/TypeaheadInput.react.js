'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require('lodash');

var _keyCode = require('./keyCode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * TypeaheadInput
 *
 * Handles a single selection from the Typeahead component.
 */
var TypeaheadInput = _react2.default.createClass({
  displayName: 'TypeaheadInput',

  propTypes: {
    disabled: _react.PropTypes.bool,
    filteredOptions: _react.PropTypes.array,
    labelKey: _react.PropTypes.string,
    onBlur: _react.PropTypes.func,
    onChange: _react.PropTypes.func,
    selected: _react.PropTypes.object,
    text: _react.PropTypes.string
  },

  getInitialState: function getInitialState() {
    return {
      isFocused: false
    };
  },
  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var disabled = _props.disabled;
    var selected = _props.selected;
    var text = _props.text;


    return _react2.default.createElement(
      'div',
      {
        className: (0, _classnames2.default)('bootstrap-typeahead-input', className),
        onClick: this._handleInputFocus,
        onFocus: this._handleInputFocus,
        style: { outline: 'none' },
        tabIndex: -1 },
      _react2.default.createElement('input', _extends({}, this.props, {
        className: (0, _classnames2.default)('bootstrap-typeahead-input-main', 'form-control', {
          'has-selection': !selected
        }),
        onBlur: this._handleBlur,
        onKeyDown: this._handleKeydown,
        ref: 'input',
        style: {
          backgroundColor: !disabled && 'transparent',
          display: 'block',
          position: 'relative',
          zIndex: 1
        },
        type: 'text',
        value: text
      })),
      _react2.default.createElement('input', {
        className: 'bootstrap-typeahead-input-hint form-control',
        style: {
          borderColor: 'transparent',
          bottom: 0,
          boxShadow: 'none',
          display: 'block',
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: 0
        },
        tabIndex: -1,
        type: 'text',
        value: this._getHintText()
      })
    );
  },
  _getHintText: function _getHintText() {
    var _props2 = this.props;
    var filteredOptions = _props2.filteredOptions;
    var labelKey = _props2.labelKey;
    var text = _props2.text;

    var firstOption = (0, _lodash.head)(filteredOptions);

    // Only show the hint if...
    if (
    // ...the input is focused.
    this.state.isFocused &&
    // ...the input contains text.
    text &&
    // ...the input text corresponds to the beginning of the first option.
    firstOption && firstOption[labelKey].indexOf(text) === 0) {
      return firstOption[labelKey];
    }

    return '';
  },
  _handleBlur: function _handleBlur(e) {
    this.setState({ isFocused: false });
    this.props.onBlur && this.props.onBlur(e);
  },


  /**
   * If the containing parent div is focused or clicked, focus the input.
   */
  _handleInputFocus: function _handleInputFocus(e) {
    this.setState({ isFocused: true });
    this.refs.input.focus();
  },
  _handleKeydown: function _handleKeydown(e) {
    var _props3 = this.props;
    var filteredOptions = _props3.filteredOptions;
    var onAdd = _props3.onAdd;
    var onRemove = _props3.onRemove;
    var selected = _props3.selected;


    switch (e.keyCode) {
      case _keyCode.RIGHT:
        // Autocomplete the selection if there's a hint and no selection yet.
        if (this._getHintText() && !selected) {
          onAdd && onAdd((0, _lodash.head)(filteredOptions));
        }
        break;
      case _keyCode.BACKSPACE:
        // Remove the selection if we start deleting it.
        selected && onRemove && onRemove(selected);
        break;
    }

    this.props.onKeyDown && this.props.onKeyDown(e);
  }
});

exports.default = TypeaheadInput;