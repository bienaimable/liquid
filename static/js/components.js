"use strict"


class MetricCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return _(
        "div", {className: "card"},
            _("div", {className: "card-content"},
                _("span", {className: "card-title"}, this.props.title),
                _("p", null, 
                    ""),
                _( "div", { className: "input-field" },
                    _( "select", {id: "metric", value: ""}, 
                        _( "option", { value: "", disabled: true },
                            "Choose a metric"
                        ),
                        _( "option", { value: "cos" }, "COS"),
                        _( "option", { value: "cr" }, "CR"),
                        _( "option", { value: "ctr" }, "CTR"),
                        _( "option", { value: "rext" }, "REXT"),
                        _( "option", { value: "spend" }, "Spend")
                    ),
                    _("label", {htmlFor: "metric"}, "Metric"),
                ),
                _("div", {className: "card-action"},
                _("a", {href: 'javascript:void(0)', onClick: () => this.props.handler('dates')}, "Next"),
                ),
            )
        )
  }
}

class DatesCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
            var elems = document.querySelectorAll('.datepicker');
            var instances = M.Datepicker.init(elems, {});
    }
    render() {
        let buttons = this.props.buttons.map( x => 
            _(
                "a", 
                {
                    href: 'javascript:void(0)', 
                    onClick: () => this.props.handler(x.node)
                }, 
                x.name
            )
        )
        return _("div", {className: "card"},
                _("div", {className: "card-content"},
                    _("span", {className: "card-title"}, "Choose date range"),
                    _( "div", {className: "input-field"},
                        _("label", {htmlFor: "start_date"}, "Start Date"),
                        _("input", {id: "start_date", type: "text", className: "datepicker"}),
                        _("label", {htmlFor: "end_date"}, "End Date"),
                        _("input", {id: "end_date", type: "text", className: "datepicker"}),
                    ),
                    _("div", {className: "card-action"},
                        buttons,
                    ),
                )
        )
    }
}
var tree = {
    'home': {card_type: MetricCard, 
             props: {
                 title: "Choose your metric",
                 buttons: [
                     {name: "Next", node: 'dates'},
                 ],
             }
            },
    'dates': {
        card_type: DatesCard, 
        props: {
            title: "Choose your dates",
            buttons: [
                {name: "Previous", node: 'home'},
                {name: "Next", node: 'metric'},
            ],
        }
    },
    'metric2': {card_type: MetricCard, props: {title: "Choose another metric"}},
}


class CardSlot extends React.Component {
    constructor(props) {
        super(props);
        this.state = { node: "home" }
        this.handler = this.handler.bind(this)
    }
    handler(value) {
        this.setState({node: value})
    }
    render() {
        let props = Object.assign({handler: this.handler}, tree[this.state.node]['props'])
        let component = tree[this.state.node]['card_type']
        return _(component, props)
    }
}

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = { node: "home" }
        this.handler = this.handler.bind(this)
    }
    handler(value) {
        this.setState({node: value})
    }
    render() {
        let props = Object.assign({handler: this.handler}, tree[this.state.node]['props'])
        let component = tree[this.state.node]['card_type']
        return _(component, props)
    }
}
class DatesCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
            var elems = document.querySelectorAll('.datepicker');
            var instances = M.Datepicker.init(elems, {});
    }
    render() {
        let buttons = this.props.buttons.map( x => 
            _(
                "a", 
                {
                    href: 'javascript:void(0)', 
                    onClick: () => this.props.handler(x.node)
                }, 
                x.name
            )
        )
        return _("div", {className: "card"},
                _("div", {className: "card-content"},
                    _("span", {className: "card-title"}, "Choose date range"),
                    _( "div", {className: "input-field"},
                        _("label", {htmlFor: "start_date"}, "Start Date"),
                        _("input", {id: "start_date", type: "text", className: "datepicker"}),
                        _("label", {htmlFor: "end_date"}, "End Date"),
                        _("input", {id: "end_date", type: "text", className: "datepicker"}),
                    ),
                    _("div", {className: "card-action"},
                        buttons,
                    ),
                )
        )
    }
}

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, {});
});
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('#client_id');
  var instances = M.Autocomplete.init(elems, {data: cto_advertisers, limit: 5, minLength: 3});
});
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('#partner_id');
  var instances = M.Autocomplete.init(elems, {data: cto_partners, limit: 5, minLength: 3});
});

        //_("div", {className: "card-content"},
        //    _("span", {className: "card-title"}, "What do you want to investigate?"),
        //    _("p", null, 
        //        ""),
        //    _( "div", { className: "input-field" },
        //        _( "select", {id: "metric", value: ""}, 
        //            _( "option", { value: "", disabled: true },
        //                "Choose a metric"
        //            ),
        //            _( "option", { value: "cos" }, "COS"),
        //            _( "option", { value: "cr" }, "CR"),
        //            _( "option", { value: "ctr" }, "CTR"),
        //            _( "option", { value: "rext" }, "REXT"),
        //            _( "option", { value: "spend" }, "Spend")
        //        ),
        //        _("label", {htmlFor: "metric"}, "Metric"),
        //    ),
        //    //_("label", {htmlFor: "start_date"}, "Start Date"),
        //    //_("input", {id: "start_date", type: "text", className: "datepicker"}),
        //    //_("label", {htmlFor: "end_date"}, "End Date"),
        //    //_("input", {id: "end_date", type: "text", className: "datepicker"}),
        //    //_("div", {className: "input-field"},
        //    //    _("input", {id: "client_id", type: "text", className: "autocomplete"}),
        //    //    _("label", {htmlFor: "client_id"}, "Client"),
        //    //),
        //    //_("div", {className: "input-field"},
        //    //    _("input", {id: "partner_id", type: "text", className: "autocomplete"}),
        //    //    _("label", {htmlFor: "partner_id"}, "Partner"),
        //    //),
        //    //_("div", {className: "input-field"},
        //    //    _("input", {id: "campaign_id", type: "text", className: "autocomplete"}),
        //    //    _("label", {htmlFor: "campaign_id"}, "Campaign ID"),
        //    //),
        //),
