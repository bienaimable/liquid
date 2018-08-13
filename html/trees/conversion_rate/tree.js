import * as Elements from "../../static/js/cards/elements.js"
import * as Helpers from "../../static/js/cards/helpers.js"

import * as Functions from "../conversion_rate/functions.js"

export let nodes = {}
// (Optional) Adding external nodes
import * as SpendTree from "../spend/tree.js"
nodes = Object.assign(nodes, SpendTree.nodes)

nodes = Object.assign(nodes, {
    'home': async (variables, callback) => {
        try {
            let card = {
                title: "Conversion Rate Investigation",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: "",
                },
                buttons: [
                    {name: "Begin", destination: 'client'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
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
    'numberofcampaigns': async (variables, callback) => {
        try {
            let client_id = variables.client.split(" - ")[0]
            let url = `http://watson.oea.criteois.lan/api/v1/query/sherlock/setup/new_campaign?client_id=${client_id}&start_date=${variables.startdate}&end_date=${variables.enddate}`
            let json = await Helpers.watson_download(url)
			let result = detectChangeInCount(json, "campaign_name")
			let description = `Change of status on other campaigns of the same client can affect your campaign conversion rate. `
			if (result) {
			    description = description.concat(`In this case, some campaigns have been activated or paused during the time period mentioned: 
${result.values} on this account on ${result.day}.`) } 
            else {
			    description = description.concat(`In this case, there was no change in the number of active campaigns during this period.`) }
            let card = {
                title: "Number of Campaigns",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                buttons: [
                    {name: "Next", destination: 'cr_setup_sampling_ratio_rule'},
                ],
                autoskip: 5,
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'cr_setup_sampling_ratio_rule': async (variables, callback) => {
        try {
            let client_id = variables.client.split(" - ")[0]
            let campaign_id = variables.campaign.split(" - ")[0]
            let url = `http://watson.oea.criteois.lan/api/v1/query/sherlock/setup/sampling_ratio?client_id=${client_id}&start_date=${variables.startdate}&end_date=${variables.enddate}&campaign_id=${campaign_id}`
            let json = await Helpers.watson_download(url)
			let result = detectChangeInValue(json, ["campaign_sampling_ratio"])
			let description = `Changing the sampling ratio can significantly impact campaign performance. `
			if (result) {
			    description = description.concat(`In this case, indeed, the sampling ratio was changed on ${result.day}.`) } 
            else {
			    description = description.concat(`In this case, there was no change in sampling ratio during the selected period.`) }
            let graph_data = json.results.map( x => x.campaign_sampling_ratio*100 )
            let graph_labels = json.results.map( x => x.day )
            let card = {
			    title: "Sampling Ratio",
                element: Elements.LineGraph, 
                element_parameters: {
                    label: description,
                    data: {
                        labels: graph_labels,
                        datasets: [{
                            label: "Sampling ratio (%)",
                            //backgroundColor: 'rgb(255, 99, 132)',
                            //borderColor: 'rgb(255, 99, 132)',
                            data: graph_data }]}},
                buttons: [
                    {name: "Next", destination: 'cr_setup_capping_rule'},
                ],
                autoskip: 5,
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'cr_setup_capping_rule': async (variables, callback) => {
        try {
            let client_id = variables.client.split(" - ")[0]
            let campaign_id = variables.campaign.split(" - ")[0]
            let url = `http://watson.oea.criteois.lan/api/v1/query/sherlock/setup/capping?client_id=${client_id}&start_date=${variables.startdate}&end_date=${variables.enddate}&campaign_id=${campaign_id}`
            let json = await Helpers.watson_download(url)
			let columns = [ "campaign_capping_starting_day",
						    "campaign_capping_ending_day",
						    "daily_capping",
						    "campaign_capping_since_last_visit",
						    "partner_capping_since_last_visit",
						    "campaign_lifetime_capping" ]
			let result = detectChangeInValue(json, columns)
            let last_item = json.results.slice(-1)[0]
            let pretty_json = Object.keys(last_item).map(
                (key, index) => `${key}: ${last_item[key]}\n` )
            pretty_json = pretty_json.join('')
            
			let description = `${pretty_json}
            Changing the capping parameters can significantly impact campaign performance. `
			if (result) {
			    description = description.concat(`In this case, indeed, the capping parameters were changed on ${result.changes}.`) } 
            else {
			    description = description.concat(`In this case, there was no change of capping during the selected period.`) }
            let card = {
			    title: "Capping Parameters",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description },
                buttons: [
                    {name: "Next", destination: 'cr_setup_segmentation_enabled_rule'},
                ],
                autoskip: 5,
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'cr_setup_segmentation_enabled_rule': async (variables, callback) => {
        try {
            let client_id = variables.client.split(" - ")[0]
            let campaign_id = variables.campaign.split(" - ")[0]
            let url = `http://watson.oea.criteois.lan/api/v1/query/sherlock/setup/segmentation_is_enabled?start_date=${variables.startdate}&end_date=${variables.enddate}&campaign_id=${campaign_id}`
            let json = await Helpers.watson_download(url)
			let columns = [ "campaign_capping_starting_day",
						    "campaign_capping_ending_day",
						    "daily_capping",
						    "campaign_capping_since_last_visit",
						    "partner_capping_since_last_visit",
						    "campaign_lifetime_capping" ]
			let result = json.results.map(x => x.is_segmentation_enabled).includes(1)
			let description = `User segmentation can also affect performance `
            let destination = "cr_setup_banners"
			if (result) {
			    description = description.concat(`and it has been used by this campaign during this period.`)
                destination = "cr_setup_segment_names_rule"}
            else {
			    description = description.concat(`but it has not been used by this campaign during this period.`) }
            let card = {
			    title: "Segmentation Parameters",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description },
                buttons: [
                    {name: "Next", destination: destination},
                ],
                autoskip: 5,
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'cr_setup_segment_names_rule': async (variables, callback) => {
        try {
            let client_id = variables.client.split(" - ")[0]
            let campaign_id = variables.campaign.split(" - ")[0]
            let url = `http://watson.oea.criteois.lan/api/v1/query/sherlock/setup/segment_names?start_date=${variables.startdate}&end_date=${variables.enddate}&campaign_id=${campaign_id}`
            let json = await Helpers.watson_download(url)
			let result = detectChangeInCount(json, "segment_name")
			let description = `Changing what segments are applied to the campaign will affect its audience and delivery. `
			if (result) {
			    description = description.concat(`A segment (${result.values}) was added or removed from this campaign on ${result.day}.`)}
            else {
			    description = description.concat(`However, there were no segment changes on this campaign during this period.`) }
            let card = {
			    title: "Segmentation Parameters",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description },
                buttons: [
                    {name: "Next", destination: "cr_setup_banners"},
                ],
                autoskip: 5,
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'cr_setup_banners': async (variables, callback) => {
        try {
            let client_id = variables.client.split(" - ")[0]
            let campaign_id = variables.campaign.split(" - ")[0]
            let url = `http://watson.oea.criteois.lan/api/v1/query/sherlock/setup/banners?client_id=${client_id}&start_date=${variables.startdate}&end_date=${variables.enddate}&campaign_id=${campaign_id}`
            let json = await Helpers.watson_download(url)
			let result = detectChangeInValue(json, ["banner_count"])
			let description = ``
			if (result) {
			    description = description.concat(`Banners have been changed (${result.changes}) during this period. This can significantly impact campaign performance.`)}
            else {
			    description = description.concat(`There were no banner changes on this campaign during this period.`) }
            let graph_data = json.results.map( x => x.banner_count )
            let graph_labels = json.results.map( x => x.day )
            let card = {
			    title: "Number of Live Banners",
                element: Elements.LineGraph, 
                element_parameters: {
                    label: description,
                    data: {
                        labels: graph_labels,
                        datasets: [{
                            label: "Banner count",
                            data: graph_data }]}},
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: "cr_setup_feed_quality_graph"},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'cr_setup_feed_quality_graph': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://watson.oea.criteois.lan/api/v1/query/sherlock/setup/quality_score?partner_id=${partner_id}&start_date=${variables.startdate}&end_date=${variables.enddate}`
            let json = await Helpers.watson_download(url)
			let description = `Has the feed quality significantly changed over time?`
            let graph_data = json.results.map( x => x.feed_quality )
            let graph_labels = json.results.map( x => x.day )
            let card = {
			    title: "Feed Check",
                element: Elements.LineGraph, 
                element_parameters: {
                    label: description,
                    data: {
                        labels: graph_labels,
                        datasets: [{
                            label: "Feed quality (%)",
                            data: graph_data }]}},
                buttons: [
                    {name: "Yes", destination: "cr_feed_quality_text_yes"},
                    {name: "No", destination: "cr_feed_quality_text_no"},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'cr_feed_quality_text_yes': async (variables, callback) => {
        try {
			let description = `The feed quality has changed over time. A large change in feed quality will affect campaign performance.`
            let card = {
			    title: "",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description },
                buttons: [
                    {name: "Next", destination: "cr_setup_feed_import_rule"},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'cr_feed_quality_text_no': async (variables, callback) => {
        try {
			let description = `The feed quality hasn't changed much over time, so this shouldn't affect performance.`
            let card = {
			    title: "",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description },
                buttons: [
                    {name: "Next", destination: "cr_perf_deduplication_ratio_rule"},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'cr_setup_feed_import_rule': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://watson.oea.criteois.lan/api/v1/query/sherlock/setup/feed_import?partner_id=${partner_id}&start_date=${variables.startdate}&end_date=${variables.enddate}`
            let json = await Helpers.watson_download(url)
			let result = isRecentFeed(json, 0)
			let description = ``
			if (result) {
			    description = description.concat(`The feed has been imported recently.`)}
            else {
			    description = description.concat(`Last feed import was more than 10 days ago.`) }
            let card = {
			    title: "Last Feed Import",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: "cr_perf_deduplication_ratio_rule"},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'cr_perf_deduplication_ratio_rule': async (variables, callback) => {
        try {
            let campaign_id = variables.campaign.split(" - ")[0]
            let url = `http://watson.oea.criteois.lan/api/v1/query/sherlock/performance/dedup?campaign_id=${campaign_id}&start_date=${variables.startdate}&end_date=${variables.enddate}`
            let json = await Helpers.watson_download(url)
			let result = isPercentChangeStable(json, "dedup_ratio", 0)
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
    'end': async (variables, callback) => {
        try {
            let card = {
                title: "",
                element: Elements.PrintCard, 
                element_parameters: {
                    label: "End of report.",
                },
                buttons: [],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
}
)
