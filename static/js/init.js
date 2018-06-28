"use strict"
let _ = React.createElement

var nodes = {
    'home': {
        card_type: SelectInput, 
        title: "Choose your metric",
        variable: "metric",
        parameters: {
            source: (callback, variables) => {
                setTimeout(() => callback(['CR investigation', 'Account general health']), 500)
            },
        },
        buttons: [
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
            //source: (callback, variables) => {
            //    let url = "https://top.criteo.com/topWs/advertisers/GetAdvertisers?limit=0"
            //    fetch(url).then(
            //        response => response.json()
            //    ).then(
            //        json => callback(Object.keys(json).map(key => key + " - " + json[key]))
            //    )
            //}
        },
        buttons: [
            {name: "Next", destination: 'partner'},
        ],
    },
    'partner': {
        card_type: AutocompleteInput, 
        title: "Choose the partner",
        variable: "partner",
        parameters: {
            label: "Partner",
            source: async (callback, variables, error_handler) => {
                try {
                    let host = "http://watson.oea.criteois.lan"
                    let client_id = variables.client.split(" - ")[0]
                    let url = `${host}/api/v1/query/sherlock/partner_lookup?client_id=${client_id}`
                    const query_init = await fetch(url, {method: 'POST'})
                    if (!query_init.ok) {throw Error(query_init.statusText)}
                    const query_info = await query_init.json()
                    let redirect = query_info.result
                    const response = await fetch(host+redirect)
                    if (!response.ok || response.status == 204) {throw Error(response.statusText)}
                    const json = await response.json()
                    callback(json.results.map(
                        result => result.partner_id + " - " + result.partner_name
                    ))
                } catch(error) {error_handler(error)}
            }
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
            {name: "Next", destination: 'enddate'},
        ],
    },
    'enddate': {
        card_type: DateInput, 
        title: "Choose your end date",
        variable: "enddate",
        buttons: [
            {name: "Next", destination: 'campaign'},
        ],
    },
    'campaign': {
        card_type: AutocompleteInput, 
        title: "Choose the campaign",
        variable: "campaign",
        parameters: {
            label: "Campaign",
            source: async (callback, variables, error_handler) => {
                try {
                    let host = "http://watson.oea.criteois.lan"
                    let client_id = variables.client.split(" - ")[0]
                    let url = `${host}/api/v1/query/sherlock/campaign_lookup?client_id=${client_id}&start_date=${variables.startdate}&end_date=${variables.enddate}`
                    const query_init = await fetch(url, {method: 'POST'})
                    if (!query_init.ok) {throw Error(query_init.statusText)}
                    const query_info = await query_init.json()
                    let redirect = query_info.result
                    const response = await fetch(host+redirect)
                    if (!response.ok || response.status == 204) {throw Error(response.statusText)}
                    const json = await response.json()
                    callback(json.results.map(
                        result => result.campaign_id + " - " + result.campaign_name
                    ))
                } catch(error) {error_handler(error)}
            }
        },
        buttons: [
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
        ],
    },
}

ReactDOM.render(
    _(CardList, null),
    document.getElementById('card_slot')
)
