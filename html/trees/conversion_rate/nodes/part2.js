import * as Elements from "/static/js/cards/elements.js"
import * as Helpers from "/static/js/cards/helpers.js"

import * as Functions from "/trees/conversion_rate/functions.js"

export let nodes = {}

nodes = Object.assign(nodes, {
    'cr_perf_deduplication_ratio_rule': async (variables, callback) => {
        try {
            let campaign_id = variables.campaign.split(" - ")[0]
            let url = `http://watson.oea.criteois.lan/api/v1/query/sherlock/performance/dedup?campaign_id=${campaign_id}&start_date=${variables.startdate}&end_date=${variables.enddate}`
            let json = await Helpers.watson_download(url)
			let result = Functions.isPercentChangeStable(json, "dedup_ratio", 0)
			let description = ``
			let destination = ``
			if (result) {
			    description = description.concat(`Deduplication ratio is stable.`)
                //destination = "cr_perf_website_sales_share_graph" }
                destination = "cr_perf_deduplication_ratio_graph" }
            else {
			    description = description.concat(`Deduplication ratio is not stable.`)
                destination = "cr_perf_deduplication_ratio_graph" }
            let graph_data = json.results.map( x => x.dedup_ratio )
            let graph_labels = json.results.map( x => x.day )
            let card = {
			    title: "Attribution Model",
                element: Elements.LineGraph, 
                element_parameters: {
                    label: description,
                    data: {
                        labels: graph_labels,
                        datasets: [{
                            label: "Deduplication ratio (%)",
                            data: graph_data }]}},
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: destination},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'cr_perf_deduplication_ratio_graph': async (variables, callback) => {
        try {
            let campaign_id = variables.campaign.split(" - ")[0]
            let url = `http://watson.oea.criteois.lan/api/v1/query/sherlock/performance/dedup?campaign_id=${campaign_id}&start_date=${variables.startdate}&end_date=${variables.enddate}`
            let json = await Helpers.watson_download(url)
			let description = `Do you notice any significant variation in the post-click sales?`
            let graph_data = json.results.map( x => x.post_click_sales )
            let graph_labels = json.results.map( x => x.day )
            let card = {
			    title: "Attribution Model",
                element: Elements.LineGraph, 
                element_parameters: {
                    label: description,
                    data: {
                        labels: graph_labels,
                        datasets: [{
                            label: "Post-click sales",
                            data: graph_data }]}},
                buttons: [
                    {name: "Yes", destination: "end"},
                    {name: "No", destination: "end"},
                    //{name: "Yes", destination: "cr_perf_deduplication_ratio_text"},
                    //{name: "No", destination: "cr_perf_website_sales_share_graph"},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
}
)
