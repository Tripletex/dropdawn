
function SelectButton(props) {
  
  const labelStyleClasses = [
    'dropdown__label',
    props.value ? 'dropdown__label--float-above' : '',
  ].join(' ');

  const className = 'dropdown__button' + (props.expanded ? ' dropdown__button--focus' : '') + (props.readonly ? ' dropdown__button--readonly' : '');
  const hideLabel = props.hideLabelWhenSelected && props.value;

  return (
    <button
      className={className}
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
      role="combobox"
      aria-expanded={props.expanded}
      disabled={props.disabled}
      readonly={props.readonly}
      type="button"
      >
      <div className="dropdown__button--text-wrapper">
        {hideLabel ? null : <div className={labelStyleClasses}>{props.label}</div>}
        <div className="dropdown__selected-text">{props.value}</div>
      </div>
      {props.readonly ? null : <i className="material-icons dropdown__button--icon">arrow_drop_down</i>}
    </button>
  );
}

class SelectDropdown extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      highlighted: this.props.selected || this.props.options[0],
      searchValue: this.props.query,
      // Used to place dropdown, it must be placed after first render, when we know its height
      hasRendered: false
    }
    
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
    this.setState({searchValue: event.target.value});
    this.props.updateSearch(event.target.value, false);
  }
  
  /* 
   * Try to place dropdown such that it is visible on screen, don't cover the dropdown button
   * and preferable is below button if space.
   *
   */
  placeDropdown() {
    if(!this.dropdown) return {};
    // Either below, if it is space.
    // Or "best as possible"
    const buttonRect = this.props.button.getBoundingClientRect();
    const dropdownRect = this.dropdown.getBoundingClientRect();
    const innerHeight = window.innerHeight;
    
    if(buttonRect.top + buttonRect.height + dropdownRect.height > innerHeight) return {bottom: 0}
    
    return {top: (buttonRect.top + buttonRect.height) + 'px'};
  }
  
 
  /*
  * Move highlight up and down on arrow up/down.
  * Make selection and close on Enter and Space.
  * Close without changing selection on Esc.
  */
  onKeyDown(e) {
    
    const changeHighlight = to => {
      var index = this.props.options.indexOf(this.state.highlighted) + to;
      console.log('change highlighted' + index)
      if(index < 0 || index >= this.props.options.length) return;
      this.setState({highlighted: this.props.options[index]}, this.scrollToHighlighted.bind(this, false));
    }

    // Select next
    switch(e.which || e.keyCode) {
      case 40:
        changeHighlight(1);
        break;
      case 38:
        changeHighlight(-1);
        break;

      case 13: // Enter
        if(this.props.options.length === 0) {
          e.preventDefault();
          e.stopPropagation;
          return false;
        }
        this.props.selectOption(this.state.highlighted);
        e.preventDefault();
        break;
      case 27: // Esc
        this.props.selectOption(this.props.selected);
        break;
      case 9: // Tab: Do nothing
        e.preventDefault();
        e.stopPropagation;
        return false;
        break;
    }
  }
  
  scrollToHighlighted(instant) {
    const highlighted = this.theList.querySelector('.highlighted');
    if(highlighted === null) return;
    highlighted.scrollIntoView({
      behavior: instant ? 'instant' : 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    let search = this.search;
    if(!search) return;
    search.focus();
    search.selectionStart = search.selectionEnd = search.value.length;
    this.setState({hasRendered: true});
    this.scrollToHighlighted(true);
  }
  
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  createNew() {
    const cb = option => this.props.selectOption(option);
    this.props.createNew(cb);
  }
  
  render () {
    if(this.props.options.length > 0 && !this.props.options.some(a => a.value === this.state.highlighted.value)) {
      this.setState(prevState => ({highlighted: this.props.options[0]}))
    }
    
    return (
      <div ref={dropdown => this.dropdown = dropdown} style={this.placeDropdown()} className="dropdown__dropdown-container">
        {!this.props.hideSearch ? (<div className="dropdown__searchBox--container">
          <input
            className="dropdown__searchBox--input"
            ref={input => this.search = input}
            onChange={this.handleChange}
            name="searchbox"
            value={this.state.searchValue} />
          <i className="material-icons dropdown__searchBox--icon">search</i>
          {
            this.props.createNew ? 
              <button onClick={_ => this.createNew()} className="dropdown__searchBox--addNew"><i className="material-icons">add</i></button> :
            null
          }
        </div>) : null}
        <div className="dropdown__options--container">
          <ul ref={theList => this.theList = theList} className="dropdown__options" role="listbox">
          {this.props.options.map((option, index) => {
            const classes = ['dropdown__options--list-item', (this.state.highlighted.value === option.value ? ' highlighted' : '')].join(' ');
            return <li key={option.value} role="option" onClick={e => this.props.selectOption(option)} className={classes}>
              {option.content}
            </li>;
          })}
          </ul>
        </div>
      </div>
    );
  }
}

class Dropdawn extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      selected: props.selected || null,
      open: false,
      // Props options: All available options, State options: The one you can see after filtering etc.
      options: this.getOptions(),
      query: ''
    };
    
    this.clickOutsideOfWidget = this.clickOutsideOfWidget.bind(this);
    this.onButtonKeyDown = this.onButtonKeyDown.bind(this);;
    this.selectOption = this.selectOption.bind(this);
    this.updateSearch = this.updateSearch.bind(this);

  }

  getOptions() {
    let options = (this.props.options || []).slice(0);
    if(this.props.removeSelectedText) {
      options.unshift({
        content: this.props.removeSelectedText
      });
    }
    return options;
  }

  updateSearch(value) {
   
    // For redux friendly usage
    if(this.props.onInput) {
      this.props.onInput(value);
      return;
    }

    // Could also potentially call an API handler here ...
    if(this.props.apiCall) {
      this.props.apiCall(value).then(options => this.setState({options}));
      return
    }

    this.setState({options: this.getOptions().filter(option => {
      return (option.displayName || option.content).toLowerCase().indexOf(value.toLowerCase()) !== -1;
    })})
    
  }
  
  selectOption(option) {
    this.setState({selected: option.value === undefined ? null : option});
    if(this.props.onChange) {
      this.props.onChange(option);
    }
    this.close();
  }
  
  clickOutsideOfWidget(e) {
    if(!this.root) return;
    // Won't work with portals .... perhaps capture click on parent and prevent propagation instead?
    function hasParent(parent, element) {
      if(parent === element) return true;
      if(!element) return false;
      return hasParent(parent, element.parentElement);
    }
    const root = this.root.querySelector('.dropdown__dropdown-container');
    if(!root) return;
    if(hasParent(this.root, e.target)) return;
    this.close();
  }
  
  // Make sure select is opened on keydown.
  // Also open and prefill search box if letter is typed
  onButtonKeyDown(e) {
    // Ignore keydowns on button if widget is open.
    if(this.state.open) return;

    // Dont override custom or browsers key shortcuts.
    if(e.shiftkey || e.ctrlKey || e.altKey) return;
    
    const keyCode = e.which || e.keyCode;

    console.log((e.which || e.keyCode) + e.key);

    // Key up/down and enter/space
    if([40, 38, 32, 13].some(code => code === keyCode)) {
      if(!this.state.open) {
        e.stopPropagation();
        e.preventDefault();
        this.open();
      }
    } else if(/\w/.test(e.key) && e.key.length === 1) {
      // Ignore Special keys 
      if(keyCode <= 46 || keyCode === 91) return;
      e.stopPropagation();
      e.preventDefault();
      this.open();
      this.setState({query: e.key})
    }
  }
              
  getButtonContent() {
    if(this.state.selected === null || this.state.selected.value === undefined) return null;
    return this.state.selected.displayName || this.state.selected.content;
  }
  
  cleanUp() {
    window.removeEventListener('click', this.clickOutsideOfWidget);
    window.removeEventListener('focus', this.clickOutsideOfWidget);
    document.body.classList.remove('dropdown__prevent-scroll');
  }

  open() {
    if(this.state.open || this.props.readonly) return;

    this.setState({open: true});
    
    // Clicking outside of dropdown when dropdown is open should close it again
    window.addEventListener('click', this.clickOutsideOfWidget);
    window.addEventListener('focus', this.clickOutsideOfWidget, true);
    document.body.classList.add('dropdown__prevent-scroll');
  }

  // Make it controllable which option that are selected
  componentWillReceiveProps(nextProps) {
    if(this.props.selected && this.props.selected.value === nextProps.selected.value) return

    this.setState({selected: nextProps.selected});
  }
  
  close() {
    if(!this.state.open) return;
    this.setState({open: false, options: this.getOptions(), query: ''});
    this.cleanUp();
    this.root.querySelector('button').focus();
  }

  componentWillUnmount() {
    this.cleanUp();
  }

  render() {
    return (
      <div ref={root => this.root = root} className={"dropdown--wrapper " + this.props.className} onkeydown={_ => console.log('keydown')}>
        <input type="hidden" name={this.props.name} value={this.state.selected !== null ? this.state.selected.value : ''} />
        <SelectButton
          value={this.getButtonContent()}
          label={this.props.label}
          hideLabelWhenSelected={this.props.hideLabelWhenSelected}
          onClick={_ => this.state.open ? this.close() : this.open()}
          expanded={this.state.open}
          onKeyDown={this.onButtonKeyDown}
          disabled={this.props.disabled}
          removeSelectedText={this.props.removeSelectedText}
          readonly={this.props.readonly}></SelectButton> 
        {this.state.open ? <SelectDropdown
                             button={this.root}
                             query={this.state.query}
                             updateSearch={this.updateSearch}
                             selectOption={this.selectOption}
                             hideSearch={this.props.hideSearch}
                             selected={this.state.selected}
                             createNew={this.props.createNew}
                             options={this.state.options}></SelectDropdown> : null}
        {
          this.state.selected && this.props.viewLink ?
          <div className="dropdown---helper-text">
            <a href={this.props.viewLink(this.state.selected)} target="_blank">{this.props.viewLinkText || this.getButtonContent()}</a>
          </div>
          :
          null
        }
     </div>
    )
  }
}


