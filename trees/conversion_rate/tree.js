import * as Elements from "../../static/js/cards/elements.js"
import * as Helpers from "../../static/js/cards/helpers.js"

export let nodes = {
    'home': async (variables, callback) => {
        try {
            let url = "http://settings.oea.criteois.lan/api/v1/topWs/advertisers/GetAdvertisers?limit=0"
            let json = await Helpers.download(url)
            let advertisers = Object.keys(json).map(key => key + " - " + json[key])
            let card = {
                title: "Client",
                element: Elements.AutocompleteInput, 
                element_parameters: {
                    label: "Client",
                    variable: "client",
                    data: advertisers,
                },
                buttons: [
                    {name: "Next", destination: 'partner'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'partner': {
        card_type: Elements.AutocompleteInput, 
        title: "Choose the partner",
        variable: "partner",
        parameters: {
            label: "Partner",
            source: async (callback, variables, error_handler) => {
                try {
                    let host = "http://watson.oea.criteois.lan"
                    let client_id = variables.client.split(" - ")[0]
                    let url = `${host}/api/v1/query/sherlock/partner_lookup?client_id=${client_id}`
                    let json = await Helpers.watson_download(url)
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
        card_type: Elements.DateInput, 
        title: "Choose your start date",
        variable: "startdate",
        buttons: [
            {name: "Next", destination: 'enddate'},
        ],
    },
    'enddate': {
        card_type: Elements.DateInput, 
        title: "Choose your end date",
        variable: "enddate",
        buttons: [
            {name: "Next", destination: 'campaign'},
        ],
    },
    'campaign': {
        card_type: Elements.AutocompleteInput, 
        title: "Choose the campaign",
        variable: "campaign",
        parameters: {
            label: "Campaign",
            source: async (callback, variables, error_handler) => {
                try {
                    let host = "http://watson.oea.criteois.lan"
                    let client_id = variables.client.split(" - ")[0]
                    let url = `${host}/api/v1/query/sherlock/campaign_lookup?client_id=${client_id}&start_date=${variables.startdate}&end_date=${variables.enddate}`
                    let json = await Helpers.watson_download(url)
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
        card_type: Elements.MessageCard, 
        title: "Done",
        variable: null,
        parameters: {
            label: "Investigation complete",
        },
        buttons: [
        ],
    },
}
