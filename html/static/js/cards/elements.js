let _ = React.createElement


export class SelectInput extends React.Component {
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
                        onChange: (e) => this.props.assign(e.target.value)
                    }, 
                    options,
                ),
            ),
        ]
    }
}

export class DateInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input_id: Math.random().toString().slice(2,18),
        }
    }
    componentDidMount() {
        var element = document.getElementById(this.state.input_id)
        let instance = M.Datepicker.init(element, {
            onSelect: (date) => this.props.assign(moment(date).format('YYYY-MM-DD')),
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

export class AutocompleteInput extends React.Component {
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
            onAutocomplete: (value) => this.props.assign(value),
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

export class MessageCard extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return [
            _("section", {key: '1'}, this.props.label),
        ]
    }
}
