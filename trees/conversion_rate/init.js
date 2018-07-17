import * as Components from "../../static/js/app/components.js"
let _ = React.createElement

ReactDOM.render(
    _(Components.CardList, null),
    document.getElementById('card_slot')
)
