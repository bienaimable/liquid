import * as Elements from "../../static/js/cards/elements.js"
import * as Helpers from "../../static/js/cards/helpers.js"
let _ = React.createElement


function changeInValue(json, columnToCheck) {
  var current_value;
  for (var i = 0; i < json.length; i ++) {
    if (i === 0) {
      current_value = json[0][columnToCheck];
    }
    var next_value = json[i][columnToCheck];
    if (current_value !== next_value) {
      return {day : json[i].day, value : json[i][columnToCheck]};
    }
  }
  return false;
}

function detectChangeInValue(json, columns) {
  var changes_list = [];
  for (var i in columns) {
    var col = columns[i];
    var check = changeInValue(json, col);
    if (check !== false) {
      changes_list.push({col_name : col, day : check.day, value : check.value});
    }
  }
  if (changes_list.length == 0) {
    return false;
  } else {
    var print_strings = [];
    for (var i in changes_list) {
      print_strings.push(changes_list[i].col_name + ' changed to ' + changes_list[i].value + ' on ' + changes_list[i].day);
    }
    return {changes : print_strings.join(', '), change_list : changes_list};
  }
}

function detectChangeInCount(json, columnToCount){
  return changeInCount(getCounts(json, columnToCount));
}

function getCounts(json, columnToCount) {
  var current_date = 0;
  var entry = -1;
  var counts = [];
  for (var i = 0; i < json.length; i ++) {
    if (json[i].day === current_date) {
      counts[entry].count += 1;
      counts[entry].values.push(json[i][columnToCount]);
    } else {
      entry += 1;
      current_date = json[i].day;
      counts[entry] = {day : current_date, count : 1, values : [json[i][columnToCount]]};
    }
  }
  return counts;
}

function changeInCount(json){
  var current_count = 0;
  for (var i = 0; i < json.length; i ++) {
    if (i === 0) {
      current_count = json[i].count;
    } else {
      if (json[i].count !== current_count) {
        return {day : json[i].day, values : json[i].values.join(', ')};
      }
    }
  }
  return false;
}

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
                    variable: "Partner",
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
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'cr_setup_capping_rule': async (variables, callback) => {
        //try {
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
			    description = description.concat(`In this case, there was no change regarding capping during the selected period.`) }
            let graph_data = json.results.map( x => x.campaign_sampling_ratio*100 )
            let graph_labels = json.results.map( x => x.day )
            let card = {
			    title: "Capping Parameters",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description },
                buttons: [
                    {name: "Next", destination: 'end'},
                ],
            }
            callback(card, null)
        //} catch(error) {callback(null, error)}
    },
    'end': async (variables, callback) => {
        try {
            let card = {
                title: "",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: "End of report",
                },
                buttons: [],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
}
)
