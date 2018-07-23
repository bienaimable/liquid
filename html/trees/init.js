import * as Components from "../../static/js/app/components.js"
let _ = React.createElement

let main = async () => {
    let search_parameters = new URLSearchParams(document.location.search) 
    let tree_name = search_parameters.get("_tree") 
    if (tree_name === null) {window.location.replace('/')}
    let variables = {}
    for (let parameter of search_parameters) {
        variables[parameter[0]] = parameter[1]
    }
    let tree_path = `./${tree_name}/tree.js`
    let tree = await import(tree_path);
    ReactDOM.render(
        _(Components.CardList, {nodes: tree.nodes, search_parameters: variables}),
        document.getElementById('card_slot')
    )
}

main()
