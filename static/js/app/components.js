let _ = React.createElement
import { nodes } from "../trees/cr.js"

//let tree = {}
////tree['cr'] = await import("../trees/cr.js")
//import("../trees/cr.js")
//    .then((module) => {
//        tree['cr'] = module
//    });

export class Card extends React.Component {
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
