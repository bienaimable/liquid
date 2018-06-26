"use strict"
let _ = React.createElement

var nodes = {
    'home': {
        card_type: SelectInput, 
        title: "Choose your metric",
        variable: "metric",
        parameters: {
            source: ['CR', 'COS', 'Spend'],
            source: (load) => {
                load(['CR', 'COS', 'Spend'])
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
            source: cto_advertisers,
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
            source: cto_partners,
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
            source: {'Campaign 1': null, 'Campaign 2': null},
        },
        buttons: [
            {name: "Previous", destination: 'client'},
            {name: "Next", destination: 'end'},
        ],
    },
    'end': {
        card_type: MessageCard, 
        title: "Done",
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
