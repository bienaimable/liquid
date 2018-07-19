import * as Components from "../../static/js/app/components.js"
import * as tree from "./tree.js"
let _ = React.createElement


ReactDOM.render(
    _(Components.CardList, {nodes: tree.nodes}),
    document.getElementById('card_slot')
)
