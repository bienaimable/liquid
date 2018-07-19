let _ = React.createElement

export class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            error: false,
            data: [] }}
    getContent() {
        this.props.content_function( 
            this.props.variables,
            (card_content, error) => {
                if (error != null) {
                    this.setState({
                        error: true,
                        error_message: error})} 
                else {
                    this.setState({
                        loaded: true,
                        content: card_content})}})}
    componentDidMount() {this.getContent()}
    componentDidUpdate() {
        setTimeout(() => window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: 'smooth' }), 1 )}
    render() {
        let error_card = this.state.error == true
        let loading_card = !(this.state.loaded)

        let wrapper_style = { height: '80vh' }

        if (error_card) {
            return [
                _("div", {key: 'key', style: wrapper_style},
                    _("div", {key: 'key', className: "card", style: {}},
                        _("div", {className: "card-content"},
                            _("span", {className: "card-title"}, "Error"),
                            this.state.error_message.toString(),
                            _("div", {className: "card-action"},
                                _("a", 
                                    { key: 'retry',
                                      href: 'javascript:void(0)',
                                      onClick: () => {
                                            this.setState({loaded: false, error: false})
                                            this.getContent() }}, 
                                    'Retry')))))]}
        if (loading_card) {
            return [
                _("div", {key: 'key', style: wrapper_style},
                    _("div", {key: 'key', className: "card", style: {}},
                        _("div", {className: "card-content"},
                            "Loading data...")))]}

        let final_card = this.state.content.buttons.length == 0
        let current_card = this.props.next_function !== null
        let start_card = this.props.back_function == null

        let report_style = { transition: '0.5s',
                             paddingTop: 0,
                             paddingBottom: 0,
                             boxShadow: 'none' }

        let element = this.state.content.element
        let element_parameters = this.state.content.element_parameters
        let element_props = Object.assign(
            { assign: (value) => this.props.assign([element_parameters.variable], value) },
            element_parameters )

        if (final_card) {
            return [
                _("div", {key: 'key', style: wrapper_style},
                    _("div", {className: "card", style: report_style},
                        _("div", {className: "card-content"},
                            _("span", {className: "card-title"}, this.state.content.title),
                            _(element, element_props))))]}
        if (!(current_card)) {
            return [
                _("div", {key: 'key', style: {}},
                    _("div", {className: "card", style: report_style},
                        _("div", {className: "card-content"},
                            _("span", {className: "card-title"}, this.state.content.title),
                            _(element, element_props))))]}

        let back_button = [
                _( "a", 
                   { key: 'previous_button',
                     href: 'javascript:void(0)',
                     onClick: this.props.back_function }, 
                   'Previous' )]
        if (start_card) { back_button = [] }

        let next_buttons = this.state.content.buttons.map( button => 
                _(
                    "a", 
                    { key: button.name + button.destination,
                      href: 'javascript:void(0)',
                      onClick: () => this.props.next_function(button.destination) }, 
                    button.name ))
        let buttons = [ ...back_button, ...next_buttons ]
        return [
            _("div", {key: 'key', style: wrapper_style},
                _("div", {className: "card", style: {}},
                    _("div", {className: "card-content"},
                        _("span", {className: "card-title"}, this.state.content.title),
                        _(element, element_props),
                        _("div", {className: "card-action"},
                            buttons ))))]}}



export class CardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visited_node_names: ["home"],
            variables: {} }
        this.assign = (variable, value) => {
            console.log(`${variable} = ${value}`)
            this.setState(
                { variables: Object.assign(
                        this.state.variables,
                        { [variable]: value })})}
        this.back_function = () => {
            let previous_state = this.state.visited_node_names.slice(0, -1)
            this.setState({
                visited_node_names: previous_state })}
        this.next_function = (destination) => {
            this.setState({
                visited_node_names: [ 
                    ...this.state.visited_node_names, 
                    destination ]})}}
    componentDidUpdate() {
        window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: 'smooth' }) }
    render() {
        let cards = []
        if (this.state.visited_node_names.length == 1) {
            let first_node_name = this.state.visited_node_names[0]
            cards.push(
                _(Card, {
                    key: first_node_name, 
                    content_function: this.props.nodes[first_node_name], 
                    variables: this.state.variables,
                    assign: this.assign,
                    back_function: null,
                    next_function: this.next_function }))} 
        else {
            let first_node_names = this.state.visited_node_names.slice(0, -1)
            cards.push(
                ...first_node_names.map(
                    node_name =>
                    _(Card, {
                        key: node_name, 
                        content_function: this.props.nodes[node_name], 
                        variables: this.state.variables,
                        assign: this.assign,
                        back_function: null,
                        next_function: null })))
            let last_node_name = this.state.visited_node_names.slice(-1)[0]
            cards.push(
                _(Card, {
                    key: last_node_name, 
                    content_function: this.props.nodes[last_node_name], 
                    variables: this.state.variables,
                    assign: this.assign,
                    back_function: this.back_function,
                    next_function: this.next_function }))}
        return cards
    }
}
