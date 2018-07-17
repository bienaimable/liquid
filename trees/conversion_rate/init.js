import * as Components from "../../static/js/app/components.js"
import {nodes} from "./tree.js"
let _ = React.createElement

ReactDOM.render(
    _(Components.CardList, {nodes: nodes}),
    document.getElementById('card_slot')
)
