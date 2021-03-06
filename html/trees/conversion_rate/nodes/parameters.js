import * as Elements from "/static/js/cards/elements.js"
import * as Helpers from "/static/js/cards/helpers.js"

import * as Functions from "/trees/conversion_rate/functions.js"

export let nodes = {}

nodes = Object.assign(nodes, {
    'client': async (variables, callback) => {
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
    'partner': async (variables, callback) => {
        try {
            let client_id = variables.client.split(" - ")[0]
            let url = `http://watson.oea.criteois.lan/api/v1/query/sherlock/partner_lookup?client_id=${client_id}`
            let json = await Helpers.watson_download(url)
            let partners = json.results.map(
                result => result.partner_id + " - " + result.partner_name )
            let card = {
                title: "Partner",
                element: Elements.AutocompleteInput, 
                element_parameters: {
                    label: "Partner",
                    variable: "partner",
                    data: partners,
                },
                buttons: [
                    {name: "Next", destination: 'startdate'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'startdate': async (variables, callback) => {
        try {
            let card = {
                title: "Start Date",
                element: Elements.DateInput, 
                element_parameters: {
                    variable: "startdate",
                },
                buttons: [
                    {name: "Next", destination: 'enddate'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'enddate': async (variables, callback) => {
        try {
            let card = {
                title: "End Date",
                element: Elements.DateInput, 
                element_parameters: {
                    variable: "enddate",
                },
                buttons: [
                    {name: "Next", destination: 'campaign'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'campaign': async (variables, callback) => {
        try {
            let client_id = variables.client.split(" - ")[0]
            let url = `http://watson.oea.criteois.lan/api/v1/query/sherlock/campaign_lookup?client_id=${client_id}&start_date=${variables.startdate}&end_date=${variables.enddate}`
            let json = await Helpers.watson_download(url)
            let campaigns = json.results.map(
                result => result.campaign_id + " - " + result.campaign_name )
            let card = {
                title: "Campaign",
                element: Elements.AutocompleteInput, 
                element_parameters: {
                    label: "Campaign",
                    variable: "campaign",
                    data: campaigns,
                },
                buttons: [
                    {name: "Next", destination: 'numberofcampaigns'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
}
)
