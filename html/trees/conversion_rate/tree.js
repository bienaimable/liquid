import * as Elements from "/static/js/cards/elements.js"
import * as Helpers from "/static/js/cards/helpers.js"

import * as Functions from "/trees/conversion_rate/functions.js"

export let nodes = {}
// (Optional) Adding external nodes
//import * as SpendTree from "../spend/tree.js"
//nodes = Object.assign(nodes, SpendTree.nodes)
import * as Parameters from "./nodes/parameters.js"
nodes = Object.assign(nodes, Parameters.nodes)
import * as PartOne from "./nodes/part1.js"
nodes = Object.assign(nodes, PartOne.nodes)
import * as PartTwo from "./nodes/part2.js"
nodes = Object.assign(nodes, PartTwo.nodes)

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
