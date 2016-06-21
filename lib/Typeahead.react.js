'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TokenizerInput = require('./TokenizerInput.react');

var _TokenizerInput2 = _interopRequireDefault(_TokenizerInput);

var _TypeaheadInput = require('./TypeaheadInput.react');

var _TypeaheadInput2 = _interopRequireDefault(_TypeaheadInput);

var _TypeaheadMenu = require('./TypeaheadMenu.react');

var _TypeaheadMenu2 = _interopRequireDefault(_TypeaheadMenu);

var _lodash = require('lodash');

var _keyCode = require('./keyCode');

var _decorator = require('react-onclickoutside/decorator');

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Typeahead
 */
var Typeahead = _react2.default.createClass({
  displayName: 'Typeahead',

  propTypes: {
    /**
     * Specify menu alignment. The default value is `justify`, which makes the
     * menu as wide as the input and truncates long values. Specifying `left`
     * or `right` will align the menu to that side and the width will be
     * determined by the length of menu item values.
     */
    align: _react.PropTypes.oneOf(['justify', 'left', 'right']),
    /**
     * Allows the creation of new selections on the fly. Note that any new items
     * will be added to the list of selections, but not the list of original
     * options unless handled as such by `Typeahead`'s parent.
     */
    allowNew: _react.PropTypes.bool,
    /**
     * Specify any pre-selected options. Use only if you want the component to
     * be uncontrolled.
     */
    defaultSelected: _react.PropTypes.array,
    /**
     * Whether to disable the input. Will also disable selections when
     * `multiple={true}`.
     */
    disabled: _react.PropTypes.bool,
    /**
     * Message to display in the menu if there are no valid results.
     */
    emptyLabel: _react.PropTypes.string,
    /**
     * Specify which option key to use for display. By default, the selector
     * will use the `label` key.
     */
    labelKey: _react.PropTypes.string,
    /**
     * Maximum height of the dropdown menu, in px.
     */
    maxHeight: _react.PropTypes.number,
    /**
     * Whether or not multiple selections are allowed.
     */
    multiple: _react.PropTypes.bool,
    /**
     * Provides the ability to specify a prefix before the user-entered text to
     * indicate that the selection will be new. No-op unless `allowNew={true}`.
     */
    newSelectionPrefix: _react.PropTypes.string,
    onBlur: _react.PropTypes.func,
    /**
     * Callback for handling selected values.
     */
    onChange: _react.PropTypes.func,
    /**
     * Callback for handling changes to the user-input text.
     */
    onInputChange: _react.PropTypes.func,
    /**
     * Full set of options, including pre-selected options.
     */
    options: _react.PropTypes.array.isRequired,
    /**
     * For large option sets, initially display a subset of results for improved
     * performance. If users scroll to the end, the last item will be a link to
     * display the next set of results. Value represents the number of results
     * to display. `0` will display all results.
     */
    paginateResults: _react.PropTypes.number,
    /**
     * Placeholder text for the input.
     */
    placeholder: _react.PropTypes.string,
    /**
     * Provides a hook for customized rendering of menu item contents.
     */
    renderMenuItemChildren: _react.PropTypes.func,
    /**
     * The selected option(s) displayed in the input. Use this prop if you want
     * to control the component via its parent.
     */
    selected: _react.PropTypes.array,
    /**
     * Allows to control whether the dropdown menu is shown or not when the
     * input field is empty
     */
    hideMenuIfEmpty: _react.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      allowNew: false,
      defaultSelected: [],
      labelKey: 'label',
      multiple: false,
      selected: []
    };
  },
  getInitialState: function getInitialState() {
    var _props = this.props;
    var defaultSelected = _props.defaultSelected;
    var labelKey = _props.labelKey;
    var multiple = _props.multiple;


    var selected = this.props.selected.slice();
    if (!(0, _lodash.isEmpty)(defaultSelected)) {
      selected = defaultSelected;
    }

    var selectedText = !(0, _lodash.isEmpty)(selected) && (0, _lodash.head)(selected)[labelKey];
    var text = '';
    if (!multiple && selectedText) {
      text = selectedText;
    }

    return {
      activeIndex: 0,
      selected: selected,
      showMenu: false,
      text: text
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (!(0, _lodash.isEqual)(this.props.selected, nextProps.selected)) {
      // If new selections are passed in via props, treat the component as a
      // controlled input.
      this.setState({ selected: nextProps.selected });
    }

    if (this.props.multiple !== nextProps.multiple) {
      this.setState({ text: '' });
    }
  },
  render: function render() {
    var _props2 = this.props;
    var allowNew = _props2.allowNew;
    var labelKey = _props2.labelKey;
    var multiple = _props2.multiple;
    var options = _props2.options;
    var _state = this.state;
    var activeIndex = _state.activeIndex;
    var selected = _state.selected;
    var showMenu = _state.showMenu;
    var text = _state.text;

    // Filter out options that don't match the input string or, if multiple
    // selections are allowed, that have already been selected.

    var filteredOptions = options.filter(function (option) {
      var labelString = option[labelKey];

      if (!labelString || typeof labelString !== 'string') {
        throw new Error('One or more options does not have a valid label string. Please ' + 'check the `labelKey` prop to ensure that it matches the correct ' + 'option key and provides a string for filtering and display.');
      }

      return !(labelString.toLowerCase().indexOf(text.toLowerCase()) === -1 || multiple && (0, _lodash.find)(selected, option));
    });

    if (!filteredOptions.length && allowNew && !!text.trim()) {
      var newOption = {
        id: (0, _lodash.uniqueId)('new-id-'),
        customOption: true
      };
      newOption[labelKey] = text;
      filteredOptions = [newOption];
    }

    var InputComponent = _TokenizerInput2.default;
    var inputText = text;
    var selectedItems = selected.slice();

    if (!multiple) {
      InputComponent = _TypeaheadInput2.default;
      selectedItems = (0, _lodash.head)(selectedItems);
      inputText = selectedItems && selectedItems[labelKey] || text;
    }

    var menu = void 0;
    if (showMenu) {
      menu = _react2.default.createElement(_TypeaheadMenu2.default, {
        activeIndex: activeIndex,
        align: this.props.align,
        emptyLabel: this.props.emptyLabel,
        initialResultCount: this.props.paginateResults,
        labelKey: labelKey,
        maxHeight: this.props.maxHeight,
        newSelectionPrefix: this.props.newSelectionPrefix,
        onClick: this._handleAddOption,
        options: filteredOptions,
        renderMenuItemChildren: this.props.renderMenuItemChildren,
        text: inputText
      });
    }

    return _react2.default.createElement(
      'div',
      {
        className: 'bootstrap-typeahead open',
        style: { position: 'relative' } },
      _react2.default.createElement(InputComponent, {
        disabled: this.props.disabled,
        filteredOptions: filteredOptions,
        labelKey: labelKey,
        onAdd: this._handleAddOption,
        onBlur: this.props.onBlur,
        onChange: this._handleTextChange,
        onFocus: this._handleFocus,
        onKeyDown: this._handleKeydown.bind(null, filteredOptions),
        onRemove: this._handleRemoveOption,
        placeholder: this.props.placeholder,
        selected: selectedItems,
        text: inputText
      }),
      menu
    );
  },
  _handleFocus: function _handleFocus() {
    var hideMenuIfEmpty = this.props.hideMenuIfEmpty;
    var text = this.state.text;

    var showMenu = hideMenuIfEmpty ? text.length > 0 : true;
    this.setState({ showMenu: showMenu });
  },
  _handleTextChange: function _handleTextChange(e) {
    var hideMenuIfEmpty = this.props.hideMenuIfEmpty;

    var text = e.target.value;
    var showMenu = hideMenuIfEmpty ? text.length > 0 : true;

    // Clear any selections when text is entered.
    var selected = this.state.selected;

    if (!this.props.multiple && !(0, _lodash.isEmpty)(selected)) {
      this._handleRemoveOption((0, _lodash.head)(selected));
    }

    this.setState({
      activeIndex: 0,
      showMenu: showMenu,
      text: text
    });

    this.props.onInputChange && this.props.onInputChange(text);
  },
  _handleKeydown: function _handleKeydown(options, e) {
    var activeIndex = this.state.activeIndex;


    switch (e.keyCode) {
      case _keyCode.BACKSPACE:
        // Don't let the browser go back.
        e.stopPropagation();
        break;
      case _keyCode.UP:
      case _keyCode.DOWN:
        // Prevent page from scrolling.
        e.preventDefault();

        // Increment or decrement index based on user keystroke.
        activeIndex += e.keyCode === _keyCode.UP ? -1 : 1;

        // If we've reached the end, go back to the beginning or vice-versa.
        activeIndex = (activeIndex + options.length) % options.length;

        this.setState({ activeIndex: activeIndex });
        break;
      case _keyCode.ESC:
      case _keyCode.TAB:
        // Prevent things like unintentionally closing dialogs.
        e.stopPropagation();
        this._hideDropdown();
        break;
      case _keyCode.RETURN:
        if (this.state.showMenu) {
          var selected = options[activeIndex];
          selected && this._handleAddOption(selected);
        }
        break;
    }
  },
  _handleAddOption: function _handleAddOption(selectedOption) {
    var _props3 = this.props;
    var multiple = _props3.multiple;
    var labelKey = _props3.labelKey;
    var onChange = _props3.onChange;
    var onInputChange = _props3.onInputChange;


    var selected = void 0;
    var text = void 0;

    if (multiple) {
      // If multiple selections are allowed, add the new selection to the
      // existing selections.
      selected = this.state.selected.concat(selectedOption);
      text = '';
    } else {
      // If only a single selection is allowed, replace the existing selection
      // with the new one.
      selected = [selectedOption];
      text = selectedOption[labelKey];
    }

    this.setState({
      activeIndex: 0,
      selected: selected,
      showMenu: false,
      text: text
    });

    onChange && onChange(selected);
    onInputChange && onInputChange(text);
  },
  _handleRemoveOption: function _handleRemoveOption(removedOption) {
    var selected = this.state.selected.slice();
    selected = selected.filter(function (option) {
      return !(0, _lodash.isEqual)(option, removedOption);
    });

    this.setState({
      activeIndex: 0,
      selected: selected,
      showMenu: false
    });

    this.props.onChange && this.props.onChange(selected);
  },


  /**
   * From `listensToClickOutside` HOC.
   */
  handleClickOutside: function handleClickOutside(e) {
    this._hideDropdown();
  },
  _hideDropdown: function _hideDropdown() {
    this.setState({
      activeIndex: 0,
      showMenu: false
    });
  }
});

exports.default = (0, _decorator2.default)(Typeahead);