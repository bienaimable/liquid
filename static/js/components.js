"use strict"


class SelectInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input_id: Math.random().toString().slice(2,18),
        }
    }
    componentDidMount() {
        var element = document.getElementById(this.state.input_id)
        var instances = M.FormSelect.init(element, {});
    }
    render() {
        let options = this.props.data.map(
            option => _( "option", { value: option, key: option }, option),
        )
        options.unshift(
            _( "option", { key: "label",  value: "", disabled: true },
                this.props.label || "Choose an option"
            )
        )
        return [
            _( "div", { key: '1', className: "input-field" },
                _( "select", 
                    {
                        id: this.state.input_id,
                        value: this.props.value || "", 
                        onChange: (e) => this.props.update(e.target.value)
                    }, 
                    options,
                ),
            ),
        ]
    }
}

class DateInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input_id: Math.random().toString().slice(2,18),
        }
    }
    componentDidMount() {
        var element = document.getElementById(this.state.input_id)
        let instance = M.Datepicker.init(element, {
            onSelect: (date) => this.props.update(moment(date).format('YYYY-MM-DD')),
        })
    }
    render() {
        return [
            _("div", {key: "input-field", className: "input-field"},
                _("input", {
                    key: this.state.input_id, 
                    id: this.state.input_id,
                    type: "text", 
                    className: "datepicker"
                }),
                _("label", {key: 'label', htmlFor: this.state.input_id}, 
                    this.props.label || "Choose a date"
                ),
            ),
        ]
    }
}

class AutocompleteInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input_id: Math.random().toString().slice(2,18),
        }
    }
    refresh() {
        let data = {}
        for (let row of this.props.data){
            data[row] = null
        }
        var elems = document.getElementById(this.state.input_id)
        var instances = M.Autocomplete.init(elems, {
            data: data, 
            limit: 5, 
            minLength: 0,
            onAutocomplete: (value) => this.props.update(value),
        })
    }
    componentDidMount() {this.refresh()}
    //componentDidUpdate() {this.refresh()}
    render() {
        return [
            _("div", {key: this.props.label, className: "input-field"},
                _("input", {
                    id: this.state.input_id, 
                    type: "text", 
                    className: "autocomplete"}),
                _("label", {htmlFor: this.state.input_id}, this.props.label),
            ),
        ]
    }
}

class MessageCard extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return [
            _("section", {key: '1'}, this.props.label),
        ]
    }
}


class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            error: false,
            data: [],
        }
        this.errorHandler = this.errorHandler.bind(this)
    }
    errorHandler(error) {
        this.setState({
            error: true,
            error_message: error})
    }
    getSource() {
        let node = this.props.node
        if ('parameters' in node && 'source' in node.parameters){
                node.parameters.source( 
                    (values) => this.setState({
                        loaded: true,
                        data: values,
                    }),
                    this.props.variables,
                    this.errorHandler,
                )
        } else {
            this.setState({loaded: true})
        }
    }
    componentDidMount() {this.getSource()}
    render() {
        let node = this.props.node
        if (this.state.error) { 
            return [ 
                _("div", {key: 'key', className: "card"},
                    _("div", {className: "card-content"},
                        _("span", {className: "card-title"}, "Error"),
                        this.state.error_message.toString(),
                        _("div", {className: "card-action"},
                            _("a", 
                                {
                                    key: 'retry',
                                    href: 'javascript:void(0)',
                                    onClick: () => {
                                        this.setState({loaded: false, error: false})
                                        this.getSource()
                                    }

                                }, 
                                'Retry'
                            )
                        ),

                    )
                )
            ]
        }
        if (!(this.state.loaded)) { 
            return [ 
                _("div", {key: 'key', className: "card"},
                    _("div", {className: "card-content"},
                        "Loading data...",
                    )
                )
            ]
        }
        let input_props = Object.assign(
            { 
                update: (value) => this.props.update([node.variable], value),
                data: this.state.data,
            },
            node.parameters
        )
        return [
            _("div", {key: 'key', className: "card"},
                _("div", {className: "card-content"},
                    _("span", {className: "card-title"}, node.title),
                    _(node['card_type'], input_props),
                    _("div", {className: "card-action"},
                        this.props.buttons,
                    ),
                )
            )
        ]
    }
}

class CardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visited_node_names: ["home"],
            variables: {},
        }
        this.update = (variable, value) => this.setState(
            {
                variables: Object.assign(
                    {[variable]: value},
                    this.state.variables
                )
            }
        )
    }
    componentDidUpdate() {
        window.scrollTo(0,document.body.scrollHeight)
    }
    render() {
        console.log(this.state)
        let cards = this.state.visited_node_names.map(
            node_name =>
            _(Card, {
                key: node_name, 
                node: nodes[node_name], 
                variables: this.state.variables,
                update: this.update,
                buttons: [],
            })
        )
        let last_node_name = this.state.visited_node_names.slice(-1)[0]
        let node = nodes[last_node_name]
        let previous_state = this.state.visited_node_names.slice(0, this.state.visited_node_names.length-1)
        let buttons = [
            _( "a", 
                {
                    key: 'previous_button',
                    href: 'javascript:void(0)',
                    onClick: () => {
                        this.setState({
                            visited_node_names: previous_state
                        })
                    }
                }, 
                'Previous'
            )
        ]
        let additional_buttons = node.buttons.map( button => 
            _(
                "a", 
                {
                    key: button.name + button.destination,
                    href: 'javascript:void(0)',
                    onClick: () => {
                        this.setState({
                            visited_node_names: [ 
                                ...this.state.visited_node_names, 
                                button.destination
                            ]
                        })
                    }
                }, 
                button.name
            )
        )
        buttons = [ ...buttons, ...additional_buttons ]
        cards.pop()
        cards.push(
            _(Card, {
                key: last_node_name, 
                node: nodes[last_node_name], 
                variables: this.state.variables,
                update: this.update,
                buttons: buttons,
            })
        )
        return cards
    }
}
