"use strict"
let _ = React.createElement

var nodes = {
    'home': {
        card_type: SelectInput, 
        title: "Choose your metric",
        variable: "metric",
        parameters: {
            source: (callback, variables) => {
                setTimeout(() => callback(['CR', 'COS', 'Spend']), 2000)
            },
        },
        buttons: [
            {name: "Next", destination: 'startdate'},
        ],
    },
    'startdate': {
        card_type: DateInput, 
        title: "Choose your start date",
        variable: "startdate",
        buttons: [
            {name: "Previous", destination: 'home'},
            {name: "Next", destination: 'enddate'},
        ],
    },
    'enddate': {
        card_type: DateInput, 
        title: "Choose your end date",
        variable: "enddate",
        buttons: [
            {name: "Previous", destination: 'startdate'},
            {name: "Next", destination: 'client'},
        ],
    },
    'client': {
        card_type: AutocompleteInput, 
        title: "Choose the client",
        variable: "client",
        parameters: {
            label: "Client",
            source: (callback, variables) => callback(cto_advertisers),
        },
        buttons: [
            {name: "Previous", destination: 'enddate'},
            {name: "Next", destination: 'partner'},
        ],
    },
    'partner': {
        card_type: AutocompleteInput, 
        title: "Choose the partner",
        variable: "partner",
        parameters: {
            label: "Partner",
            source: (callback, variables) => {
                let url = "http://watson.oea.criteois.lan/api/v1/query/sherlock/partner_lookup?client_id="
                fetch(
                    url+variables.client.split(" - ")[0], {method: 'POST'}
                ).then(
                    response => response.json()
                ).then(
                    json => {
                        let redirect = json.result
                        fetch(
                            "http://watson.oea.criteois.lan"+redirect
                        ).then(
                            response => response.json()
                        ).then(
                            json => {
                                console.log(json)
                                callback(json.results.map(
                                    result => result.partner_id + " - " + result.partner_name
                                ))
                            }
                        )
                    }
                )
            }
        },
        buttons: [
            {name: "Previous", destination: 'client'},
            {name: "Next", destination: 'campaign'},
        ],
    },
    'campaign': {
        card_type: AutocompleteInput, 
        title: "Choose the campaign",
        variable: "campaign",
        parameters: {
            label: "Campaign",
            source: (callback, variables) => callback({'Campaign 1': null, 'Campaign 2': null}),
        },
        buttons: [
            {name: "Previous", destination: 'client'},
            {name: "Next", destination: 'end'},
        ],
    },
    'end': {
        card_type: MessageCard, 
        title: "Done",
        variable: null,
        parameters: {
            label: "Investigation complete",
        },
        buttons: [
            {name: "Previous", destination: 'campaign'},
        ],
    },
}

ReactDOM.render(
    _(CardList, null),
    document.getElementById('card_slot')
)
