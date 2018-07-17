let _ = React.createElement

export class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            error: false,
            data: [],
        }
    }
    getContent() {
        this.props.content_function( 
            this.props.variables,
            (card_content, error) => {
                if (error != null) {
                    this.setState({
                        error: true,
                        error_message: error})
                } else {
                    this.setState({
                        loaded: true,
                        content: card_content})
                }
            }
        )
    }
    componentDidMount() {this.getContent()}
    render() {
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
                                        this.getContent()
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
        let element = this.state.content.element
        let element_parameters = this.state.content.element_parameters
        let element_props = Object.assign(
            { update: (value) => this.props.update([element_parameters.variable], value) },
            element_parameters
        )
        let back_button = [
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
        let additional_buttons = this.state.content.buttons.map( button => 
            _(
                "a", 
                {
                    key: button.name + button.destination,
                    href: 'javascript:void(0)',
                    onClick: () => this.props.next_function(button.destination)
                }, 
                button.name
            )
        )
        let buttons = [ ...back_button, ...additional_buttons ]
        if (this.props.buttons == false) { buttons = [] }
        return [
            _("div", {key: 'key', className: "card"},
                _("div", {className: "card-content"},
                    _("span", {className: "card-title"}, this.state.content.title),
                    _(element, element_props),
                    _("div", {className: "card-action"},
                        buttons,
                    ),
                )
            )
        ]
    }
}

export class CardList extends React.Component {
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
        this.back_function = () => {
            let previous_state = this.state.visited_node_names.slice(0, this.state.visited_node_names.length-1)
            this.setState({
                visited_node_names: previous_state
            })
        }
        this.next_function = (destination) => {
            this.setState({
                visited_node_names: [ 
                    ...this.state.visited_node_names, 
                    destination
                ]
            })
        }
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
                content_function: this.props.nodes[node_name], 
                variables: this.state.variables,
                update: this.update,
                back_function: this.back_function,
                next_function: this.next_function,
                buttons: false,
            })
        )
        let last_node_name = this.state.visited_node_names.slice(-1)[0]
        cards.pop()
        cards.push(
            _(Card, {
                key: last_node_name, 
                content_function: this.props.nodes[last_node_name], 
                variables: this.state.variables,
                update: this.update,
                back_function: this.back_function,
                next_function: this.next_function,
                buttons: true,
            })
        )
        return cards
    }
}
